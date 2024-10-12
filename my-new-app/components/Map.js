import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

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

  const fetchLocations = async () => {
    try {
      const response = await axios.post(
        'https://places.googleapis.com/v1/places:searchText',
        {
          textQuery: 'Black cultural monuments',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': 'AIzaSyB2LAunO5bkWrRj1H-RLB3klhDk5Cu7R-I',
            'X-Goog-FieldMask': 'places.name,places.displayName,places.formattedAddress,places.location',
          },
        }
      );
  
      // Check the response structure from the API and map it properly
      const places = response.data.places.map((place) => {
        const location = place.location; // Use the correct 'location' key
        return {
          name: place.displayName.text, // Get the 'displayName.text'
          address: place.formattedAddress, // Get the 'formattedAddress'
          coordinates: {
            latitude: location.latitude, // Correct access to latitude
            longitude: location.longitude, // Correct access to longitude
          },
        };
      });
  
      setLocations(places); // Update the locations state with the parsed data from the API
      console.log('Locations:', places);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

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
        ref={mapRef} // Attach reference to the MapView
        style={styles.map}
        region={myRegion}
        onRegionChangeComplete={(region) => setMyRegion(region)}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        zoomEnabled={true}
        scrollEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}
        showsUserLocation={true}
        showsCompass={true}
      >
        {locations.map((location, index) => (
          <Marker
            key={index}
            coordinate={location.coordinates}
            title={location.name}
            description={location.address}
          />
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