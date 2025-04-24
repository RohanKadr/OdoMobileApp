import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../utils/Color';
import Strings from '../utils/Strings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkExistingSession, login, postDataUsingServices } from '../services/Network';
import { Services } from '../services/UrlConstant';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const existingsession = await checkExistingSession();
        if (existingsession) {
          navigation.navigate('Home');
        }
      } catch (error) {
        console.error('Session Check error:', error);
      }
    };
    checkSession();
  }, []);

  const handleLogin = async () => {
    if(!username || !password) {
      Alert.alert('Error', 'Please enter both of the fields');
      return;
    }

    setLoading(true);

    try {
      console.log(" Test 1 - Username and password:", username, password);
      const result = await login(username, password);
      if (result?.key) {
        console.log('Logged in with key:', result.key);
        navigation.navigate('Home');
      }else {
        throw new Error('Login failed - no session key received');
      }
    }catch (error) {
      Alert.alert('Login Failed', error.response?.data?.message || 'Invalid credentials');
      await AsyncStorage.removeItem('sessionKey');
    } finally{
      setLoading(false);
    }
  };
  
  
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{Strings.TXT_LOGIN_HEADER}</Text>
      <View style={styles.card}>
        <Icon name="account-circle" size={hp('10%')} color={Colors.white} style={styles.icon} />
        <View style={styles.inputContainer}>
          <Icon name="email-outline" size={hp('3%')} color={Colors.white} />
          <TextInput
            placeholder="Username"
            placeholderTextColor={Colors.white}
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            autoCapitalize='none'
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="lock-outline" size={hp('3%')} color={Colors.white} />
          <TextInput
            placeholder="Password"
            placeholderTextColor={Colors.white}
            secureTextEntry={!passwordVisible}
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <Icon
              name={passwordVisible ? 'eye-off' : 'eye'}
              size={hp('3%')}
              color={Colors.white}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>{Strings.TXT_LOGIN}</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.forgotText}>{Strings.TXT_FORGOT_PASSWORD}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.footerText}>
        By Login you agree to the{' '}
        <Text style={styles.linkText}>Terms & Conditions</Text> and{' '}
        <Text style={styles.linkText}>Privacy Policy</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: 'center',
    paddingTop: hp('10%'),
  },
  headerText: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    color: Colors.theme,
    marginBottom: hp('3%'),
  },
  card: {
    width: wp('85%'),
    backgroundColor: Colors.theme,
    borderRadius: wp('3%'),
    paddingVertical: hp('4%'),
    paddingHorizontal: wp('5%'),
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  icon: {
    marginBottom: hp('3%'),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray,
    borderRadius: wp('2%'),
    marginBottom: hp('2%'),
    paddingHorizontal: wp('3%'),
    width: '100%',
    height: hp('6%'),
  },
  input: {
    flex: 1,
    color: Colors.white,
    fontSize: wp('4%'),
    marginLeft: wp('2%'),
  },
  loginButton: {
    backgroundColor: Colors.deep_cyan,
    borderRadius: wp('2%'),
    width: '100%',
    alignItems: 'center',
    paddingVertical: hp('1.5%'),
    marginTop: hp('2%'),
  },
  loginButtonText: {
    color: Colors.white,
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
  },
  forgotText: {
    color: Colors.white,
    fontSize: wp('4%'),
    marginTop: hp('1.5%'),
    textDecorationLine: 'underline',
  },
  footerText: {
    color: Colors.darkcyan,
    fontSize: wp('3.5%'),
    textAlign: 'center',
    marginTop: hp('3%'),
    marginHorizontal: wp('5%'),
    paddingBottom: hp('2%'),
  },
  linkText: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
});

export default LoginScreen;

