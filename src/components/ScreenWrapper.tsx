import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export interface ScreenWrapperProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

export function ScreenWrapper({ children, style }: ScreenWrapperProps) {
    return (
        <SafeAreaView style={[styles.container, style]} edges={['bottom', 'left', 'right']}>
            {children}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
});
