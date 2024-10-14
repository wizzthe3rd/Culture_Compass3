import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text } from 'react-native';
import Footer from './components/Footer.js';
import Map from './components/Map.js';
import FactsButton from './components/FactsButton.js';
import RefocusButton from './components/RefocusButton.js';
import PointsView from './components/PointsView.js';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Leaderboard from './components/Leaderboard.js';

export default function App() {
  const [refocus, setRefocus] = useState(false);
  const [points, setPoints] = useState(100);
  const [isModalVisible, setModalVisible] = useState(false);

  const handleRefocus = () => {
    setRefocus(true);
    setTimeout(() => {
      setRefocus(false);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Leaderboard
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />
      {/* Points View */}
      <PointsView points={points} />
      {/* Custom Button to Show Leaderboard */}
      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <FontAwesome5 name="trophy" size={24} color="white" />
      </TouchableOpacity>
      {/* Main Content Scroll View */}
      <ScrollView scrollEnabled={false} style={styles.content}>
        <FactsButton />
        <Map refocus={refocus} setPoints={setPoints} />
      </ScrollView>
      {/* Refocus Button */}
      <RefocusButton onPress={handleRefocus} />
      {/* Footer */}
      <Footer style={styles.footer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#bb7757',
  },
  button: {
    backgroundColor: '#bb7757', // Custom button color
    position: 'absolute',
    top: 120,
    left: 15,
    zIndex: 100,
    padding: 20,
    borderRadius: 50,
    margin: 10,
  },
  buttonText: {
    color: 'white',
    marginLeft: 5,
    fontSize: 16,
  },
  footer: {
  },
});
