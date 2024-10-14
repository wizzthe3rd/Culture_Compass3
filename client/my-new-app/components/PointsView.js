import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function PointsView({ points }) {

  return (
    <>
      <View style={styles.container}>
        <MaterialCommunityIcons name="face-man-profile" size={54} color="black" />
        <View style={styles.points}>
            <Text style={styles.pointsText}>{points}</Text>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',  // Position absolutely inside the container
    bottom: 690,  // Bottom left of the container
    width: 'fit-content',
    left: 18,
    zIndex: 10,  // Ensure this view stays on top of the map and other components
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',  // Semi-transparent background for visibility
    padding: 10,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  pointsText: {
    fontSize: 18,
    marginLeft: 10,
  }
});