import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import Card from './components/Card.js';
import Footer from './components/Footer.js';
import Map from './components/Map.js';
import FactsButton from './components/FactsButton.js';
import RefocusButton from './components/RefocusButton.js';

export default function App() {
  const [refocus, setRefocus] = useState(false); // State to trigger map refocus

  // Handler for refocusing map
  const handleRefocus = () => {
    setRefocus(true); // Set refocus to true
    setTimeout(() => {
      setRefocus(false); // Reset after refocusing is done
    }, 1000); // Allow the refocus for 1 second
  };

  return (
    <View style={styles.container}>
      <ScrollView scrollEnabled={false} style={styles.content}>
        <FactsButton />
        <Map refocus={refocus} /> 
      </ScrollView>
      <RefocusButton onPress={handleRefocus} /> 
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