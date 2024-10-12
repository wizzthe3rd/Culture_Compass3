import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import Header from './components/Header.js';
import Card from './components/Card.js';
import Footer from './components/Footer.js';


export default function App() {
  return (
    
    <View style={styles.container}>
      <Header title="Welcome" />
      <ScrollView style={styles.content}>
        <Card title="Card 1" description="This is card 1" />
        <Card title="Card 2" description="This is card 2" />
      </ScrollView>
      <Footer />
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