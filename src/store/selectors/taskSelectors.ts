import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';

export type TaskStatusFilter = 'all' | 'open' | 'inprogress' | 'complete';
export type TaskSortOption = 'created_at_desc' | 'created_at_asc';

const selectAllTasks = (state: RootState) => state.tasks.tasks;

export const selectFilteredAndSortedTasks = (
  statusFilter: TaskStatusFilter,
  searchQuery: string,
  sortOption: TaskSortOption,
  categoryId: string
) => createSelector(
  [selectAllTasks],
  (tasks) => {
    let filteredTasks = tasks;

    // Filter by category
    if (categoryId !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.category_id === categoryId);
    }

    // 1. Filter by status
    if (statusFilter !== 'all') {
      if (statusFilter === 'open') {
        filteredTasks = filteredTasks.filter(task => task.status === 'open');
      } else if (statusFilter === 'inprogress') {
        filteredTasks = filteredTasks.filter(task => task.status === 'inprogress');
      } else if (statusFilter === 'complete') {
        filteredTasks = filteredTasks.filter(task => task.status === 'complete');
      }
    }

    // 2. Filter by search query
    if (searchQuery.trim().length > 0) {
      const lowerQuery = searchQuery.toLowerCase();
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(lowerQuery)
      );
    }

    // 3. Sort
    filteredTasks = [...filteredTasks].sort((a, b) => {
      switch (sortOption) {
        case 'created_at_desc':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'created_at_asc':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        default:
          return 0;
      }
    });

    return filteredTasks;
  }
);
