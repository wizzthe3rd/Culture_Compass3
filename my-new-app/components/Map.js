  import React, { useState, useEffect, useRef } from 'react';
  import { StyleSheet, View, Dimensions, Platform } from 'react-native';
  import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
  import * as Location from 'expo-location';
  import axios from 'axios';

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const customDarkThemeMapStyle = [
    {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 13
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#144b53"
            },
            {
                "lightness": 14
            },
            {
                "weight": 1.4
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#08304b"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#0c4152"
            },
            {
                "lightness": 5
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#0b434f"
            },
            {
                "lightness": 25
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#0b3d51"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "color": "#146474"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#021019"
            }
        ]
    }
  ]

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
      const cities = ['Southampton', 'London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds', 'Bristol', 'Nottingham', 'Glasgow', 'Edinburgh','Coventry','Cambridge','Leicester']; 
      const allLocations = []; 
    
      try {
        for (const city of cities) {
          const response = await axios.get(
            'https://maps.googleapis.com/maps/api/place/textsearch/json', 
            {
              params: {
                query: `${city} Black Culture`,  // Dynamically substitute the city name
                key: 'AIzaSyB2LAunO5bkWrRj1H-RLB3klhDk5Cu7R-I',    
                radius: 50000, 
                fields: 'name,formatted_address,geometry.location'
              }
            }
          );
    
          // Extract the places and map them to the desired format
          const places = response.data.results.map((place) => {
            const location = place.geometry.location;
    
            return {
              name: place.name,
              address: place.formatted_address,
              city: city,  
              coordinates: {
                latitude: location.lat,
                longitude: location.lng,
              },
            };
          });
    
          // Append the results of the current city to the aggregated list
          allLocations.push(...places);
        }
    
        // Update state with the combined locations from all cities
        setLocations(allLocations);
        console.log('All Locations:', allLocations);
      } catch (error) {
        console.error('Error fetching data: ', error.response ? error.response.data : error.message);
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