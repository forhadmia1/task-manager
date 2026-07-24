import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TaskDetailsScreen } from '../../features/tasks/screens/TaskDetailsScreen';
import { AppStackParamList } from '../types';
import { BottomTabNavigator } from './BottomTabNavigator';
import { EditTaskScreen } from '../../features/tasks/screens/EditTaskScreen';

const Stack = createNativeStackNavigator<AppStackParamList>();

export function MainNavigator() {
  return (
    <Stack.Navigator initialRouteName='Tab' screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Tab"
        component={BottomTabNavigator}
        options={{ title: 'My Tasks' }}
      />
      <Stack.Screen
        name="TaskDetails"
        component={TaskDetailsScreen}
        options={{ title: 'Task Details' }}
      />
      <Stack.Screen
        name="EditTask"
        component={EditTaskScreen}
        options={{ title: 'Edit Task' }}
      />
    </Stack.Navigator>
  );
}
