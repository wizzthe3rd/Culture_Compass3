import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

export default function BlackHistoryFacts() {
  const [fact, setFact] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchFacts = async () => {
    try {
      const response = await axios.get('https://rest.blackhistoryapi.io/fact/random', {
        headers: {
          'Accept': 'application/json',
          'x-api-key': YOURKEY // Replace with your actual API key
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

  return (
    <View style={styles.container}>
      <View style={styles.factContainer}>
        <Text style={styles.factText}>Fact: {fact.text}</Text>
        
        <Text style={styles.sourceText}>Source: {fact.source}</Text>
        {fact.people.length > 0 && (
          <Text style={styles.factText}>People: {fact.people.join(', ')}</Text>
        )}
        {fact.tags.length > 0 && (
          <Text style={styles.factText}>Tags: {fact.tags.join(', ')}</Text>
        )}
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
    maxHeight: 300,
    backgroundColor: '#f5f5f5',
  },
  factContainer: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    width: '100%',
  },
  factText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  sourceText: {
    padding:5,
    backgroundColor: '#12853F',
    fontSize: 14,
    borderRadius: 5,
    color: 'white',
    marginBottom: 5,
  },
});
