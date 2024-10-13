import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Dimensions, Platform, Image } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import cities from '../utils/cities'
import { customDarkThemeMapStyle } from '../utils/mapUtils'
const API_URL = 'ENTER_API_URL'
console.log(API_URL)

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const MAPS_API_KEY = 'AIzaSyB2LAunO5bkWrRj1H-RLB3klhDk5Cu7R-I'
const GEMINI_API_KEY = 'AIzaSyACOy0RiIrmcnRhhMfftgWUF1xhZM_EPG4'

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


    // Adjust based on the new structure
    if (geminiResponse.data && geminiResponse.data.candidates && geminiResponse.data.candidates.length > 0 && geminiResponse.data.candidates[0].content != undefined) {
      const resultText = geminiResponse.data.candidates[0].content.parts[0].text;
      console.log(resultText);  // Log the extracted text
      return resultText;
    } else {
      console.log('Invalid response structure:', geminiResponse.data);
      return null;
    }
  } catch (error) {
    console.error('Error fetching data: ', error.response ? error.response.data : error.message);
    return null;  // Return null if there's an error
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
  const mapRef = useRef(null); 

  // Function to fetch the locations
  const fetchLocations = async () => {
    const allLocations = []; 

    try {
      
      // TODO ADD FUNCTIONALITY COMPONENT TO THE GEMINN RESPONSE AND REPLACE QUERY WITH PARAMETER

      for (const city of cities) {
        const response = await axios.get(
          'https://maps.googleapis.com/maps/api/place/textsearch/json', 
          {
            params: {
              query: `${city} Black Culture`,  
              key: MAPS_API_KEY,  // Replace with your actual API key
              radius: 50000, 
              fields: 'name,formatted_address,geometry.location,photos.photo_reference',
            }
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
            description: geminiRes,  // Store Gemini response as the description
          };
          try {
            const locationResponse = await axios.get(API_URL, singleton); 
            console.log(`${API_URL}`) // Await the response
            console.log(`Singleton : ${locationResponse.data} was sent to the server`);
          } catch (error) {
            console.error('Error in sending location data to the server:', error);
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

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={myRegion}
        onRegionChangeComplete={(region) => setMyRegion(region)}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        zoomEnabled={true}
        scrollEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}
        showsUserLocation={true}
        // customMapStyle={customDarkThemeMapStyle}
        showsCompass={true}
      >
        {locations.map((location, index) => (
          <Marker
            key={index}
            coordinate={location.coordinates}
            title={location.name}
            description={location.description}
            pinColor={Platform.OS === 'android' ? 'navy' : '#000000'}
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
});