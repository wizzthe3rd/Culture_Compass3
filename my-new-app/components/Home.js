import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


export default function Home() {
    return (
        <View style={styles.container}>
        <Text style={styles.text}>Home</Text>
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