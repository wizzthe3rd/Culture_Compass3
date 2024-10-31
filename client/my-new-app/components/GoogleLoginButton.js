import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View } from 'react-native';

const GoogleLoginButton = () => {
  return (
    <TouchableOpacity style={styles.button}>
      <View style={styles.buttonContent}>
        <Image
          style={styles.icon}
          source={require('../assets/google-icon.png')}
        />
        <Text style={styles.text}>Login with Google</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingLeft: 12,
    borderRadius: 3,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    marginBottom: 10,
    marginTop: 10,
    shadowRadius: 1,
    elevation: 2,  // for Android
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  icon: {
    width: 18,
    height: 18,
  },
  text: {
    color: '#757575',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Roboto, sans-serif',
  },
});

export default GoogleLoginButton;