import React from 'react';
import { View, Text, Modal, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../utils/Color';
import Icon from 'react-native-vector-icons/Ionicons';

const ProductScannerModal = ({ visible, onClose, products, onScanned }) => {
    const handleScan = (product) => {
        // Here you would implement the logic to scan the barcode
        // For now, we will just simulate a scan
        const scannedData = product.product_code; // Simulate scanning the product code
        onScanned(product.reference, scannedData, true); // Call the onScanned function
    };

    return (
        <Modal
            transparent={true}
            animationType="slide"
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Scan Products</Text>
                    <FlatList
                        data={products}
                        keyExtractor={(item) => item.product_code}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.productItem} onPress={() => handleScan(item)}>
                                <Text style={styles.productName}>{item.product} ({item.product_code})</Text>
                                <Icon name="barcode-outline" size={24} color={Colors.theme} />
                            </TouchableOpacity>
                        )}
                    />
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: Colors.white,
        borderRadius: 10,
        padding: 20,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    productItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightGray,
    },
    productName: {
        fontSize: 16,
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: Colors.theme,
        borderRadius: 5,
        alignItems: 'center',
    },
    closeButtonText: {
        color: Colors.white,
        fontWeight: 'bold',
    },
});

export default ProductScannerModal;
