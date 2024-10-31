import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, Pressable, FlatList, Image } from 'react-native';

// Dummy data for users and schools
const userDummyData = [
  { id: '1', name: 'PixelVoyager', points: 300 },
  { id: '2', name: 'NebulaKnight', points: 250 },
  { id: '3', name: 'ZenCobra', points: 200 },
  { id: '4', name: 'EchoRogue', points: 150 },
  { id: '5', name: 'CrimsonTide09', points: 100 },
];

const schoolDummyData = [
  { id: '1', name: 'Eton College', totalPoints: 1200 },
  { id: '2', name: 'Harrow School', totalPoints: 800 },
  { id: '3', name: 'Latymer Upper School ', totalPoints: 600 },
  { id: '4', name: 'North London Collegiate School', totalPoints: 500 },
  { id: '5', name: 'Dulwich College', totalPoints: 400 },
];

// Medal images for top rankings
const medals = {
  1: require('../assets/gold-medal.png'),
  2: require('../assets/silver-medal.png'),
  3: require('../assets/bronze-medal.png'),
};

const Leaderboard = ({ isVisible, onClose }) => {
  const [view, setView] = useState('users'); // Default view is 'users'

  // Function to render users or schools based on the current view
  const renderData = () => {
    if (view === 'users') {
      return (
        <FlatList
          data={userDummyData}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View style={styles.item}>
              <Text style={styles.rank}>{index + 1}</Text>
              {index < 3 && <Image source={medals[index + 1]} style={styles.medal} />}
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.points}>{item.points} Points</Text>
            </View>
          )}
        />
      );
    } else {
      return (
        <FlatList
          data={schoolDummyData}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View style={styles.item}>
              {index < 3 && <Image source={medals[index + 1]} style={styles.medal} />}
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.points}>{item.totalPoints} Total Points</Text>
            </View>
          )}
        />
      );
    }
  };

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.header}>Weekly Leaderboard</Text>
          {/* View Switcher */}
          <View style={styles.switchContainer}>
            <Pressable
              style={[styles.switchButton, view === 'users' && styles.activeButton]}
              onPress={() => setView('users')}
            >
              <Text style={styles.switchText}>Top Users</Text>
            </Pressable>
            <Pressable
              style={[styles.switchButton, view === 'schools' && styles.activeButton]}
              onPress={() => setView('schools')}
            >
              <Text style={styles.switchText}>Total by School</Text>
            </Pressable>
          </View>
          {/* Render Data Based on Current View */}
          {renderData()}
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  switchButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#bb7757',
  },
  activeButton: {
    backgroundColor: '#bb7757',
  },
  switchText: {
    color: 'white',
    fontSize: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rank: {
    fontSize: 18,
    width: 30,
  },
  name: {
    flex: 1,
    fontSize: 15,
  },
  points: {
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 10,
  },
  medal: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default Leaderboard;
