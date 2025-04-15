import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Camera } from 'react-native-camera-kit';
import Sound from 'react-native-sound';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors } from '../utils/Color';
import GlowingAlert from '../component/FailAlert';
import SuccessAlert from '../component/SuccessAlert';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ManualEntryForm from './ManualForm';
import QualityCheckModal from '../component/QualityCheck';

const ScannerScreen = ({ route, navigation }) => {
  const { reference, scanType, onScanned, expectedBarcode } = route.params || {};
  const [isFailAlertVisible, setFailAlertVisible] = useState(false);
  const [scannerVisible, setScannerVisible] = useState(true);
  const [failMessage, setFailMessage] = useState('');
  const [isSuccessAlertVisible, setSuccessAlertVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [scannedValue, setScannedValue] = useState('');
  const [showQualityCheck, setShowQualityCheck] = useState(false);
  const [productStatus, setProductStatus] = useState(null);
  const [showManualForm, setShowManualForm] = useState(false);

  // Sound references
  let successSound, failSound;

  useEffect(() => {
    Sound.setCategory('Playback');
    successSound = new Sound(require('../../assets/sounds/Success.mp3'), Sound.MAIN_BUNDLE);
    failSound = new Sound(require('../../assets/sounds/Fail.mp3'), Sound.MAIN_BUNDLE);

    return () => {
      successSound?.release();
      failSound?.release();
    };
  }, []);

  const scanTypeLabels = {
    pick: 'PICK SCAN',
    stock: 'STOCK SCAN',
    put: 'PUT SCAN'
  };

  const validateScannedOrderNo = (scannedCode) => {
    setScannedValue(scannedCode);

    if ((scanType === 'pick' || scanType === 'put') && scannedCode !== expectedBarcode) {
      failSound?.play();
      setFailMessage(`Invalid scan! Expected: ${expectedBarcode}`);
      setFailAlertVisible(true);
      setTimeout(() => setScannerVisible(true), 2000);
      return;
    }

    setScannerVisible(false);

    if (scanType === 'pick' || scanType === 'put') {
      handleQualityCheck('good', scannedCode);
    } else {
      setShowQualityCheck(true);
    }
  };

  const handleQualityCheck = (status, scannedCode) => {
    setProductStatus(status);
    setShowQualityCheck(false);

    const actionMessages = {
      pick: 'Document verified successfully',
      stock: status === 'good' ? 'Product stocked successfully' : 'Product stocked (defective)',
      put: status === 'good' ? 'Product put successfully' : 'Product put (defective)'
    };

    const message = actionMessages[scanType];
    
    if (status === 'good') {
      successSound?.play();
      setSuccessMessage(message);
      setSuccessAlertVisible(true);
    } else {
      failSound?.play();
      setFailMessage(`${message} - ${scanType === 'put' ? 'Moved to garbage bin' : 'Needs attention'}`);
      setFailAlertVisible(true);
    }

    if (onScanned) {
      onScanned(reference, scannedCode, status === 'good', scanType);
    }

    if (status === 'good' && scanType === 'pick') {
      setTimeout(() => navigation.goBack(), 1500);
    } else {
      setTimeout(() => {
        setScannerVisible(true);
        setScannedValue('');
        setProductStatus(null);
      }, 1500);
    }
  };

  const handleCancelScan = () => {
    Alert.alert(
      'Scan Cancelled',
      'Would you like to enter the details manually?',
      [
        {
          text: 'No',
          onPress: () => navigation.goBack(),
          style: 'cancel'
        },
        {
          text: 'Yes',
          onPress: () => {
            setScannerVisible(false);
            setShowManualForm(true);
          }
        }
      ]
    );
  };

  const handleManualFormSubmit = (formData) => {
    console.log('Form submitted:', formData);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Scan Type Header */}
      <View style={styles.scanTypeHeader}>
        <Text style={styles.scanTypeText}>{scanTypeLabels[scanType]}</Text>
        {scanType === 'pick' || scanType === 'put' ? (
          <Text style={styles.scanInstruction}>Scan source document: {expectedBarcode}</Text>
        ) : (
          <Text style={styles.scanInstruction}>Scan product barcode</Text>
        )}
      </View>

      {/* Main Content */}
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
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancelScan}>
            <Icon name="close" size={24} color="white" />
            <Text style={styles.cancelButtonText}>Cancel Scan</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.scannedResult}>
          <Icon
            name={productStatus === 'good' ? 'check-circle' : 'error'}
            size={wp('20%')}
            color={productStatus === 'good' ? Colors.success : Colors.error}
          />
          <Text style={styles.scannedText}>
            {scanType === 'pick' ? 'DOCUMENT' : 'PRODUCT'} SCANNED
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

      {/* Modals and Alerts */}
      <QualityCheckModal
        visible={showQualityCheck && scanType === 'stock'}
        onClose={() => setShowQualityCheck(false)}
        onQualityCheck={(status) => handleQualityCheck(status, scannedValue)}
      />
      
      <GlowingAlert
        visible={isFailAlertVisible}
        message={failMessage}
        onClose={() => {setFailAlertVisible(false),
                        handleCancelScan();
                       }}
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
          if (scanType !== 'pick') navigation.goBack();
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
  scanTypeHeader: {
    padding: hp('2%'),
    backgroundColor: Colors.darkGray,
    width: '100%',
  },
  scanTypeText: {
    color: Colors.white,
    fontSize: wp('5%'),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scanInstruction: {
    color: Colors.white,
    fontSize: wp('3.5%'),
    textAlign: 'center',
    marginTop: hp('0.5%'),
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
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default ScannerScreen;