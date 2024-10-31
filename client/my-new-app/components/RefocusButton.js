import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function RefocusButton({ onPress }) {
    const [focused, setFocused] = useState(false); 

    const toggleFocus = () => {
        setFocused(true);

        if (onPress) {
            onPress(); 
        }

        setTimeout(() => {
            setFocused(false);
        }, 800); 
    };

    return (
        <TouchableOpacity onPress={toggleFocus}>
            <View style={styles.container}>
                <FontAwesome name="location-arrow" size={29} color={focused ? '#bb7757' : '#bb7757'} />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        zIndex: 100,
        position: 'absolute',
        backgroundColor: '#f7f7f7',
        borderRadius: 100,
        marginLeft: 25,
        padding: 20,
        bottom: 120,
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 0 }, 
        shadowOpacity: 0.7,
        shadowRadius: 4,
        elevation: 2,
    },
});