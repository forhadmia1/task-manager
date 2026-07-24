import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../config/supabase';
import { Task } from '../../features/tasks/components/TaskCard';
import { mergeTasksWithLocal } from '../../utils/mergeTasksWithLocal';

export interface Category {
  id: string;
  created_at: string;
  name: string;
}

interface TaskState {
  tasks: Task[];
  categories: Category[];
  isOffline: boolean;
  isRefreshing: boolean;
  lastRefreshedAt: string | null;
}

const initialState: TaskState = {
  tasks: [],
  categories: [],
  isOffline: false,
  isRefreshing: false,
  lastRefreshedAt: null,
};

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Task[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'tasks/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as Category[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData: Omit<Task, 'id' | 'created_at' | 'starred' | 'status'>, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([taskData])
        .select()
        .single();

      if (error) throw error;
      return data as Task;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, updates }: { id: string; updates: Partial<Omit<Task, 'id' | 'created_at'>> }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Task;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setOfflineMode: (state, action: PayloadAction<boolean>) => {
      state.isOffline = action.payload;
    },
    toggleTaskStarred: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task) {
        task.starred = !task.starred;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchTasks.pending, (state) => {
        state.isRefreshing = true;
        state.isOffline = false;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isRefreshing = false;
        state.isOffline = false;
        state.tasks = mergeTasksWithLocal(action.payload, state.tasks);
        state.lastRefreshedAt = new Date().toISOString();
      })
      .addCase(fetchTasks.rejected, (state) => {
        state.isRefreshing = false;
        state.isOffline = true;
      })
      // Create Task
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload);
      })
      // Update Task
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      // Fetch Categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })

  },
});

export const { setOfflineMode, toggleTaskStarred } = taskSlice.actions;

export default taskSlice.reducer;
