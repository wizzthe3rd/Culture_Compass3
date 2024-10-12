import { Dimensions, StyleSheet, View, Platform, Text } from 'react-native';
import React, { useState } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Map() {
  const initialLocation = {
    latitude: 51.5072,
    longitude: -0.1276, // Correct longitude for London
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const [myRegion, setMyRegion] = useState(initialLocation);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={myRegion}
        onRegionChangeComplete={(region) => setMyRegion(region)}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        zoomEnabled={true}
        scrollEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}
        showUserLocation={true}
        showCompass={true}
      >
          <Marker 
            coordinate={{ latitude: 51.5072, longitude: -0.1276 }} // Correct coordinatesszsz
            title={'London'}
            description={'This is London'}
          />
        {/* {console.log('Marker coordinates:', { latitude: 51.5072, longitude: -0.1276 })} */}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    height: windowHeight,
    width: windowWidth,
  },
  map: {
    flex: 1,
    height: windowHeight,
    width: windowWidth,
  },
});