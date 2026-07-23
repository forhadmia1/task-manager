import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TaskListScreen } from '../../features/tasks/screens/TaskListScreen';
import { TaskDetailsScreen } from '../../features/tasks/screens/TaskDetailsScreen';
import { TasksStackParamList } from '../types';

const Stack = createNativeStackNavigator<TasksStackParamList>();

export function TasksStackNavigator() {
  return (
    <Stack.Navigator initialRouteName='TaskList' screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="TaskList"
        component={TaskListScreen}
        options={{ title: 'My Tasks' }}
      />
      <Stack.Screen
        name="TaskDetails"
        component={TaskDetailsScreen}
        options={{ title: 'Task Details' }}
      />
    </Stack.Navigator>
  );
}
