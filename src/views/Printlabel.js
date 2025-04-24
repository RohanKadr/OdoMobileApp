import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

const PackageDeliveryApp = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Top User Info */}
      <View style={styles.userInfo}>
        <Text style={styles.userName}>Paul Smithers</Text>
        <Text style={styles.userTag}>B2B Customer</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.heading}>Track your package</Text>
        <Text style={styles.subheading}>Enter your package tracking number</Text>
        
        {/* Tracking Input */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Enter tracking number"
            placeholderTextColor="#A0A0A0"
          />
        </View>

        {/* Action Buttons (2x2 Grid) */}
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#F5F5F5' }]}>
            <Text style={styles.actionText}>Send package</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#F5F5F5' }]}>
            <Text style={styles.actionText}>My packages</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#F5F5F5' }]}>
            <Text style={styles.actionText}>Live tracking</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#F5F5F5' }]}>
            <Text style={styles.actionText}>Billing</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={[styles.navText, { color: '#000', fontWeight: '600' }]}>Tracking</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navText}>Packages</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navText}>Billing</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  userInfo: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  userTag: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  content: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  subheading: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 32,
  },
  input: {
    height: 48,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    width: '48%',
    height: 100,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#666',
  },
});

export default PackageDeliveryApp;