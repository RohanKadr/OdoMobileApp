import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Assets } from "../../assets/images/Assets";

const Launcher = ({navigation}) => {
    useEffect(() => {
        setTimeout(() => {
            getLoggedData();
        }, 1500)
    }, []);

    const getLoggedData = async () => {
        try {
            const value = await AsyncStorage.getItem('LoginData')
            if (value !== null) {
                navigation.replace('TabNavigator')
            } else {
                navigation.replace('AuthNavigator')
            }
        } catch (e) {
            console.error(e);
            navigation.replace('AuthNavigator')
        }
    }

    return (
        <View style={styles.container}>
        <Image 
            source={Assets.img_launcher_logo}
            style={styles.logo}
            resizeMode="contain"
        />
        
        <Text style={styles.appName}>ODO Scanner</Text>
        
        <ActivityIndicator 
            size="large" 
            color="#FFFFFF" 
            style={styles.loader}
        />
        
        <Text style={styles.versionText}>v1.0.0</Text>
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2E86C1', // Professional blue tone
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 20,
    },
    appName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 40,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 2,
    },
    loader: {
        marginBottom: 30,
    },
    versionText: {
        position: 'absolute',
        bottom: 30,
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 12,
    },
});

export default Launcher;