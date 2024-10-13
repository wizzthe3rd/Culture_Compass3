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

export default { centerOnUserLocation, fetchLocations }