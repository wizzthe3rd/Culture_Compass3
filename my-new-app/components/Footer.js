import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Entypo from '@expo/vector-icons/Entypo'; //home icon
import FontAwesome from '@expo/vector-icons/FontAwesome'; //search icon
import Fontisto from '@expo/vector-icons/Fontisto';
import Home from './Home';
import Settings from './Settings';
import Search from './Search';


const Tab = createBottomTabNavigator();
const screenOptions = {
  tabBarShowLabel: false,
  headerShown: false,
  tabBarStyle: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 0,
    height: 100,
    backgroundColor: "#f7f7f7",
    borderRadius: 100,
  },
}

export default function Footer() {
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
                        <Entypo name="home" size={24} color={focused ? '#f9744d' : 'grey'}/>
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
                    <View style={{ alignItems: 'center', justifyContent: 'center'}}>
                        <FontAwesome name="search" size={24} color={focused ? '#f9744d' : 'grey'} />
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
                        <Fontisto name="player-settings" size={24} color={focused ? '#f9744d' : 'grey'}/>                    
                    </View>
                )
            }
        }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
    icon:{
        paddingTop: 70,
    },
  footer: {
    backgroundColor: '',
    alignItems: 'center',
  },
  footerText: {
    color: 'white',
    fontSize: 14,
  },
});