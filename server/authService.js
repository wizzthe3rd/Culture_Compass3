// tHIS FILE IS FOR THE AUTHETICATION FEATURE OF FIREBASE
// Ridwan Adam 12/10/2024

import firebase from 'firebase/app';
import 'firebase/auth';

// Firebase config again?
const firebaseConfig = {
  apiKey: "AIzaSyDUbqmpHQpJir7TBzJaCPfH5gQn4GhoLcQ",
  authDomain: "culture-9c382.firebaseapp.com",
  projectId: "culture-9c382",
  storageBucket: "culture-9c382.appspot.com",
  messagingSenderId: "1043670379982",
  appId: "1:1043670379982:web:ec908b822a3744894f8f9f",
  measurementId: "G-EV3E68NMCJ"

};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Function to sign in user with email and password
export const signIn = (email, password) => {
  return firebase.auth().signInWithEmailAndPassword(email, password);
};

// Function to sign out user
export const signOut = () => {
  return firebase.auth().signOut();
};

// Function to get current user's ID token
export const getCurrentUserToken = () => {
  return firebase.auth().currentUser.getIdToken(/* forceRefresh */ true);
};

// Function to make authenticated API requests
export const makeAuthenticatedRequest = (url, options = {}) => {
  return getCurrentUserToken().then((idToken) => {
    const headers = options.headers || {};
    headers['Authorization'] = `Bearer ${idToken}`;
    return fetch(url, {
      ...options,
      headers,
    });
  });
};


// This function is for the google oauth sign in
export const signInWithGoogle = async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    const result = await firebase.auth().signInWithPopup(provider);  =
    return result;
  } catch (error) {
    console.error("Error signing in with Google:", error.message);
    throw error;
  }
};