import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function PointsView({ points }) {
  const scaleValue = useRef(new Animated.Value(1)).current; // Create an animated value for scaling

  // Function to trigger the animation
  const animatePoints = () => {
    // Start the animation
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.5, // Scale up
        duration: 200, // Duration of the scale up
        useNativeDriver: true, // Use native driver for better performance
      }),
      Animated.timing(scaleValue, {
        toValue: 1, // Scale back to original
        duration: 200, // Duration of the scale down
        useNativeDriver: true, // Use native driver for better performance
      }),
    ]).start();
  };

  // Effect to trigger animation when points change
  useEffect(() => {
    animatePoints();
  }, [points]); // Run the animation when points change

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="face-man-profile" size={54} color="black" />
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
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background for visibility
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
  },
});