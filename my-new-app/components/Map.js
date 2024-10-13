import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Dimensions, Platform, Image, Modal, Text, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import cities from '../utils/cities';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const MAPS_API_KEY = 'AIzaSyB2LAunO5bkWrRj1H-RLB3klhDk5Cu7R-I';
const GEMINI_API_KEY = 'AIzaSyACOy0RiIrmcnRhhMfftgWUF1xhZM_EPG4';

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

    if (geminiResponse.data && geminiResponse.data.candidates && geminiResponse.data.candidates.length > 0 && geminiResponse.data.candidates[0].content != undefined) {
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

          return {
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
        }));

        allLocations.push(...places);
      }

      setLocations(allLocations);
    } catch (error) {
      console.error('Error fetching locations:', error.response ? error.response.data : error.message);
    }
  };

  // Center the map on user's location
  const centerOnUserLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
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

  // Handle marker press to show modal
  const handleMarkerPress = (location) => {
    setSelectedLocation(location);
    setModalVisible(true);
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
                <Image source={{ uri: selectedLocation.photoUrl }} style={styles.modalImage} />
              )}
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
    flex: 1,
    height: windowHeight,
    width: windowWidth,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});