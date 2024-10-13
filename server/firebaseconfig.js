// This is simply the file to initialize and configurate the firebase
// Ridwan (clappedspeed) 12/10/2024
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that I need to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export {firestore};