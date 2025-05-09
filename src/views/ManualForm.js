import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../utils/Color';

const ManualEntryForm = ({ onComplete, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    receiptNumber: initialData?.receiptNumber || 'VWH/IN/00001',
    receiveFrom: initialData?.receiveFrom || 'Godrej Interio',
    operationType: initialData?.operationType || 'Virar: Receipts',
    destinationLocation: initialData?.destinationLocation || 'VWH/Receiving',
    scheduledDate: initialData?.scheduledDate || '',
    effectiveDate: initialData?.effectiveDate || '',
    sourceDocument: initialData?.sourceDocument || '',
    storageFacility: initialData?.storageFacility || '',
    availedStorageFacility: initialData?.availedStorageFacility || '',
    assignOwner: initialData?.assignOwner || '',
    products: initialData?.products || [{
      packaging: '',
      demand: '',
      quantity: '',
      storageFacility: '',
      unit: 'Units'
    }]
  });

  const handleInputChange = (field, value, index = null) => {
    if (index !== null) {
      const updatedProducts = [...formData.products];
      updatedProducts[index][field] = value;
      setFormData({ ...formData, products: updatedProducts });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const addProduct = () => {
    setFormData({
      ...formData,
      products: [
        ...formData.products,
        {
          packaging: '',
          demand: '',
          quantity: '',
          storageFacility: '',
          unit: 'Units'
        }
      ]
    });
  };

  const removeProduct = (index) => {
    if (formData.products.length > 1) {
      const updatedProducts = [...formData.products];
      updatedProducts.splice(index, 1);
      setFormData({ ...formData, products: updatedProducts });
    }
  };

  const handleSubmit = () => {
    for (const product of formData.products) {
      if (!product.packaging || !product.demand || !product.quantity || !product.storageFacility) {
        Alert.alert('Error', 'Please fill all product fields');
        return;
      }
    }
    onComplete(formData);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Combined Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Receipt Details</Text>

          <View style={styles.gridContainer}>
            <View style={styles.gridRow}>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Receipt Number</Text>
                <TextInput
                  style={styles.input}
                  value={formData.receiptNumber}
                  editable={false}
                />
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Receive From</Text>
                <TextInput
                  style={styles.input}
                  value={formData.receiveFrom}
                  onChangeText={(text) => handleInputChange('receiveFrom', text)}
                />
              </View>
            </View>

            <View style={styles.gridRow}>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Operation Type</Text>
                <TextInput
                  style={styles.input}
                  value={formData.operationType}
                  onChangeText={(text) => handleInputChange('operationType', text)}
                />
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Destination</Text>
                <TextInput
                  style={styles.input}
                  value={formData.destinationLocation}
                  onChangeText={(text) => handleInputChange('destinationLocation', text)}
                />
              </View>
            </View>

            <View style={styles.gridRow}>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Scheduled Date</Text>
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD HH:MM:SS"
                  value={formData.scheduledDate}
                  onChangeText={(text) => handleInputChange('scheduledDate', text)}
                />
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Effective Date</Text>
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD HH:MM:SS"
                  value={formData.effectiveDate}
                  onChangeText={(text) => handleInputChange('effectiveDate', text)}
                />
              </View>
            </View>

            <View style={styles.gridRow}>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Source Document</Text>
                <TextInput
                  style={styles.input}
                  value={formData.sourceDocument}
                  onChangeText={(text) => handleInputChange('sourceDocument', text)}
                />
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Storage Facility</Text>
                <TextInput
                  style={styles.input}
                  value={formData.storageFacility}
                  onChangeText={(text) => handleInputChange('storageFacility', text)}
                />
              </View>
            </View>

            <View style={styles.gridRow}>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Availed Storage</Text>
                <TextInput
                  style={styles.input}
                  value={formData.availedStorageFacility}
                  onChangeText={(text) => handleInputChange('availedStorageFacility', text)}
                />
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>Assign Owner</Text>
                <TextInput
                  style={styles.input}
                  value={formData.assignOwner}
                  onChangeText={(text) => handleInputChange('assignOwner', text)}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Products Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Products</Text>

          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, { flex: 3 }]}>Product</Text>
            <Text style={[styles.headerText, { flex: 2 }]}>Demand</Text>
            <Text style={[styles.headerText, { flex: 2 }]}>Qty</Text>
            <Text style={[styles.headerText, { flex: 2 }]}>Storage</Text>
            <Text style={[styles.headerText, { flex: 1 }]}>Unit</Text>
            <Text style={[styles.headerText, { flex: 1 }]}></Text>
          </View>

          {formData.products.map((product, index) => (
            <View key={index} style={styles.productRow}>
              <TextInput
                style={[styles.productInput, { flex: 3 }]}
                placeholder="Name/Code"
                value={product.packaging}
                onChangeText={(text) => handleInputChange('packaging', text, index)}
              />

              <TextInput
                style={[styles.productInput, { flex: 2 }]}
                placeholder="0"
                keyboardType="numeric"
                value={product.demand}
                onChangeText={(text) => handleInputChange('demand', text, index)}
              />

              <TextInput
                style={[styles.productInput, { flex: 2 }]}
                placeholder="0"
                keyboardType="numeric"
                value={product.quantity}
                onChangeText={(text) => handleInputChange('quantity', text, index)}
              />

              <TextInput
                style={[styles.productInput, { flex: 2 }]}
                placeholder="Location"
                value={product.storageFacility}
                onChangeText={(text) => handleInputChange('storageFacility', text, index)}
              />

              <TextInput
                style={[styles.productInput, { flex: 1 }]}
                value={product.unit}
                editable={false}
              />

              {formData.products.length > 1 && (
                <TouchableOpacity
                  style={[styles.removeButton, { flex: 1 }]}
                  onPress={() => removeProduct(index)}
                >
                  <Icon name="remove" size={20} color="red" />
                </TouchableOpacity>
              )}
            </View>
          ))}

          <TouchableOpacity style={styles.addButton} onPress={addProduct}>
            <Icon name="add" size={20} color="white" />
            <Text style={styles.addButtonText}>Add Product</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
          <Text style={styles.buttonText}>Scanner</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  gridContainer: {
    marginBottom: 8,
  },
  gridRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  gridItem: {
    flex: 1,
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#fafafa',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 8,
  },
  headerText: {
    fontWeight: '600',
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  productInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 6,
    padding: 8,
    marginRight: 6,
    fontSize: 13,
    backgroundColor: '#fafafa',
    textAlign: 'center',
  },
  removeButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.green,
    padding: 12,
    borderRadius: 6,
    marginTop: 10,
  },
  addButtonText: {
    color: Colors.white,
    marginLeft: 8,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  cancelBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: Colors.theme,
  },
  submitBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginLeft: 8,
    backgroundColor: Colors.green,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: '500',
    fontSize: 15,
  },
});

export default ManualEntryForm;