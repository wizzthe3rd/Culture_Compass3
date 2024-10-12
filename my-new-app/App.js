import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import Header from './components/Header.js';


export default function App() {
  return (
    <View style={styles.container}>
      <Header title="Welcome to My App d" />
      <ScrollView style={styles.content}>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    paddingHorizontal: 20,
    marginVertical: 10,
  },
});