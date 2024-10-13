import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Dimensions, Platform, Image } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const customDarkThemeMapStyle = [
  // Your existing dark theme styles
];

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
    const cities = ['Southampton', 'London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds', 'Bristol', 'Nottingham', 'Glasgow', 'Edinburgh', 'Coventry', 'Cambridge', 'Leicester']; 
    const allLocations = []; 

    try {
      for (const city of cities) {
        const response = await axios.get(
          'https://maps.googleapis.com/maps/api/place/textsearch/json', 
          {
            params: {
              query: `${city} Black Culture`,  
              key: 'AIzaSyB2LAunO5bkWrRj1H-RLB3klhDk5Cu7R-I',  // Replace with your actual API key
              radius: 50000, 
              fields: 'name,formatted_address,geometry.location,photos.photo_reference',
            }
          }
        );

        const places = response.data.results.map((place) => {
          const location = place.geometry.location;

          // If there is a photo, construct the photo URL
          let photoUrl = null;
          if (place.photos && place.photos.length > 0) {
            const photoReference = place.photos[0].photo_reference;
            photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=AIzaSyB2LAunO5bkWrRj1H-RLB3klhDk5Cu7R-I`;
          }

          return {
            name: place.name,
            address: place.formatted_address,
            city: city,  
            coordinates: {
              latitude: location.lat,
              longitude: location.lng,
            },
            photoUrl: photoUrl,
          };
        });

        allLocations.push(...places);
      }

      setLocations(allLocations);
    } catch (error) {
      console.error('Error fetching data: ', error.response ? error.response.data : error.message);
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
        customMapStyle={customDarkThemeMapStyle}
        showsCompass={true}
      >
        {locations.map((location, index) => (
          <Marker
            key={index}
            coordinate={location.coordinates}
            title={location.name}
            description={location.address}
            pinColor={'#000000'}
          >
            {location.photoUrl && (
              <Image
                source={{ uri: location.photoUrl }}
                style={{ width: 50, height: 50, borderRadius: 25 }}
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