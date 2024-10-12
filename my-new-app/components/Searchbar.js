import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (text) => {
    setSearchQuery(text);
    onSearch(text); // Call the onSearch prop to handle the search query
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search..."
        value={searchQuery}
        onChangeText={handleSearch} // Update search query
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 80,
    borderRadius: 10,
    elevation: 1,
    marginVertical: 10,
    borderStyle: 'solid',
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',      // Shadow color
    shadowOffset: { width: 0, height: 2 },  // Offset for shadow
    shadowOpacity: 0.8,       // Shadow opacity (0 to 1)
    shadowRadius: 3,          // Shadow blur radius
    // Android shadow (elevation)
    elevation: 5, 
  },
  input: {
    height: 40,
    width: '80%',
    fontSize: 16,
  },
});

export default SearchBar;