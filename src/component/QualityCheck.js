import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors } from '../utils/Color';

const QualityCheckModal = ({ visible, onClose, onQualityCheck }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.qualityCheckBox}>
          <Text style={styles.qualityCheckTitle}>PRODUCT QUALITY CHECK</Text>
          <Text style={styles.qualityCheckSubtitle}>Is the product in good condition?</Text>
          
          <View style={styles.qualityButtons}>
            <TouchableOpacity 
              style={[styles.qualityButton, styles.goodButton]}
              onPress={() => onQualityCheck('good')}
            >
              <Icon name="check" size={wp('6%')} color={Colors.white} />
              <Text style={styles.qualityButtonText}>GOOD</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.qualityButton, styles.badButton]}
              onPress={() => onQualityCheck('bad')}
            >
              <Icon name="close" size={wp('6%')} color={Colors.white} />
              <Text style={styles.qualityButtonText}>DEFECTIVE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  qualityCheckBox: {
    backgroundColor: Colors.darkGray,
    padding: hp('3%'),
    borderRadius: wp('3%'),
    width: wp('85%'),
    alignItems: 'center',
  },
  qualityCheckTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: hp('1%'),
  },
  qualityCheckSubtitle: {
    fontSize: wp('4%'),
    color: Colors.white,
    marginBottom: hp('3%'),
    textAlign: 'center',
  },
  qualityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: hp('1%'),
  },
  qualityButton: {
    flex: 1,
    padding: hp('2%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp('1.5%'),
    flexDirection: 'row',
  },
  goodButton: {
    backgroundColor: Colors.success,
  },
  badButton: {
    backgroundColor: Colors.error,
  },
  qualityButtonText: {
    color: Colors.white,
    fontSize: wp('4%'),
    marginLeft: wp('2%'),
    fontWeight: 'bold',
  },
});

export default QualityCheckModal;