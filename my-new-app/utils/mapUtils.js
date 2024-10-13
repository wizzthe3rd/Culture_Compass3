import axios from 'axios';
import cities from './cities';  
import * as Location from 'expo-location';  // Import Location API
const API_KEY = 'AIzaSyB2LAunO5bkWrRj1H-RLB3klhDk5Cu7R-I'

// Function to fetch the locations
export const fetchLocations = async () => {
  const allLocations = [];

  try {
    for (const city of cities) {
      const response = await axios.get(
        'https://maps.googleapis.com/maps/api/place/textsearch/json', 
        {
          params: {
            query: `${city} Black Culture`,  
            key: API_KEY,
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
          photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${API_KEY}`;
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
  } catch (error) {
    console.error('Error fetching data: ', error.response ? error.response.data : error.message);
  }

  return allLocations;
};



export const centerOnUserLocation = async (mapRef, setMyRegion) => {
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

const customDarkThemeMapStyle = [
  {
      "featureType": "all",
      "elementType": "all",
      "stylers": [
          {
              "visibility": "on"
          }
      ]
  },
  {
      "featureType": "all",
      "elementType": "labels",
      "stylers": [
          {
              "visibility": "off"
          },
          {
              "saturation": "-100"
          }
      ]
  },
  {
      "featureType": "all",
      "elementType": "labels.text.fill",
      "stylers": [
          {
              "saturation": 36
          },
          {
              "color": "#000000"
          },
          {
              "lightness": 40
          },
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "all",
      "elementType": "labels.text.stroke",
      "stylers": [
          {
              "visibility": "off"
          },
          {
              "color": "#000000"
          },
          {
              "lightness": 16
          }
      ]
  },
  {
      "featureType": "all",
      "elementType": "labels.icon",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "administrative",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "color": "#000000"
          },
          {
              "lightness": 20
          }
      ]
  },
  {
      "featureType": "administrative",
      "elementType": "geometry.stroke",
      "stylers": [
          {
              "color": "#000000"
          },
          {
              "lightness": 17
          },
          {
              "weight": 1.2
          }
      ]
  },
  {
      "featureType": "landscape",
      "elementType": "geometry",
      "stylers": [
          {
              "color": "#000000"
          },
          {
              "lightness": 20
          }
      ]
  },
  {
      "featureType": "landscape",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "color": "#4d6059"
          }
      ]
  },
  {
      "featureType": "landscape",
      "elementType": "geometry.stroke",
      "stylers": [
          {
              "color": "#4d6059"
          }
      ]
  },
  {
      "featureType": "landscape.natural",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "color": "#4d6059"
          }
      ]
  },
  {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
          {
              "lightness": 21
          }
      ]
  },
  {
      "featureType": "poi",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "color": "#4d6059"
          }
      ]
  },
  {
      "featureType": "poi",
      "elementType": "geometry.stroke",
      "stylers": [
          {
              "color": "#4d6059"
          }
      ]
  },
  {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
          {
              "visibility": "on"
          },
          {
              "color": "#7f8d89"
          }
      ]
  },
  {
      "featureType": "road",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "color": "#7f8d89"
          }
      ]
  },
  {
      "featureType": "road.highway",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "color": "#7f8d89"
          },
          {
              "lightness": 17
          }
      ]
  },
  {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
          {
              "color": "#7f8d89"
          },
          {
              "lightness": 29
          },
          {
              "weight": 0.2
          }
      ]
  },
  {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
          {
              "color": "#000000"
          },
          {
              "lightness": 18
          }
      ]
  },
  {
      "featureType": "road.arterial",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "color": "#7f8d89"
          }
      ]
  },
  {
      "featureType": "road.arterial",
      "elementType": "geometry.stroke",
      "stylers": [
          {
              "color": "#7f8d89"
          }
      ]
  },
  {
      "featureType": "road.local",
      "elementType": "geometry",
      "stylers": [
          {
              "color": "#000000"
          },
          {
              "lightness": 16
          }
      ]
  },
  {
      "featureType": "road.local",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "color": "#7f8d89"
          }
      ]
  },
  {
      "featureType": "road.local",
      "elementType": "geometry.stroke",
      "stylers": [
          {
              "color": "#7f8d89"
          }
      ]
  },
  {
      "featureType": "transit",
      "elementType": "geometry",
      "stylers": [
          {
              "color": "#000000"
          },
          {
              "lightness": 19
          }
      ]
  },
  {
      "featureType": "water",
      "elementType": "all",
      "stylers": [
          {
              "color": "#2b3638"
          },
          {
              "visibility": "on"
          }
      ]
  },
  {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
          {
              "color": "#2b3638"
          },
          {
              "lightness": 17
          }
      ]
  },
  {
      "featureType": "water",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "color": "#24282b"
          }
      ]
  },
  {
      "featureType": "water",
      "elementType": "geometry.stroke",
      "stylers": [
          {
              "color": "#24282b"
          }
      ]
  },
  {
      "featureType": "water",
      "elementType": "labels",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "water",
      "elementType": "labels.text",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "water",
      "elementType": "labels.text.stroke",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "water",
      "elementType": "labels.icon",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  }
]

export default { centerOnUserLocation, fetchLocations, customDarkThemeMapStyle }