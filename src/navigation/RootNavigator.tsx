import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import { useAppDispatch } from '../store';
import { setOfflineMode } from '../store/slices/taskSlice';
import { MainNavigator } from './navigators/MainNavigator';

export function RootNavigator() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      // isConnected can be true, false, or null. Default to offline if false.
      dispatch(setOfflineMode(state.isConnected === false));
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  return (
    <NavigationContainer>
      <MainNavigator />
    </NavigationContainer>
  );
}
