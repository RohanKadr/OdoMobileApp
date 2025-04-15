import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../utils/Color';
import Strings from '../utils/Strings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout } from '../services/Network';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');

  useEffect(() => {
    const getUserData = async () => {
      try{
        const stockdData = await AsyncStorage.getItem('LoginData');
        if(stockdData) {
          const parsedData = JSON.parse(stockdData);
          setEmail(parsedData.email);
        }
      }catch (error) {
        console.error('Error retrieving data:', error);
      }
    };

    getUserData();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure want to log out',
      [{
        text: 'Cancel',
        style: 'cancel',
      },
    {
      text: 'OK',
      onPress: () => removeLoggedData(),
      style: 'destructive',
    },
  ],
  {cancelable: true}
    );
  };

  const removeLoggedData = () => {
    const loggedout = logout();
    if (!loggedout === false){
    navigation.replace('AuthNavigator')
    }else{
      Alert.alert("Can't log out");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{Strings.TXT_WELCOME}</Text>
      <View style={styles.card}>
        <Icon name="account-circle" size={80} color={Colors.theme} />
        <Text style={styles.profileText}>John Doe</Text>
        <Text style={styles.emailText}>{email || 'Loading email... '}</Text>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>{Strings.TXT_LOGOUT}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: hp('3%'),
    paddingLeft: wp('5%'),
    backgroundColor: Colors.jadegreen,
  },
  text: {
    fontSize: 25,
    fontWeight: 'bold',
    color: Colors.theme,
    marginBottom: hp('2%'),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: wp('5%'),
    paddingLeft: wp('5%'),
    marginVertical: hp('2%'),
    width: wp('90%'),
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  profileText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.theme,
    marginTop: hp('1%'),
  },
  emailText: {
    fontSize: 16,
    color: Colors.gray,
    marginTop: hp('0.5%'),
  },
  logoutButton: {
    marginTop: hp('5%'),
    marginRight: wp('3%'),
    backgroundColor: Colors.theme,
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('10%'),
    borderRadius: 25,
    alignSelf: 'center',
  },
  logoutText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
