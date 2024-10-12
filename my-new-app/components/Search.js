import React from "react";
import { View, Text, StyleSheet} from "react-native";


export default function Search() {
    return (
        <View style={styles.container}>
        <Text style={styles.text}>Search</Text>
        </View>
    );
    }   

    const styles = StyleSheet.create({
        text: {
            fontSize: 24,
            fontWeight: 'bold',
            textAlign: 'center',
        },
    
        });




