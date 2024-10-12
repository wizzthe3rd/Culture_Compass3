import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const FactsButton = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text>Click the button to see some facts!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 100,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;