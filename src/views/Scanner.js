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
import { Services } from '../services/UrlConstant';
import { postScanLocation, postScanProduct, postValidateProduct } from '../services/Network';

const ScannerScreen = ({ route, navigation }) => {
  const { reference, onScanned, scanType, onScanComplete, validateState, counter, onCounterIncrement, validateJSON } = route.params || {};
  const [stockQty, setStockQty] = useState(validateState || 0)
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
  const [locScanStatus, setLocScanStatus] = useState(false);
  const [scanBarcode, setScanBarcode] = useState(true);
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


  const scanStock = (scannedCode) => {
    console.log('Starting scan validation...');
    setScannedValue(scannedCode);
    setScannerVisible(false);

    try {
      const sourceDocument = route.params.origin || '';
      const payload = {
        origin: sourceDocument,
        flag: validateJSON.data.flag, // Fixed as per your requirement
        barcode: scannedCode
      };

      postScanProduct(Services.scanProduct, payload).then((response) => {
        if (response) {
          if (response?.result) {
            if (response?.result?.message) {
              if (validateJSON?.data?.flag === 'Delivery') {
                console.log("here ----", response?.result?.new_quantity)
                setStockQty(response?.result?.new_quantity)
                setLocScanStatus(true);
              }
              Alert.alert(
                'Scan Result',
                response?.result?.message
              );

            }
            if (response?.result?.error) {
              Alert.alert(
                'Scan Result',
                response?.result?.error
              );

            }
          }
        }
        if (validateJSON.data.flag != 'Delivery') //navigation will go back for Receipt, Putaway & Picking
          navigation.goBack();
      });
      // const response = await axios.post(
      //   'http://192.168.0.120:8092/generic_wms/scan_productv2',
      //   payload,
      //   {
      //     headers: { 'Content-Type': 'application/json' }
      //   }
      // );

      // console.log("response      ", response)


      // if (onScanComplete) onScanComplete(response);

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

      // const incrementedCounter = counter + 1;
      // if (onCounterIncrement) {
      //   onCounterIncrement(incrementedCounter); // Pass the new counter back
      // }

    } catch (error) {
      console.log(error);
      if (failSound.current) {
        failSound.current.play();
      }
      setFailMessage(error.response?.data?.message || 'Scan failed. Please retry.');
      setFailAlertVisible(true);
      setTimeout(() => setScannerVisible(true), 2000);
    }
  }

  const scanPut = async (scannedCode, module, scanType) => {
    if (module === 'Receipt' || module === 'Putaway' || module === 'Picking')
      locationScan(null, scannedCode)
  }

  const scanPick = async (scannedCode, module, scanType) => {
    let scanStatus = false;

    if (module === 'Putaway' || module === 'Picking' || module === 'Delivery') {
      scanStatus = await locationScan(scannedCode, null);
    }

    if (scanStatus === true) {
      navigation.goBack();
    }
  };


  const validateScannedOrderNo = async (scannedCode) => {
    if (scanType === 'Stock') {
      scanStock(scannedCode);
    } else if (scanType === 'Put') {
      scanPut(scannedCode, validateJSON.data.flag, scanType);
    } else if (scanType === 'Pick') {
      setScanBarcode(false);
      scanPick(scannedCode, validateJSON.data.flag, scanType)
    }
  };

  const validate = async () => {
    loadData();
    postValidateProduct(Services.validateProduct,
      validateJSON ? validateJSON.data : validateData.data).then((response) => {
        console.log(response)
        if (response) {
          if (response?.result) {
            if (response?.result?.message) {
              Alert.alert(
                'Scan Result',
                response?.result?.message
              );

            }
            if (response?.result?.error) {
              Alert.alert(
                'Scan Result',
                response?.result?.error
              );

            }
          }
        }
        navigation.goBack();
      })
  }

  const handleCancelScan = () => {
    setScannerVisible(false);
    setShowManualForm(true);
  };

  const handleManualFormSubmit = (formData) => {
    console.log('Form submitted:', formData);
    navigation.goBack();
  };

  const locationScan = async (originCode = null, destCode = null) => {
    const payload = {
      origin: validateJSON?.data?.origin || '',
      flag: validateJSON?.data?.flag || '',
      locations: {
        ...(originCode && { source: originCode }),
        ...(destCode && { destination: destCode })
      }
    };

    try {
      const response = await postScanLocation(Services.scanLocation, payload);

      if (response?.result?.error) {
        Alert.alert('Scan Result', 'Location barcode not found');
        return false;
      } else {
        setLocScanStatus(true);
        return true;
      }
    } catch (error) {
      Alert.alert('Error', 'Scan failed: ' + error);
      return false;
    }
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
            scanBarcode={scanBarcode}
            onReadCode={(event) => scanBarcode && validateScannedOrderNo(event.nativeEvent.codeStringValue)}
            showFrame={true}
            laserColor={Colors.theme}
            frameColor={Colors.accent}
          />
          <View style={styles.buttonContainer}>
            {/* <TouchableOpacity style={styles.cancelButton} onPress={handleCancelScan}>
              <Icon name="add" size={24} color="white" />
              <Text style={styles.cancelButtonText}>Create</Text>
            </TouchableOpacity> */}
            {(scanType === 'Put' || (scanType === 'Stock' && validateJSON?.data?.flag === 'Delivery')) &&
              (<TouchableOpacity
                style={[
                  styles.modalValidateButton,
                  !(stockQty > 0 && locScanStatus) && styles.modalValidateButtonDisabled
                ]}
                onPress={() => {
                  if (!(stockQty > 0 && locScanStatus)) {
                    if (stockQty <= 0) {
                      Alert.alert('Validation Error', 'Stock quantity must be greater than zero.');
                    } else if (!locScanStatus) {
                      Alert.alert('Validation Error', 'Please scan the location before proceeding.');
                    } else {
                      Alert.alert('Validation Error', 'Validation conditions are not met.');
                    }
                    return;
                  }
                  validate(); // Call actual validation function
                }}
              // disabled={!(stockQty > 0 && locScanStatus)}
              >
                <Text style={styles.modalCloseText}>Validate</Text>
              </TouchableOpacity>

              )}
          </View>
        </View>
      ) : (
        <View style={styles.scannerView}>
          <View style={styles.scannerViewResult}>
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
          <View style={styles.buttonContainer}>
            {/* <TouchableOpacity style={styles.cancelButton} onPress={handleCancelScan}>
              <Icon name="add" size={24} color="white" />
              <Text style={styles.cancelButtonText}>Create</Text>
            </TouchableOpacity> */}
            {scanType === 'Put' ||
              (scanType === 'Stock' && validateJSON?.data?.flag === 'Delivery') &&
              (
                <TouchableOpacity
                  style={[
                    styles.modalValidateButton,
                    !(stockQty > 0 && locScanStatus) && styles.modalValidateButtonDisabled
                  ]}
                  onPress={() => {
                    if (!(stockQty > 0 && locScanStatus)) {
                      if (stockQty <= 0) {
                        Alert.alert('Validation Error', 'Stock quantity must be greater than zero.');
                      } else if (!locScanStatus) {
                        Alert.alert('Validation Error', 'Please scan the location before proceeding.');
                      } else {
                        Alert.alert('Validation Error', 'Validation conditions are not met.');
                      }
                      return;
                    }
                    validate(); // Call actual validation function
                  }}
                // disabled={!(stockQty > 0 && locScanStatus)}
                >
                  <Text style={styles.modalCloseText}>Validate</Text>
                </TouchableOpacity>

              )}
          </View>
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
  scannerViewResult: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
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
    marginTop: -70,
    paddingHorizontal: 20, // Add horizontal padding
  },
  modalValidateButton: {
    backgroundColor: Colors.theme,
    padding: 15,
    borderRadius: 5, // Optional: Add border radius for rounded corners
  },
  modalValidateButtonDisabled: {
    backgroundColor: '#A9A9A9'
  }
});

export default ScannerScreen;

