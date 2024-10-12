import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function Card({ title, description }) {
  return (
    <View style={styles.card}>
    <Image source={require('../assets/google-placeholder.png')} style={styles.map} />
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    card: {
      height: '80%',
      marginTop: 20,
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    map: {
      width: '100%',
      borderRadius: 8,
    },
  });