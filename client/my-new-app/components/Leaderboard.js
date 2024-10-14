import React, { useState } from 'react';
import { View, Text, Button, FlatList, Modal, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

const Leaderboard = ({ isVisible, onClose, userData, schoolData }) => {
    const [view, setView] = useState('users'); // 'users' or 'schools'
    const [userData, setUserData] = useState(userData);

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{view === 'users' ? item.name : item.school}</Text>
            <Text style={styles.itemText}>{item.earnings} Culture Coins</Text>
        </View>
    );

    const data = view === 'users' ? userData : schoolData;

    return (
        <Modal isVisible={isVisible}>
            <View style={styles.modalContainer}>
                <Text style={styles.header}>Leaderboard</Text>
                <View style={styles.switchContainer}>
                    <Button title="View by Users" onPress={() => setView('users')} />
                    <Button title="View by Schools" onPress={() => setView('schools')} />
                </View>
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item) => (view === 'users' ? item.id.toString() : item.schoolId.toString())}
                />
                <Button title="Close" onPress={onClose} />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    itemText: {
        fontSize: 18,
    },
});

export default LeaderboardModal;
