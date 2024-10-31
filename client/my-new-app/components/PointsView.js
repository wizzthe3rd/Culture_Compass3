import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function PointsView({ points }) {
  const scaleValue = useRef(new Animated.Value(1)).current; 

  const animatePoints = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.5, // Scale up
        duration: 200, // Duration of the scale up
        useNativeDriver: true, 
      }),
      Animated.timing(scaleValue, {
        toValue: 1, // Scale back to original
        duration: 200, // Duration of the scale down
        useNativeDriver: true, 
      }),
    ]).start();
  };

  // Effect to trigger animation when points change
  useEffect(() => {
    animatePoints();
  }, [points]); // Run the animation when points change

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="face-man-profile" size={54} color="white" />
      <View style={styles.points}>
        <Animated.Text style={[styles.pointsText, { transform: [{ scale: scaleValue }] }]}>
          {points}
        </Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 690,
    width: 'fit-content',
    left: 18,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#bb7757', // Semi-transparent background for visibility
    padding: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  pointsText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 10,
  },
});