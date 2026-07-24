import React from 'react';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { CategoryListScreen } from '../../features/categories/screens/CategoryListScreen';
import { BottomTabParamList } from '../types';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { CheckSquare, Folder } from 'lucide-react-native';
import { TaskListScreen } from '../../features/tasks/screens/TaskListScreen';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const MyTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;
        const color = isFocused ? '#2563EB' : '#6B7280';

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabItem}
          >
            {route.name === 'TasksTab' ? (
              <CheckSquare color={color} size={24} />
            ) : (
              <Folder color={color} size={24} />
            )}
            <Text style={[styles.tabLabel, { color }]}>
              {label as string}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export function BottomTabNavigator() {
  return (
    <Tab.Navigator initialRouteName='TasksTab' screenOptions={{ headerShown: false }} tabBar={(props) => <MyTabBar {...props} />}>
      <Tab.Screen
        name="TasksTab"
        component={TaskListScreen}
      />
      <Tab.Screen
        name="CategoriesTab"
        component={CategoryListScreen}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: 20, // adjust for safe area usually
    paddingTop: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});
