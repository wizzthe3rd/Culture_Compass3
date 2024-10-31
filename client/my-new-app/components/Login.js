// components/Login.js
import React, { useState } from 'react';
import { Image } from 'react-native'; // Import Image
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground, // Import ImageBackground
} from 'react-native';
import GoogleLoginButton from './GoogleLoginButton'; 

// Dummy login credentials
const dummyUser = {
  username: 'admin',
  password: 'password123',
};

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username === dummyUser.username && password === dummyUser.password) {
      onLogin();
    } else {
      Alert.alert('Login Failed', 'Invalid username or password.');
    }
  };

  return (
    <>
    <ImageBackground
      source={require('../assets/wp9211979-beige-minimalist-wallpapers.png')} 
      style={styles.container}
      resizeMode="cover"
    >
    <Image source={require('../assets/logo.png')} style={styles.image} />
    <Image source={require('../assets/compass.png')} style={styles.compass} />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={()=>{}}>
            <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      </View>
      <GoogleLoginButton />
    </ImageBackground>
    </>
    // Use ImageBackground for the background
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {zIndex: 3,
    width: 250,
    height: 100,
    marginBottom: 80,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: 'white',
  },
  input: {
    width: '80%',
    padding: 10,
    marginBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Slightly transparent background
    borderRadius: 5,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Slightly transparent background
    padding: 15,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    width: '80%',
    marginBottom: 15,
  },
  buttonText: {
    textAlign: 'center',
    color: '#bb7757',
  },
  compass: {
    position: 'absolute',
    zIndex: 1,
    right: 170,
    top : 90,
    width: 50,
    height: 50,
    marginBottom: 20,
  },
});

export default Login;
