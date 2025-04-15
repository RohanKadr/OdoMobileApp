import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../utils/Color';
import Strings from '../utils/Strings';

const SuccessAlert = ({ visible, message, onDone }) => {
  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <LinearGradient
            colors={[Colors.mint_green, Colors.pastel_green]}
            style={styles.gradient}
          >
            {/* Success Icon */}
            <Icon name="check-circle" size={30} color={Colors.black} style={styles.icon} />

            {/* Message Content */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>{Strings.TXT_SUCCESS}</Text>
              <Text style={styles.message}>{message}</Text>
            </View>
          </LinearGradient>

          {/* Done Button */}
          <TouchableOpacity onPress={onDone} style={styles.doneButton}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  alertBox: {
    width: '90%',
    borderRadius: 20,
    elevation: 10,
    backgroundColor: Colors.white,
    alignItems: 'center',
    overflow: 'hidden',
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    width: '100%',
  },
  icon: {
    marginLeft: 5,
    margin: 5,
    marginBottom: 25,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 5,
  },
  message: {
    fontSize: 14,
    color: Colors.black,
  },
  doneButton: {
    width: '100%',
    backgroundColor: Colors.mint_green,
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: Colors.pastel_green,
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
  },
});

export default SuccessAlert;
