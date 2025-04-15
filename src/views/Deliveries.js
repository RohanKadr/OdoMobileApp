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
import { useNavigation } from '@react-navigation/native'; // for navigation
import { DeliveryOrders } from '../data/delivery_orders';
import { getDeliveryOrderData } from '../controller/DeliveriesController';
import { getDataUsingService } from '../services/Network';
import { Services } from '../services/UrlConstant';

const DeliveriesScreen = ({ route }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedReferences, setExpandedReferences] = useState({});
    const navigation = useNavigation();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await getDataUsingService(Services.deliveryOrders);
            console.log("API Response:", response);

            const result = response;
            console.log("response", response);
            const transformedData = transformData(result.result);
            setData(transformedData);
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
                    customer: order.deliver_to,
                    product: product.product,
                    quantity: product.quantity,
                    reference: order.name,
                    scheduledDate: order.scheduled_date,
                    Destination: order.destination_location,
                    storagefacility: product.storage_facility,
                    effectiveDate: order.effective_date,
                    product_code: product.product_code,
                });
            });
        });
        return transformedData;
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

    const handleScannerPress = (reference) => {
        // Navigate to scanner screen for the selected reference (Pick/Put)
        navigation.navigate('ScannerScreen', { reference });
    };


    const test = () => {
        getDeliveryOrderData()
    }
    const renderItem = ({ item }) => {
        const isExpanded = expandedReferences[item.reference];
        return (
            <View style={styles.card}>
                <TouchableOpacity onPress={() => toggleExpand(item.reference)} style={styles.header}>
                    <Text style={styles.cardTitle}>Reference: {item.reference}</Text>
                    <Icon
                        name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                        size={wp('6%')}
                        color={Colors.darkGray}
                    />
                </TouchableOpacity> 
                {isExpanded && (
                    <View style={styles.content}>
                        {/* Pick and Put Scanner Icons Section */}
                        <View style={styles.scanIconsSection}>
                            <TouchableOpacity
                                style={styles.scanButton}
                                onPress={() => handleScannerPress('Pick')}
                            >
                                <Icon
                                    name="qr-code-scanner"
                                    size={wp('6%')} // Adjusted size for scanner icon
                                    color={Colors.theme}
                                />
                                <Text style={styles.scanText}>Pick</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.scanButton}
                                onPress={() => handleScannerPress('stock')}
                            >
                                <Icon
                                    name="qr-code-scanner"
                                    size={wp('6%')} // Adjusted size for scanner icon
                                    color={Colors.theme}
                                />
                                <Text style={styles.scanText}>stock</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.scanButton}
                                onPress={() => handleScannerPress('Put')}
                            >
                                <Icon
                                    name="qr-code-scanner"
                                    size={wp('6%')} // Adjusted size for scanner icon
                                    color={Colors.theme}
                                />
                                <Text style={styles.scanText}>Put</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Product Details Section */}
                        {groupedData[item.reference].map((product, index) => (
                            <View key={index} style={styles.productItem}>
                                <View style={styles.productHeader}>
                                    <Text style={styles.productName}>{product.product} <Text style={styles.productCode}>({product.product_code})</Text></Text>
                                </View>
                                <View style={styles.productDetails}>
                                    <View style={styles.detailColumn}>
                                        <Text style={styles.detailLabel}>Customer</Text>
                                        <Text style={styles.detailValue}>{product.customer}</Text>
                                    </View>
                                    <View style={styles.detailColumn}>
                                        <Text style={styles.detailLabel}>Quantity</Text>
                                        <Text style={styles.detailValue}>{product.quantity}</Text>
                                    </View>
                                    <View style={styles.detailColumn}>
                                        <Text style={styles.detailLabel}>Destination</Text>
                                        <Text style={styles.detailValue}>{product.Destination}</Text>
                                    </View>
                                    <View style={styles.detailColumn}>
                                        <Text style={styles.detailLabel}>Storage Facility</Text>
                                        <Text style={styles.detailValue}>{product.storagefacility}</Text>
                                    </View>
                                    <View style={styles.detailColumn}>
                                        <Text style={styles.detailLabel}>Scheduled Date</Text>
                                        <Text style={styles.detailValue}>{product.scheduledDate}</Text>
                                    </View>
                                    <View style={styles.detailColumn}>
                                        <Text style={styles.detailLabel}>Effective Date</Text>
                                        <Text style={styles.detailValue}>{product.effectiveDate}</Text>
                                    </View>
                                </View>
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
});

export default DeliveriesScreen;
