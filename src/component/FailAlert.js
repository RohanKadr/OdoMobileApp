import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../utils/Color';
import Strings from '../utils/Strings';

const GlowingAlert = ({ visible, message, onClose, onTryAgain }) => {
  const glowAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnimation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
          }),
        ])
      ).start();
    }
  }, [visible]);

  if (!visible) return null;

  const glowColor = glowAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255, 0, 0, 0.3)', 'rgba(255, 0, 0, 0.8)'],
  });

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.alertBox,
            {
              shadowColor: glowColor,
              shadowOpacity: 1,
              shadowRadius: 10,
              transform: [
                {
                  scale: glowAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.02],
                  }),
                },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={[Colors.reddish_pink, Colors.pastel_pink]}
            style={{ borderRadius: 8 }}
          >
            <View style={styles.gradient}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="error" size={30} color="white" style={styles.icon} />

                <View style={styles.textContainer}>
                  <Text style={styles.title}>{Strings.TXT_ERROR}</Text>
                  <Text style={styles.message}>{message}</Text>
                </View>
              </View>
            </View>


            {/* Try Again Button */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 16 }}>
              <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                <Text style={styles.tryAgainText}>{Strings.TXT_CANCEL}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onTryAgain} style={styles.tryAgainButton}>
                <Text style={styles.tryAgainText}>{Strings.TXT_TRY_AGAIN}</Text>
              </TouchableOpacity>
            </View>

          </LinearGradient>
        </Animated.View>
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
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 15,
    borderRadius: 20,
  },
  icon: {
    marginLeft: 20,
    marginBottom: 25,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  message: {
    fontSize: 14,
    color: 'white',
  },
  closeButton: {
    backgroundColor: 'transparent',
    padding: 5,
    borderRadius: 10,
  },
  tryAgainButton: {
    marginTop: 10,
    backgroundColor: Colors.reddish_pink,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    marginTop: 10,
    backgroundColor: Colors.salmon_pink,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    borderColor: Colors.reddish_pink,
    borderWidth: 2,
  },
  tryAgainText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GlowingAlert;
