import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors } from '../utils/Color';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { getDataUsingService } from '../services/Network';
import { Services } from '../services/UrlConstant';

const ReceiptsScreen = ({ route }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedReferences, setExpandedReferences] = useState({});
    const [scanProgress, setScanProgress] = useState({});
    const navigation = useNavigation();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // const response = await axios({
            //     method: 'get',
            //     url: 'http://192.168.0.120:8092/generic_wms/receipt_orders',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            // });
            const response = await getDataUsingService(Services.receiptOrders);
            console.log("API Response:", response);

            const result = response;
            console.log("result:", result);
            const transformedData = transformData(result.result);
            setData(transformedData);

            // Initialize scan progress
            const progress = {};
            result.result.forEach(order => {
                progress[order.name] = {
                    pick: 0, // 0 or 1 (since we only scan source_document once)
                    stock: 0, // count of scanned products
                    put: 0, // 0 or 1 (since we only scan source_document once)
                    total: order.products.reduce((sum, product) => sum + product.quantity, 0),
                    products: order.products.map(product => ({
                        product_id: product.product_id,
                        product_code: product.product_code,
                        quantity: product.quantity,
                        stock: 0 // count of scanned items for this product
                    })),
                    source_document: order.source_document
                };
            });
            setScanProgress(progress);
        } catch (error) {
            console.error('API Error:', error);
            Alert.alert('Error', 'Failed to fetch data. Check network or try later.');
        } finally {
            setLoading(false);
        }
    };

    const transformData = (apiData) => {
        const transformedData = [];
        apiData.forEach(order => {
            order.products.forEach(product => {
                transformedData.push({
                    id: `${order.id}-${product.product_id}`,
                    vendor: order.receive_from,
                    product: product.product,
                    quantity: product.quantity,
                    reference: order.name,
                    scheduledDate: order.scheduled_date,
                    Destination: order.destination_location,
                    demandquantity: product.demand_quantity,
                    effectiveDate: order.effective_date,
                    product_code: product.product_code,
                    state: order.state,
                    source_document: order.source_document,
                });
            });
        });
        return transformedData;
    };

    const handleScanComplete = (reference, scannedData, isGood, scanType) => {
        if (!isGood) {
            Alert.alert('Scan Failed', 'Quality check failed for this scan');
            return;
        }

        setScanProgress(prev => {
            const newProgress = { ...prev };
            const referenceData = newProgress[reference];

            if (!referenceData) return prev;

            console.log('Scan Completed:', {
                reference,
                scannedData,
                scanType,
                source_document: referenceData.source_document
            });

            if (scanType === 'pick' || scanType === 'put') {
                // For pick and put, we only scan the source_document once
                console.log('Receipts.js scannedData:', scannedData);
                console.log('Receipts.js source_document:', referenceData.source_document);
                if (scannedData && scannedData === referenceData.source_document) {
                    newProgress[reference][scanType] = 1;
                } else {
                    Alert.alert('Error', 'Scanned document does not match the source document');
                }
            } else if (scanType === 'stock') {
                // For stock, we scan individual products
                const productIndex = referenceData.products.findIndex(
                    p => p.product_code === scannedData
                );

                if (productIndex >= 0) {
                    const product = referenceData.products[productIndex];
                    if (product.stock < product.quantity) {
                        product.stock += 1;
                        referenceData.stock += 1;
                    } else {
                        Alert.alert('Info', 'All items for this product have already been scanned');
                    }
                } else {
                    Alert.alert('Error', 'Scanned product not found in this order');
                }
            }

            return newProgress;
        });
    };

    const getScanButtonIcon = (reference, scanType) => {
        const progress = scanProgress[reference];
        if (!progress) return 'lightbulb';

        if (scanType === 'pick' || scanType === 'put') {
            return progress[scanType] ? 'check-circle' : 'lightbulb';
        } else {
            // For stock scan
            const totalItems = progress.total;
            const scannedItems = progress.stock || 0;

            if (scannedItems >= totalItems) {
                return 'check-circle';
            } else if (scannedItems > 0) {
                return 'hourglass-empty';
            }
            return 'lightbulb';
        }
    };

    const getScanButtonColor = (reference, scanType) => {
        const progress = scanProgress[reference];
        if (!progress) return Colors.theme;

        if (scanType === 'pick' || scanType === 'put') {
            return progress[scanType] ? Colors.success : Colors.theme;
        } else {
            // For stock scan
            const scannedItems = progress.stock || 0;
            const totalItems = progress.total;

            if (scannedItems >= totalItems) {
                return Colors.success;
            } else if (scannedItems > 0) {
                return Colors.warning;
            }
            return Colors.theme;
        }
    };

    const groupedData = data.reduce((acc, item) => {
        if (!acc[item.reference]) {
            acc[item.reference] = [];
        }
        acc[item.reference].push(item);
        return acc;
    }, {});

    const toggleExpand = (reference) => {
        setExpandedReferences((prev) => ({
            ...prev,
            [reference]: !prev[reference],
        }));
    };

    const handleScannerPress = (reference, scanType) => {
        const orderGroup = groupedData[reference];
        if (!orderGroup || orderGroup.length === 0) return;

        const firstItem = orderGroup[0];
        if (firstItem.state !== 'assigned') {
            Alert.alert('Info', 'This order is not in scannable');
            return;
        }

        const progress = scanProgress[reference];
        if (progress) {
            if (scanType === 'pick' || scanType === 'put') {
                if (progress[scanType] === 1 ) {
                    Alert.alert('Info', `${scanType.toUpperCase()} scan already completed`);
                    return;
                }
            } else if (scanType === 'stock') {
                if (progress.stock >= progress.total) {
                    Alert.alert('Info' , 'All items have already been scanned');
                    return;
                }
            }
        }

        navigation.navigate('ScannerScreen', {
            reference,
            scanType,
            expectedBarcode: scanType === 'pick' || scanType === 'put' ? firstItem.source_document : null,
            onScanned: (ref, scannedBarcode, isGood) => handleScanComplete(ref, scannedBarcode, isGood, scanType)
        });
    };

    const renderItem = ({ item }) => {
        const isExpanded = expandedReferences[item.reference];
        const progress = scanProgress[item.reference] || {
            pick: 0,
            stock: 0,
            put: 0,
            total: 0
        };

        const isAssigned = item.state === 'assigned';

        return (
            <View style={styles.card}>
                <TouchableOpacity onPress={() => toggleExpand(item.reference)} style={styles.header}>
                    <View>
                        <Text style={styles.cardTitle}>Reference: {item.reference}</Text>
                        <Text style={[styles.stateText, item.state === 'assigned' ? styles.assignedState : styles.doneState]}>
                            {item.state.toUpperCase()}
                        </Text>
                    </View>
                    <Icon
                        name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                        size={wp('6%')}
                        color={Colors.darkGray}
                    />
                </TouchableOpacity>
                {isExpanded && (
                    <View style={styles.content}>
                        {/* Pick and Put Scanner Icons Section */}
                        {isAssigned && (
                            <View style={styles.scanIconsSection}>
                                <TouchableOpacity
                                    style={styles.scanButton}
                                    onPress={() => handleScannerPress(item.reference, 'pick')}
                                >
                                    <Icon
                                        name={getScanButtonIcon(item.reference, 'pick')}
                                        size={wp('6%')}
                                        color={getScanButtonColor(item.reference, 'pick')}
                                    />
                                    <Text style={styles.scanText}>Pick</Text>
                                    <Text style={styles.scanProgressText}>
                                        {progress.pick}/1
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.scanButton}
                                    onPress={() => handleScannerPress(item.reference, 'stock')}
                                >
                                    <Icon
                                        name={getScanButtonIcon(item.reference, 'stock')}
                                        size={wp('6%')}
                                        color={getScanButtonColor(item.reference, 'stock')}
                                    />
                                    <Text style={styles.scanText}>stock</Text>
                                    <Text style={styles.scanProgressText}>
                                        {progress.stock}/{progress.total}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.scanButton}
                                    onPress={() => handleScannerPress(item.reference, 'put')}
                                >
                                    <Icon
                                        name={getScanButtonIcon(item.reference, 'put')}
                                        size={wp('6%')}
                                        color={getScanButtonColor(item.reference, 'put')}
                                    />
                                    <Text style={styles.scanText}>Put</Text>
                                    <Text style={styles.scanProgressText}>
                                        {progress.put}/1
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* Product Details Section */}
                        {groupedData[item.reference].map((product, index) => (
                            <View key={index} style={styles.productItem}>
                                <View style={styles.productHeader}>
                                    <Text style={styles.productName}>{product.product} <Text style={styles.productCode}>({product.product_code})</Text></Text>
                                </View>
                                <View style={styles.productDetails}>
                                    <View style={styles.detailColumn}>
                                        <Text style={styles.detailLabel}>Vendor</Text>
                                        <Text style={styles.detailValue}>{product.vendor}</Text>
                                    </View>
                                    <View style={styles.detailColumn}>
                                        <Text style={styles.detailLabel}>Quantity</Text>
                                        <Text style={styles.detailValue}>{product.quantity}</Text>
                                    </View>
                                    <View style={styles.detailColumn}>
                                        <Text style={styles.detailLabel}>Destination</Text>
                                        <Text style={styles.detailValue}>{product.Destination}</Text>
                                    </View>
                                </View>
                                {scanProgress[item.reference]?.products[index] && (
                                    <View style={styles.productScanStatus}>
                                        <Text style={[
                                            styles.scanStatusText,
                                            progress.pick ? styles.scanStatusComplete : styles.scanStatusInProgress
                                        ]}>
                                            Pick: {progress.pick}/1
                                        </Text>
                                        <Text style={[
                                            styles.scanStatusText,
                                            scanProgress[item.reference].products[index].stock >= product.quantity ? 
                                                styles.scanStatusComplete : styles.scanStatusInProgress
                                        ]}>
                                            stock: {scanProgress[item.reference].products[index].stock}/{product.quantity}
                                        </Text>
                                        <Text style={[
                                            styles.scanStatusText,
                                            progress.put ? styles.scanStatusComplete : styles.scanStatusInProgress
                                        ]}>
                                            Put: {progress.put}/1
                                        </Text>
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>
                )}
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.theme} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={Object.keys(groupedData)}
                keyExtractor={(item) => item}
                renderItem={({ item }) => renderItem({ item: groupedData[item][0] })}
                contentContainerStyle={styles.grid}
            />
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        padding: hp('2%'),
    },
    grid: {
        paddingBottom: hp('2%'),
    },
    card: {
        backgroundColor: Colors.white,
        borderRadius: wp('2%'),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: hp('2%'),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: hp('2%'),
        borderLeftWidth: wp('1%'),
        borderLeftColor: Colors.theme,
    },
    content: {
        paddingHorizontal: hp('2%'),
        paddingBottom: hp('2%'),
    },
    stateText: {
        fontSize: wp('3%'),
        fontWeight: 'bold',
        marginTop: hp('0.5%'),
    },
    assignedState: {
        color: Colors.theme,
    },
    doneState: {
        color: Colors.success,
    },
    scanIconsSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: hp('1%'),
        paddingHorizontal: wp('2%'),
        marginBottom: hp('1%'),
    },
    scanButton: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: wp('2%'),
        paddingVertical: wp('3%'),
        paddingHorizontal: wp('2%'),
        backgroundColor: Colors.lightGray,
        marginHorizontal: wp('1%'),
        width: wp('28%'),
    },
    scanText: {
        marginTop: hp('1%'),
        fontSize: wp('4%'),
        color: Colors.theme,
    },
    productItem: {
        marginTop: hp('1%'),
        padding: hp('1.5%'),
        backgroundColor: Colors.lightGray,
        borderRadius: wp('2%'),
        marginBottom: hp('1%'),
    },
    productHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp('1%'),
    },
    productName: {
        fontSize: wp('3.8%'),
        color: Colors.darkGray,
        fontWeight: 'bold',
    },
    productCode: {
        fontSize: wp('3.2%'),
        color: Colors.theme,
    },
    productDetails: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    detailColumn: {
        width: '48%', // Two columns with a small gap
        marginBottom: hp('1%'),
    },
    detailLabel: {
        fontSize: wp('3.2%'),
        color: Colors.darkGray,
        fontWeight: 'bold',
    },
    detailValue: {
        fontSize: wp('3.2%'),
        color: Colors.darkGray,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanProgressText: {
        fontSize: wp('3%'),
        color: Colors.darkGray,
        marginTop: hp('0.5%'),
    },
    productScanStatus: {
        marginTop: hp('1%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    scanStatusText: {
        fontSize: wp('3%'),
        color: Colors.darkGray,
        marginRight: wp('2%'),
    },
    scanStatusComplete: {
        color: Colors.success,
        fontWeight: 'bold',
    },
    scanStatusInProgress: {
        color: Colors.warning,
    },
});

export default ReceiptsScreen;