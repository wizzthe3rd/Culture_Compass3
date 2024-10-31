// App.js
import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import Footer from './components/Footer.js';
import Map from './components/Map.js';
import FactsButton from './components/FactsButton.js';
import RefocusButton from './components/RefocusButton.js';
import PointsView from './components/PointsView.js';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Leaderboard from './components/Leaderboard.js';
import Login from './components/Login.js'; // Import the Login component

export default function App() {
  const [refocus, setRefocus] = useState(false);
  const [points, setPoints] = useState(100);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Manage login state

  const handleRefocus = () => {
    setRefocus(true);
    setTimeout(() => {
      setRefocus(false);
    }, 1000);
  };

  const handleLogin = () => {
    setIsLoggedIn(true); // Change login state
  };

  return (
    <View style={styles.container}>
      {isLoggedIn ? (
        <>
          <Leaderboard
            isVisible={isModalVisible}
            onClose={() => setModalVisible(false)}
          />
          <PointsView points={points} />
          <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
            <FontAwesome5 name="trophy" size={24} color="white" />
          </TouchableOpacity>
          <ScrollView scrollEnabled={false} style={styles.content}>
            <FactsButton />
            <Map refocus={refocus} setPoints={setPoints} />
          </ScrollView>
          <RefocusButton onPress={handleRefocus} />
          <Footer style={styles.footer} />
        </>
      ) : (
        <Login onLogin={handleLogin} /> // Render the Login component if not logged in
      )}
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
    top: 170,
    left: 15,
    zIndex: 100,
    padding: 20,
    borderRadius: 50,
    margin: 10,
  },
  footer: {},
});
