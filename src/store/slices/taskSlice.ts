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

  },
});

export const { setOfflineMode, toggleTaskStarred } = taskSlice.actions;

export default taskSlice.reducer;
