import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import Header from './components/Header.js';
import Map from './components/Map.js'


export default function App() {
  return (
    <View style={styles.container}>
      <Map />
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
});