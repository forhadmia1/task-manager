import { Task } from '../../src/features/tasks/components/TaskCard';
import { mergeTasksWithLocal } from '../../src/utils/mergeTasksWithLocal';

describe('mergeTasksWithLocal', () => {
  it('preserves the starred status from local cache when merging with remote data', () => {
    const remoteTasks: Task[] = [
      { id: '1', title: 'Remote Task 1', status: 'pending', created_at: '2023-01-01' },
      { id: '2', title: 'Remote Task 2', status: 'complete', created_at: '2023-01-02' },
      { id: '3', title: 'Remote Task 3', status: 'inprogress', created_at: '2023-01-03' },
    ];

    const localTasks: Task[] = [
      { id: '1', title: 'Local Task 1', status: 'pending', created_at: '2023-01-01', starred: true },
      { id: '2', title: 'Local Task 2', status: 'complete', created_at: '2023-01-02', starred: false },
    ];

    const merged = mergeTasksWithLocal(remoteTasks, localTasks);

    expect(merged.length).toBe(3);

    // Should preserve starred
    const task1 = merged.find(t => t.id === '1');
    expect(task1?.starred).toBe(true);
    expect(task1?.title).toBe('Remote Task 1');

    // Should preserve starred
    const task2 = merged.find(t => t.id === '2');
    expect(task2?.starred).toBe(false);

    // New task should just be added
    const task3 = merged.find(t => t.id === '3');
    expect(task3?.title).toBe('Remote Task 3');
  });
});
