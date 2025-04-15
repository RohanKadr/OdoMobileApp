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
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Assets } from '../../assets/images/Assets';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { getDataUsingService } from '../services/Network';
import { Services } from '../services/UrlConstant';

const SalesOrdersScreen = ({ route, navigation }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedReferences, setExpandedReferences] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // const response = await axios({
            //     method: 'get',
            //     url: 'http://192.168.0.120:8092/generic_wms/sales_orders',
            //     // headers: {
            //     //     'Content-Type': 'application/json',
            //     //     'Cookie': 'session_id=SS97bfOpAvYlMMNa0DXr_YyiHMZtkSCB6G6mPwuNTBrTxZwue-J0rckvbMgzwZ8ftO5o-dXevLyO2pzzqrGY',
            //     // },
            // });
            const response = await getDataUsingService(Services.salesOrders);
            console.log("API Response:", response);

             const result = response;
             const transformedData = transformData(result.result);
             setData(transformedData);
        } catch (error) {
            console.error('Error fetching data:', error);
            Alert.alert('Error', 'Failed to fetch data. Please check your network connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    const transformData = (apiData) => {
        const transformedData = [];
        apiData.forEach(order => {
            order.products.forEach(product => {
                transformedData.push({
                    id: '${order.id}-${product.product_id}',
                    customer: order.customer,
                    product: product.product,
                    quantity: product.quantity,
                    reference: order.name,
                    orderDate: order.order_date,
                    customerAddress: order.customer_address,
                    status: order.state,
                    expectedArrival: order.effective_date,
                    product_code: product.product_code
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
            [reference] : !prev[reference],
        }));
    };

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
                        {groupedData[item.reference].map((product, index) => (
                            <View key={index} style={styles.productItem}>
                                <View style={styles.productHeader}>
                                    <Text style={styles.productName}>{product.product} <Text style={styles.productCode}>({product.product_code})</Text></Text>
                                </View>
                                <View style={styles.productDetails}>
                                    <View style={styles.detailColumn}>
                                        <Text style={styles.detailLabel}>customer</Text>
                                        <Text style={styles.detailValue}>{product.customer}</Text>
                                    </View>
                                    <View style={styles.detailColumn}>
                                        <Text style={styles.detailLabel}>Quantity</Text>
                                        <Text style={styles.detailValue}>{product.quantity}</Text>
                                    </View>
                                    <View style={styles.detailColumn}>
                                        <Text style={styles.detailLabel}>Customer Address</Text>
                                        <Text style={styles.detailValue}>{product.customerAddress}</Text>
                                    </View>
                                    {/* <View style={styles.detailColumn}>
                                        <Text style={styles.detailLabel}>Status</Text>
                                        <Text style={[styles.detailValue, { color: product.status === 'completed' ? Colors.success : Colors.warning }]}>
                                            {product.status}
                                        </Text>
                                    </View> */}
                                    <View style={styles.detailColumn}>
                                        <Text style={styles.detailLabel}>Order Date</Text>
                                        <Text style={styles.detailValue}>{product.orderDate}</Text>
                                    </View>
                                    {/* <View style={styles.detailColumn}>
                                        <Text style={styles.detailLabel}>Expected Arrival</Text>
                                        <Text style={styles.detailValue}>{product.expectedArrival}</Text>
                                    </View> */}
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
                renderItem={({item}) => renderItem({ item: groupedData[item] [0] })}
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

export default SalesOrdersScreen;