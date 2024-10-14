import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Dimensions, Platform, Image, Modal, Text, TouchableOpacity, Animated, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import cities from '../utils/cities'
import { customDarkThemeMapStyle } from '../utils/mapUtils'
import {SERVER_API_URL, MAPS_API_KEY, GEMINI_API_KEY} from "@env"

const insertLocationsIntoDatabase = false;
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const fetchGeminiResponse = async (prompt) => {
  try {
    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (geminiResponse.data && geminiResponse.data.candidates && geminiResponse.data.candidates.length > 0 && geminiResponse.data.candidates[0].content !== undefined) {
      const resultText = geminiResponse.data.candidates[0].content.parts[0].text;
      console.log(resultText);
      return resultText;
    } else {
      console.log('Invalid response structure:', geminiResponse.data);
      return null;
    }
  } catch (error) {
    console.error('Error fetching data: ', error.response ? error.response.data : error.message);
    return null;
  }
};

export default function Map({ refocus }) {
  const initialLocation = {
    latitude: 51.5072,
    longitude: -0.1276,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const [myRegion, setMyRegion] = useState(initialLocation);
  const [locations, setLocations] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [points, setPoints] = useState(0);
  const animatedValue = useRef(new Animated.Value(1)).current;
  const mapRef = useRef(null);

  const fetchLocations = async () => {
    const allLocations = [];

    try {
      for (const city of cities) {
        const response = await axios.get(
          'https://maps.googleapis.com/maps/api/place/textsearch/json',
          {
            params: {
              query: `${city} Black Culture`,
              key: MAPS_API_KEY,
              radius: 50000,
              fields: 'name,formatted_address,geometry.location,photos.photo_reference',
            },
          }
        );

        const places = await Promise.all(response.data.results.map(async (place) => {
          const location = place.geometry.location;

          let photoUrl = null;
          if (place.photos && place.photos.length > 0) {
            const photoReference = place.photos[0].photo_reference;
            photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${MAPS_API_KEY}`;
          }

          // Fetch Gemini response
          const geminiRes = await fetchGeminiResponse(`Create a description for ${place.name}, keep it very minimalistic, no yapping, no more than 20 words.`);

          // Store singleton for location, send to location for initial population
          const singleton = {
            name: place.name,
            address: place.formatted_address,
            city: city,
            coordinates: {
              latitude: location.lat,
              longitude: location.lng,
            },
            photoUrl: photoUrl,
            description: geminiRes, // Store Gemini response as the description
          };
          // IF SERVER reset_locations_on_start flag is True, then locations databse will be empty before this code block, be careful
          
           // use the one from map utils, this is depreciated

          
           if (insertLocationsIntoDatabase) {
            try {
              const locationResponse = await axios.post(`${SERVER_API_URL}/locations`, singleton); 
              // console.log(`${SERVER_API_URL}`) // Await the response
              console.log(`Singleton : ${JSON.stringify(singleton, null, 2)}`)
              console.log("Singleton was sent to the server \n")
            } catch (error) {
              throw error // null
            }     
          }
          return singleton;
        }));
        

        allLocations.push(...places);
      }

      setLocations(allLocations);
    } catch (error) {
      console.error('Error fetching locations:', error.response ? error.response.data : error.message);
    }
  };

  const centerOnUserLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    const newRegion = {
      latitude,
      longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };

    setMyRegion(newRegion);
    mapRef.current.animateToRegion(newRegion, 1);
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    if (refocus) {
      centerOnUserLocation();
    }
  }, [refocus]);

  const handleMarkerPress = (location) => {
    setSelectedLocation(location);
    setModalVisible(true);
  };

  const isInProximity = (userLocation, targetLocation, radius = 100) => {
    const distance = Math.sqrt(
      Math.pow(userLocation.latitude - targetLocation.latitude, 2) +
      Math.pow(userLocation.longitude - targetLocation.longitude, 2)
    );
    return distance <= radius / 100000; // converting meters to degrees (approx.)
  };

  const handleLongPress = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const userLocation = location.coords;

    if (selectedLocation && isInProximity(userLocation, selectedLocation.coordinates)) {
      const newPoints = points + 1;
      setPoints(newPoints);
      Alert.alert('Points Gained!', `Total points: ${newPoints}`);
    } else {
      Alert.alert('No Points Gained', 'You are not in proximity to gain points.');
    }
  };

  const handlePressIn = () => {
    Animated.spring(animatedValue, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={myRegion}
        onRegionChangeComplete={(region) => setMyRegion(region)}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        showsUserLocation={true}
        showsCompass={true}
      >
        {locations.map((location, index) => (
          <Marker
            key={index}
            coordinate={location.coordinates}
            title={location.name}
            onPress={() => handleMarkerPress(location)} // Handle marker press
          >
            {location.photoUrl && (
              <Image
                source={{ uri: location.photoUrl }}
                style={{ width: 20, height: 20, borderRadius: 25 }}
              />
            )}
          </Marker>
        ))}
      </MapView>

      {/* Modal for displaying location details */}
      {selectedLocation && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)} // Close modal
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedLocation.name}</Text>
              <Text style={styles.modalDescription}>{selectedLocation.description}</Text>
              {selectedLocation.photoUrl && (
                <TouchableOpacity
                  onLongPress={handleLongPress}
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                >
                  <Animated.Image
                    source={{ uri: selectedLocation.photoUrl }}
                    style={[styles.modalImage, { transform: [{ scale: animatedValue }] }]}
                  />
                </TouchableOpacity>
              )}
              <Text style={styles.closeButtonText}>Hold to gain points!</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: windowHeight,
    width: windowWidth,
    backgroundColor: '#fff',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalDescription: {
    marginVertical: 10,
    fontSize: 16,
  },
  modalImage: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});