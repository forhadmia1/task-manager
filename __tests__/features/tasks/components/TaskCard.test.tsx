import 'react-native';
import React from 'react';
import { TaskCard, Task } from '../../../../src/features/tasks/components/TaskCard';
import renderer, { act } from 'react-test-renderer';

jest.mock('lucide-react-native', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Calendar: () => <View />,
    CheckCircle2: () => <View />,
    Circle: () => <View />,
    Clock: () => <View />,
    Star: () => <View />,
  };
});

describe('TaskCard Component', () => {
  it('renders the task title correctly', () => {
    const mockTask: Task = {
      id: '1',
      title: 'Buy Groceries',
      status: 'pending',
      created_at: '2023-01-01',
      starred: false,
    };

    let tree: any;
    act(() => {
      tree = renderer.create(<TaskCard task={mockTask} />);
    });

    const stringifiedTree = JSON.stringify(tree.toJSON());
    expect(stringifiedTree).toContain('Buy Groceries');
  });

  it('renders "Completed" text when task status is complete', () => {
    const mockTask: Task = {
      id: '2',
      title: 'Do Homework',
      status: 'complete',
      created_at: '2023-01-01',
    };

    let tree: any;
    act(() => {
      tree = renderer.create(<TaskCard task={mockTask} />);
    });

    const stringifiedTree = JSON.stringify(tree.toJSON());
    expect(stringifiedTree).toContain('Completed');
  });
});
