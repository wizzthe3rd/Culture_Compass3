import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import Footer from './components/Footer.js';
import Map from './components/Map.js';
import FactsButton from './components/FactsButton.js';
import RefocusButton from './components/RefocusButton.js';
import PointsView from './components/PointsView.js';

export default function App() {
  const [refocus, setRefocus] = useState(false); 
  const [points, setPoints] = useState(100); //moved points to App.js


  const handleRefocus = () => {
    setRefocus(true); 
    setTimeout(() => {
      setRefocus(false); 
    }, 1000); 
  };

  return (
    <View style={styles.container}>
      <PointsView points={points}/>
      <ScrollView scrollEnabled={false} style={styles.content}>
        <FactsButton />
        <Map refocus={refocus} setPoints={setPoints}/> 
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