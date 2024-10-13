import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Entypo from '@expo/vector-icons/Entypo'; //home icon
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
                    <Entypo name="light-bulb" size={24} ccolor={focused ? '#000000' : 'grey'} />
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
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)} // Close modal on Android back press
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
          <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>&times;</Text>
            </TouchableOpacity>
            <Text><BlackHistoryFacts /></Text>

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
    backgroundColor: 'rgba(0, 0, 0, 0.2)',  // Dark transparent background
    borderRadius: 25,
  },
  modalView: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
  },
  modalText: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    zIndex: 1,
    right: 16,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 50,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 40,
  },
});