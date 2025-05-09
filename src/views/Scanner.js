import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Camera } from 'react-native-camera-kit';
import Sound from 'react-native-sound';
import axios from 'axios';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors } from '../utils/Color';
import GlowingAlert from '../component/FailAlert';
import SuccessAlert from '../component/SuccessAlert';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ManualEntryForm from './ManualForm';
import QualityCheckModal from '../component/QualityCheck';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ScannerScreen = ({ route, navigation }) => {
  const { reference, onScanned, scanType, onScanComplete, validateState, counter, onCounterIncrement, validateJSON } = route.params || {};
  const [isFailAlertVisible, setFailAlertVisible] = useState(false);
  const [scannerVisible, setScannerVisible] = useState(true);
  const [failMessage, setFailMessage] = useState('');
  const [isSuccessAlertVisible, setSuccessAlertVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [scannedValue, setScannedValue] = useState('');
  const [showQualityCheck, setShowQualityCheck] = useState(false);
  const [productStatus, setProductStatus] = useState(null);
  const [showManualForm, setShowManualForm] = useState(false);
  const [validateData, setValidateData] = useState({});

  console.log("validatestate", validateData)
  async function updateValidateData(update) {

    try {
      // update can be object or function(prev) => newState
      const newData =
        typeof update === 'function' ? update(validateData) : update;
      setValidateData(newData); // update react state
      // Save to AsyncStorage
      await AsyncStorage.setItem('@validateData', JSON.stringify(newData));

    } catch (e) {
      console.error('Failed to update validateData', e);
    }
  }


  async function handleUpdateItemScanned() {

    await updateValidateData(prev => ({
      ...prev,
      itemScanned: 1,
    }));
  }
  async function loadData() {
    try {
      const jsonValue = await AsyncStorage.getItem('@validateData');
      if (jsonValue != null) {
        setValidateData(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error('Failed to load validateData from storage', e);
    }
  }
  useEffect(() => {

    loadData();
  }, [])
  // Sound references
  const successSound = useRef(null);
  const failSound = useRef(null);

  useEffect(() => {
    Sound.setCategory('Playback');
    successSound.current = new Sound(require('../../assets/sounds/Success.mp3'), Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Failed to load success sound', error);
      }
    });
    failSound.current = new Sound(require('../../assets/sounds/Fail.mp3'), Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Failed to load fail sound', error);
      }
    });

    return () => {
      successSound.current?.release();
      failSound.current?.release();
    };
  }, []);

  const validateScannedOrderNo = async (scannedCode) => {
    console.log('Starting scan validation...');
    setScannedValue(scannedCode);
    setScannerVisible(false);

    try {
      const sourceDocument = route.params.origin || '';
      const type = route.params.flag || '';
      const payload = {
        origin: sourceDocument,
        flag: type, // Fixed as per your requirement
        barcode: scannedCode
      };


      console.log('Attempting API call with payload:', payload);
      const response = await axios.post(
        'http://192.168.0.120:8092/generic_wms/scan_productv2',
        payload,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      console.log("response      ", response)

      if (response && response?.data) {
        if (response?.data?.result) {
          if (response?.data?.result?.message) {
            Alert.alert(
              'Scan Result',
              response?.data?.result?.message
            );

          }
          if (response?.data?.result?.error) {
            Alert.alert(
              'Scan Result',
              response?.data?.result?.error
            );

          }
        }
      }
      if (onScanComplete) onScanComplete(response);

      // if (response?.data?.result?.delivery_id) {
      //   if (successSound.current) {
      //     successSound.current.play();
      //   }

      //   // Call the callback to update ReceiptScreen
      //   if (onScanned) {
      //     onScanned(reference, scannedCode, true);
      //   }

      //   navigation.goBack();
      // } else {
      //   throw new Error('Unexpected response from server');
      // }

      const incrementedCounter = counter + 1;
      if (onCounterIncrement) {
        onCounterIncrement(incrementedCounter); // Pass the new counter back
      }

      navigation.goBack();
    } catch (error) {
      console.log(error);
      if (failSound.current) {
        failSound.current.play();
      }
      setFailMessage(error.response?.data?.message || 'Scan failed. Please retry.');
      setFailAlertVisible(true);
      setTimeout(() => setScannerVisible(true), 2000);
    }
  };

  const validate = async () => {
    loadData();
    console.log('validateData', validateJSON)
    let response;
    if(validateJSON){
       response = await axios.post(
        'http://192.168.0.120:8092/generic_wms/validate_product_v2',
        validateJSON.data,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }else{
      const response = await axios.post(
        'http://192.168.0.120:8092/generic_wms/validate_product_v2',
        validateData.data,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    

    if (response && response?.data) {
      if (response?.data?.result) {
        if (response?.data?.result?.message) {
          Alert.alert(
            'Scan Result',
            response?.data?.result?.message
          );

        }
        if (response?.data?.result?.error) {
          Alert.alert(
            'Scan Result',
            response?.data?.result?.error
          );

        }
      }
    }

    navigation.goBack();

  }

  const handleCancelScan = () => {
    setScannerVisible(false);
    setShowManualForm(true);
  };

  const handleManualFormSubmit = (formData) => {
    console.log('Form submitted:', formData);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {showManualForm ? (
        <ManualEntryForm
          onComplete={handleManualFormSubmit}
          onCancel={() => {
            setShowManualForm(false);
            setScannerVisible(true);
          }}
          initialData={{
            receiptNumber: 'VWH/IN/00001',
            receiveFrom: 'Godrej Interio',
            operationType: 'Virar: Receipts',
            destinationLocation: 'VWH/Receiving'
          }}
        />
      ) : scannerVisible ? (
        <View style={styles.scannerView}>
          <Camera
            style={styles.camera}
            cameraType="back"
            scanBarcode={true}
            onReadCode={(event) => validateScannedOrderNo(event.nativeEvent.codeStringValue)}
            showFrame={true}
            laserColor={Colors.theme}
            frameColor={Colors.accent}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelScan}>
              <Icon name="add" size={24} color="white" />
              <Text style={styles.cancelButtonText}>Create</Text>
            </TouchableOpacity>
            {scanType === 'Put' && (
              <TouchableOpacity
                style={styles.modalValidateButton}
                onPress={() => validate()}
                disabled={validateState > 0 ? false : true}
              >
                <Text style={styles.modalCloseText}>Validate</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : (
        <View style={styles.scannedResult}>
          <Icon
            name={productStatus === 'good' ? 'check-circle' : 'error'}
            size={wp('20%')}
            color={productStatus === 'good' ? Colors.success : Colors.error}
          />
          <Text style={styles.scannedText}>
            PRODUCT SCANNED
          </Text>
          <Text style={styles.scannedValue}>{scannedValue}</Text>
          <Text style={[
            styles.statusText,
            { color: productStatus === 'good' ? Colors.success : Colors.error }
          ]}>
            {productStatus === 'good' ? 'VERIFIED' : 'DEFECTIVE'}
          </Text>
        </View>
      )}

      <QualityCheckModal
        visible={showQualityCheck}
        onClose={() => {
          setShowQualityCheck(false);
          setScannerVisible(true);
        }}
        onQualityCheck={(status) => {
          setShowQualityCheck(false);
          setProductStatus(status);
          if (status === 'good') {
            if (successSound.current) successSound.current.play();
            setSuccessMessage('Product quality verified');
            setSuccessAlertVisible(true);
            if (onScanned) onScanned(reference, scannedValue, true);
            setTimeout(() => navigation.goBack(), 1500);
          } else {
            if (failSound.current) failSound.current.play();
            setFailMessage('Product failed quality check');
            setFailAlertVisible(true);
            if (onScanned) onScanned(reference, scannedValue, false);
            setTimeout(() => setScannerVisible(true), 2000);
          }
        }}
        productCode={scannedValue}
      />

      <GlowingAlert
        visible={isFailAlertVisible}
        message={failMessage}
        onClose={() => { setFailAlertVisible(false); handleCancelScan(); }}
        onTryAgain={() => {
          setFailAlertVisible(false);
          setScannerVisible(true);
          setProductStatus(null);
        }}
      />

      <SuccessAlert
        visible={isSuccessAlertVisible}
        message={successMessage}
        onDone={() => {
          setSuccessAlertVisible(false);
          navigation.goBack();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  scannerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  cancelButton: {
    position: 'relative',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5, // Optional: Add border radius for rounded corners
    marginRight: 10,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
  scannedResult: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  scannedText: {
    fontSize: wp('4%'),
    color: Colors.white,
    marginTop: hp('2%'),
    fontWeight: 'bold',
  },
  scannedValue: {
    fontSize: wp('4.5%'),
    color: Colors.theme,
    marginVertical: hp('1%'),
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    marginTop: hp('1%'),
  },
  modalCloseText: {
    color: Colors.white,
    fontSize: wp('4%'),
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row', // Align children in a row
    justifyContent: 'space-between', // Space between buttons
    alignItems: 'center', // Center vertically
    marginTop: -70, // Add some margin if needed
    paddingHorizontal: 20, // Add horizontal padding
  },
  modalValidateButton: {
    backgroundColor: Colors.theme,
    padding: 15,
    borderRadius: 5, // Optional: Add border radius for rounded corners
  },
});

export default ScannerScreen;

