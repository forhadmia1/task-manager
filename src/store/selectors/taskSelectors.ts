import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';

export type TaskStatusFilter = 'all' | 'open' | 'inprogress' | 'complete';
export type TaskSortOption = 'created_at_desc' | 'created_at_asc';

const selectAllTasks = (state: RootState) => state.tasks.tasks;

export const selectFilteredAndSortedTasks = (searchQuery: string) => createSelector(
  [selectAllTasks],
  (tasks) => {
    let filteredTasks = tasks;

    // 3. Filter by search query
    if (searchQuery.trim().length > 0) {
      const lowerQuery = searchQuery.toLowerCase();
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(lowerQuery)
      );
    }

    return filteredTasks;
  }
);
