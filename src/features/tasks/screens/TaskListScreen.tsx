import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function TaskListScreen() {


  return (
    <View style={styles.container}>
      <Text style={{
        color: 'black'
      }}>Task List Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },

});
