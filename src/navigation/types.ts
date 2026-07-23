import type { NavigatorScreenParams } from '@react-navigation/native';

export type TasksStackParamList = {
  TaskList: undefined;
  TaskDetails: undefined; // Add route params here if any
};

export type BottomTabParamList = {
  TasksTab: NavigatorScreenParams<TasksStackParamList>;
  CategoriesTab: undefined;
};
