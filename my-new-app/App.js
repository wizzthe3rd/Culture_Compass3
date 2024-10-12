import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Card from './components/Card.js';
import Footer from './components/Footer.js';
import Map from './components/Map.js';
import FactsButton from './components/FactsButton.js';

export default function App() {
  
  return (
    <View style={styles.container}>
      <ScrollView scrollEnabled={false} style={styles.content}>
        <FactsButton />
        <Map />
      </ScrollView>
      <Footer style={styles.Footer}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});