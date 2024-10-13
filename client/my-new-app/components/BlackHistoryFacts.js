import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Linking, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';

export default function BlackHistoryFacts() {
  const [fact, setFact] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchFacts = async () => {
    try {
      const response = await axios.get('https://rest.blackhistoryapi.io/fact/random', {
        headers: {
          'Accept': 'application/json',
          'x-api-key': 'aWduYXRpdXNib2F0ZW5nMTIzU2F0IE' // Replace with your actual API key
        }
      });

      console.log('API Response:', response.data); // Log the response

      if (response.data.TotalResults > 0) {
        setFact(response.data.Results[0]); // Set the first result in the state
      } else {
        console.error('No results found');
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data: ', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacts(); // Fetch data when the component mounts
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!fact) {
    return (
      <View style={styles.container}>
        <Text>No data available.</Text>
      </View>
    );
  }

  const handlePressSource = () => {
    if (fact.source) {
      Linking.openURL(fact.source);  // Opens the source URL in browser
    } else {
      console.error('No source link available.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.factContainer}>
        <Text style={styles.mainText}>{fact.text}</Text>
        <View style={styles.infoContainer}>
          <TouchableOpacity style={styles.sourceContainer} onPress={handlePressSource}>
            <Text style={styles.sourceText}>Source</Text>
          </TouchableOpacity>
          {fact.tags.length > 0 && (
            <View style={styles.tagContainer}>
              <Text style={styles.factText}>Tags: {fact.tags.join(', ')}</Text>
            </View>
          )}
        </View>
        <Image 

          source={require('../assets/pngtree-did-you-know-black-and-white-text-png-image_232724.png')} // Adjust path as needed
          style={styles.image}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    maxHeight: 200,
  },
  factContainer: {
    marginTop: 20,
    marginVertical: 5,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    width: '100%',
  },
  mainText: {
    maxHeight: 100,
    overflow: 'hidden',
    fontSize: 16,
    padding: 10,
    borderRadius: 5,
  },
  factText: {
    borderRadius: 10,
    width: '100%',
    color: 'white',
  },
  tagContainer: {
    padding: 10,
    width: 'auto',  // Use auto to adjust width based on content
    marginBottom: 5,
    borderRadius: 10,
    maxLength: 66,
    backgroundColor: '#f03759',
  },
  sourceText: {
    fontSize: 14,
    borderRadius: 5,
    color: 'white',
    textDecorationLine: 'underline', // Make it look like a clickable link
  },
  sourceContainer: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#12853F',
  },
  infoContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 11,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  image: {
    position: 'absolute',
    bottom: -100,
    right: -30,
    width: 140, // Set your desired width
    height: 140, // Set your desired height
    marginTop: 10, // Space between text and image
    alignSelf: 'center', // Center the image horizontally
  },
});