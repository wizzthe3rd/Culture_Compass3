import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


export default function Settings() {

    

    return (
        <View style={styles.container}>
        <Text style={styles.text}>Settings</Text>
        </View>
    );
    }
const styles = StyleSheet.create({
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },

    });