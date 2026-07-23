import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function TaskDetailsScreen({ route }: any) {
  const { id } = route?.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Task Details Page for ID: {id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18, color: '#333' }
});
