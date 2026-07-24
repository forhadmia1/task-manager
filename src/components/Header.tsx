import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface HeaderProps {
    title?: string;
    leftIcon?: React.ReactNode;
    onPressLeft?: () => void;
    rightIcon?: React.ReactNode;
    onPressRight?: () => void;
    style?: ViewStyle;
    titleStyle?: TextStyle;
}

export function Header({
    title,
    leftIcon,
    onPressLeft,
    rightIcon,
    onPressRight,
    style,
    titleStyle,
}: HeaderProps) {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top }, style]}>
            <View style={styles.content}>
                {/* Left Icon Area */}
                <View style={styles.leftContainer}>
                    {leftIcon && (
                        <TouchableOpacity onPress={onPressLeft} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            {leftIcon}
                        </TouchableOpacity>
                    )}
                </View>

                {/* Title Area */}
                <View style={styles.titleContainer}>
                    {title ? (
                        <Text style={[styles.title, titleStyle]} numberOfLines={1}>
                            {title}
                        </Text>
                    ) : null}
                </View>

                {/* Right Icon Area */}
                <View style={styles.rightContainer}>
                    {rightIcon && (
                        <TouchableOpacity onPress={onPressRight} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            {rightIcon}
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    content: {
        height: 56, // Standard header height
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        justifyContent: 'space-between',
    },
    leftContainer: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    titleContainer: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rightContainer: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
});
