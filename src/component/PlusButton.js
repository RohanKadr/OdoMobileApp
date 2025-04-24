import React, { useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Colors } from '../utils/Color';

const PlusButton = ({ navigation }) => {
    const [visible, setVisible] = useState(false);

    const toggleOptions = () => {
        setVisible(!visible);
    };

    const handleOptionPress = (option) => {
        setVisible(false);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={toggleOptions} style={styles.plusButton} activeOpacity={0.7}>
                <Text style={styles.plusText}>+</Text>
            </TouchableOpacity>
            
            {visible && (
                <View style={styles.optionsContainer}>
                    <TouchableOpacity style={styles.option} onPress={() => handleOptionPress('Dummy Input')}>
                        <Text style={styles.optionText}>Dummy Input</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.option} onPress={() => handleOptionPress('New Input')}>
                        <Text style={styles.optionText}>New Input</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        position: 'relative',
    },
    plusButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.lightBlue,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: -20,
    },
    plusText: {
        color: Colors.black,
        fontSize: 30,
    },
    optionsContainer: {
        position: 'absolute',
        bottom: 70,
        backgroundColor: 'white',
        borderRadius: 5,
        elevation: 3,
        padding: 10,
        zIndex: 1000,
    },
    option: {
        padding: 10,
    },
    optionText: {
        color: Colors.theme,
    },
});

export default PlusButton;