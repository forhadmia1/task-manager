import { selectFilteredAndSortedTasks } from '../../../src/store/selectors/taskSelectors';
import { RootState } from '../../../src/store/index';
import { Task } from '../../../src/features/tasks/components/TaskCard';

describe('taskSelectors', () => {
  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Task A',
      status: 'pending',
      created_at: '2023-01-01T10:00:00Z',
      category_id: 'cat1',
      due_date: '2023-01-05T10:00:00Z',
    },
    {
      id: '2',
      title: 'Task B',
      status: 'inprogress',
      created_at: '2023-01-02T10:00:00Z',
      category_id: 'cat2',
      due_date: '2023-01-04T10:00:00Z',
    },
    {
      id: '3',
      title: 'Task C',
      status: 'complete',
      created_at: '2023-01-03T10:00:00Z',
      category_id: 'cat1',
      // No due date
    },
  ];

  const mockState = {
    tasks: {
      tasks: mockTasks,
    }
  } as RootState;

  it('filters by status', () => {
    const selector = selectFilteredAndSortedTasks('open', '', 'created_at_desc', 'all');
    const result = selector(mockState);
    expect(result.length).toBe(2);
    expect(result.every(t => t.status !== 'complete')).toBe(true);
  });

  it('filters by category', () => {
    const selector = selectFilteredAndSortedTasks('all', '', 'created_at_desc', 'cat1');
    const result = selector(mockState);
    expect(result.length).toBe(2);
    expect(result.every(t => t.category_id === 'cat1')).toBe(true);
  });

  it('filters by search query', () => {
    const selector = selectFilteredAndSortedTasks('all', 'task b', 'created_at_desc', 'all');
    const result = selector(mockState);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('2');
  });

  it('sorts by created_at_desc', () => {
    const selector = selectFilteredAndSortedTasks('all', '', 'created_at_desc', 'all');
    const result = selector(mockState);
    expect(result[0].id).toBe('3');
    expect(result[1].id).toBe('2');
    expect(result[2].id).toBe('1');
  });

  it('sorts by created_at_asc', () => {
    const selector = selectFilteredAndSortedTasks('all', '', 'created_at_asc', 'all');
    const result = selector(mockState);
    expect(result[0].id).toBe('1');
    expect(result[1].id).toBe('2');
    expect(result[2].id).toBe('3');
  });

});
