import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Entypo from '@expo/vector-icons/Entypo'; //home icon
import FontAwesome from '@expo/vector-icons/FontAwesome'; //search icon
import Fontisto from '@expo/vector-icons/Fontisto';
import Home from './Home';
import Settings from './Settings';
import Search from './Search';
import BlackHistoryFacts from './BlackHistoryFacts';

const Tab = createBottomTabNavigator();

const screenOptions = {
  tabBarShowLabel: false,
  headerShown: false,
  tabBarStyle: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: "#f7f7f7",
    borderRadius: 25,
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 0 }, // Shadow direction and depth
    shadowOpacity: 0.7,
    shadowRadius: 2,
    elevation: 2,
  },
};

export default function Footer() {
  const [modalVisible, setModalVisible] = useState(false); // Manage modal visibility

  return (
    <NavigationContainer style={styles.nav}>
      <Tab.Navigator screenOptions={screenOptions} style={styles.icon}>
        <Tab.Screen 
          name="Home" 
          component={Home} 
          options={{
              tabBarIcon: ({ focused }) => {
                  return (
                      <View style={{ alignItems: 'center', justifyContent: 'center'}}>
                          <Entypo name="home" size={24} color={focused ? '#000000' : 'grey'}/>
                      </View>
                  )
              }
          }}
        />
        
        <Tab.Screen 
          name="Search" 
          component={Search} 
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <TouchableOpacity
                    onPress={() => setModalVisible(true)}  // Open modal on search icon press
                  >
                    <FontAwesome name="search" size={24} color={focused ? '#000000' : 'grey'} />
                  </TouchableOpacity>
                </View>
              )
            }
          }}
        />

        <Tab.Screen 
          name="Settings" 
          component={Settings} 
          options={{
              tabBarIcon: ({ focused }) => {
                  return (
                      <View style={{ alignItems: 'center', justifyContent: 'center'}}>
                          <Fontisto name="player-settings" size={24} color={focused ? '#000000' : 'grey'}/>                    
                      </View>
                  )
              }
          }}
        />
      </Tab.Navigator>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)} // Close modal on Android back press
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Search Modal Content!</Text>
            <Text><BlackHistoryFacts /></Text>
            {/* Close Modal Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>&times;</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  icon: {
    paddingTop: 70,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Dark transparent background
  },
  modalView: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#F194FF',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});