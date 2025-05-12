import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
    Modal,
    ScrollView,
    RefreshControl,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors } from '../utils/Color';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getDataUsingService, postQualityCheckProduct } from '../services/Network';
import { Services } from '../services/UrlConstant';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QualityCheckModal from '../component/QualityCheck';

const ReceiptsScreen = ({ route }) => {
    const [data, setData] = useState([]);
    const [payload, setpaylaod] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expandedReferences, setExpandedReferences] = useState({});
    const [scanProgress, setScanProgress] = useState({});
    const [modalProducts, setModalProducts] = useState([]);
    const [modalReference, setModalReference] = useState(null);
    const [validateData, setValidateData] = useState({});
    const [noOfScannedItems, setNoOfScannedItems] = useState(0);
    const [isModalVisible, setisModalVisible] = useState(false);
    const [qualityCheckResult, setQualityCheckResult] = useState(null);
    const navigation = useNavigation();

    // useEffect(() => {
    //     setLoading(true);
    //     fetchData();
    // }, []);

    useFocusEffect(
        React.useCallback(() => {
            setLoading(true);
            fetchData();
        }, [])
    );


    useEffect(() => {
        AsyncStorage.setItem('@validateData', JSON.stringify(validateData));
        loadModalProducts();
    }, [])

    const saveModalProducts = async (products) => {
        try {
            const jsonValue = JSON.stringify(products);
            await AsyncStorage.setItem('@modalProducts', jsonValue);
        } catch (e) {
            // saving error
            console.error("Error saving data: ", e);
        }
    };


    const loadModalProducts = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@modalProducts');
            if (jsonValue != null) {
                setModalProducts(JSON.parse(jsonValue));
            }
        } catch (e) {
            // error reading value
            console.error("Error loading data: ", e);
        }
    };

    const fetchData = async () => {
        try {
            const response = await getDataUsingService(Services.receiptOrders);

            const result = response;
            const transformedData = transformData(result.result);
            setData(transformedData);

            // Initialize scan progress
            const progress = {};
            result.result.forEach(order => {
                progress[order.name] = {
                    stock: 0, // total scanned product units count
                    put: 0, // 0 or 1 for source_document scan
                    total: order.products.reduce((sum, products) => sum + products.demand_quantity, 0),
                    products: order.products.map(product => ({
                        product_id: product.product_id,
                        product_code: product.product_code,
                        quantity: product.demand_quantity,
                        stock: product.quantity // scanned units count for each product
                    })),
                    source_document: order.source_document,
                    source_location_scan: order.source_location_scan,
                    destination_location_scan: order.destination_location_scan,
                };

            });
            // initializeModalProducts();
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
                if (order.state === 'assigned') {
                    transformedData.push({
                        id: order.id,
                        vendor: order.receive_from,
                        product: product.product,
                        quantity: product.quantity,
                        reference: order.name,
                        scheduledDate: order.scheduled_date,
                        Destination: order.operation_type,
                        demandquantity: product.demand_quantity,
                        effectiveDate: order.effective_date,
                        product_code: product.product_code,
                        state: order.state,
                        source_document: order.source_document,
                    });
                }

            });
        });
        console.log("transformed data ", transformedData)


        // ONLY TODAYS DATA
        const today = new Date().toISOString().slice(0, 10);
        const todaysData = transformedData.filter(item =>
            item.scheduledDate && item.scheduledDate.startsWith(today)
        );

        // Sort descending by id
        todaysData.sort((a, b) => b.id - a.id);
        console.log('todaysData', todaysData)

        return todaysData;
    };

    let index = 0;
    // Duplicate products by their quantity for modal display
    const expandProductsByQuantity = (products) => {
        const expanded = [];
        products.forEach(prod => {
            for (let i = 0; i < prod.quantity; i++) {
                // Each repeated product instance has an instanceIndex for uniqueness in modal
                expanded.push({
                    ...prod,
                    instanceIndex: i
                });
            }
        });
        return expanded;
    };

    async function updateValidateData(update) {

        try {
            // update can be object or function(prev) => newState
            const newData =
                typeof update === 'function' ? update(validateData) : update;
            setValidateData(newData); // update react state
            // Save to AsyncStorage
            await AsyncStorage.setItem('@validateData', JSON.stringify(newData));

        } catch (e) {
            console.error('Failed to update validateData', e);
        }
    }


    async function handleUpdateItemScanned(data) {

        await updateValidateData(prev => ({
            ...prev,
            itemScanned: data,
        }));
    }


    // const handleScanPress = (productCode, instanceIndex) => {
    //     const progress = scanProgress[modalReference];

    //     if (!progress) {
    //         Alert.alert('Error', 'No progress found for this reference.');
    //         return;
    //     }

    //     navigation.navigate('ScannerScreen', {
    //         productCode,
    //         origin: progress.source_document, // Pass the reference as origin
    //         flag: 'Receipt', // Set the operation type
    //         onScanComplete: (response) => {
    //             // Handle the response from the scan
    //             // if (response && response.data) {
    //             //     const { message } = response.data;
    //             //     // Alert.alert('Success', message);

    //             //     const updatedProducts = modalProducts.map(product => {
    //             //         if (product.instanceIndex === instanceIndex) {
    //             //             return { ...product, scanStatus: true }; // Set scanStatus to true
    //             //         }
    //             //         return product;
    //             //     });

    //             //     console.log("updatedProducts",updatedProducts);

    //             //     saveModalProducts(updatedProducts)
    //             //     // setModalProducts(updatedProducts);
    //             //     // setValidateData(prev => ({
    //             //     //     ...prev, 
    //             //     //     itemScanned: 1 
    //             //     // }));


    //             //     // Update scan progress for the scanned product
    //             //     // setScanProgress(prev => {
    //             //     //     const newProgress = { ...prev };
    //             //     //     const productIndex = newProgress[modalReference].products.findIndex(
    //             //     //         p => p.product_code === productCode
    //             //     //     );

    //             //     //     if (productIndex >= 0) {
    //             //     //         if (newProgress[modalReference].products[productIndex].stock < newProgress[modalReference].products[productIndex].quantity) {
    //             //     //             newProgress[modalReference].products[productIndex].stock += 1; // Increment product scanned count
    //             //     //             newProgress[modalReference].stock += 1; // Increment total scanned count
    //             //     //         } else {
    //             //     //             Alert.alert('Info', 'All units scanned for this product');
    //             //     //         }
    //             //     //     }
    //             //     //     return newProgress;
    //             //     // });
    //             // } else {
    //             //     Alert.alert('Error', 'Failed to scan product. Please try again.');
    //             // }
    //             console.log("herer ----")
    //             handleUpdateItemScanned();
    //             loadModalProducts()

    //         },
    //     });
    // };

    const handleScanComplete = (reference, scannedData, isGood, scanType) => {
        if (!isGood) {
            Alert.alert('Scan Failed', 'Quality check failed for this scan');
            return;
        }

        setScanProgress(prev => {
            const newProgress = { ...prev };
            const referenceData = newProgress[reference];

            if (!referenceData) return prev;

            // For 'put' scan: check if scanned matches source_document, mark put as 1
            if (scanType === 'put') {
                if (scannedData === referenceData.source_document) {
                    newProgress[reference].put = 1;
                } else {
                    Alert.alert('Error', 'Scanned document does not match the source document');
                }
            } else if (scanType === 'stock') {
                // For stock scan from modal (scannedData being product_code)
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
        setLoading(true);
        fetchData();
    };

    const getScanButtonIcon = (reference, scanType) => {
        const progress = scanProgress[reference];
        if (!progress) return 'bulb-outline';

        if (scanType === 'put') {
            return progress[scanType] ? 'checkmark-circle' : 'barcode-outline';
        } else {
            const totalItems = progress.total;
            const scannedItems = progress.stock || 0;
            if (scannedItems >= totalItems) return 'checkmark-circle';
            if (scannedItems > 0) return 'time-outline';
            return 'bulb-outline';
        }
    };

    const getScanButtonColor = (reference, scanType) => {
        const progress = scanProgress[reference];
        if (!progress) return Colors.theme;

        if (scanType === 'put') {
            return progress[scanType] ? Colors.success : Colors.theme;
        } else {
            const scannedItems = progress.stock || 0;
            const totalItems = progress.total;
            if (scannedItems >= totalItems) return Colors.success;
            if (scannedItems > 0) return Colors.warning;
            return Colors.theme;
        }
    };

    const groupedData = data.reduce((acc, item) => {
        if (!acc[item.reference]) acc[item.reference] = [];
        acc[item.reference].push(item);
        return acc;
    }, {});


    async function handleSetInitial({ item }) {
        await updateValidateData({
            data: {
                origin: item.source_document,
                flag: 'Receipt',
            },
            itemScanned: 0,
        });
    }


    const toggleExpand = (item) => {

        ({ item })
        // setValidateData({
        //     data: {
        //         origin: item.source_document,
        //         flag: 'Reciept'
        //     },
        //     itemScanned: 0
        // })
        setExpandedReferences(prev => ({
            ...prev,
            [item.reference]: !prev[item.reference],
        }));
    };

    // When pressing stock scan, open modal showing individual product units for scanning
    const handleStockScanPress = (reference) => {
        index = 0;
        const orderGroup = groupedData[reference];
        if (!orderGroup || orderGroup.length === 0) return;
        const firstItem = orderGroup[0];

        if (firstItem.state !== 'assigned') {
            Alert.alert('Info', 'This order is not in scannable');
            return;
        }

        const progress = scanProgress[reference];
        if (progress.stock >= progress.total) {
            Alert.alert('Info', 'All items have already been scanned');
            return;
        }

        // Expand products by quantity

        const expandedProds = expandProductsByQuantity(progress.products.map((p, index) => ({
            ...p,
            product: orderGroup.find(og => og.product_code === p.product_code)?.product || '',
            quantity: p.quantity,
            scanStatus: "false"
        })));

        saveModalProducts(expandedProds);
        // setModalProducts(expandedProds);
        setModalReference(reference);
        // setModalVisible(true);
        navigation.navigate('ScannerScreen', {
            // productCode,
            origin: progress.source_document, // Pass the reference as origin
            flag: 'Receipt', // Set the operation type
            scanType: 'Stock',
            validateState: validateData.itemScanned,
            validateJSON: {
                data: {
                    flag: "Receipt",
                    origin: ""
                }
            },
            onScanComplete: (payload) => {
                // const payload = {
                //     origin: payload.origin,
                //     product_barcode: payload.barcode,
                // };
                // setpaylaod(payload);
                // console.log("Payload: ---", payload);
                setisModalVisible(true);
                // Handle the response from the scan
                fetchData();

                // if (response && response.data) {
                //     const { message } = response.data;
                //     Alert.alert('Success', message);

                //     const updatedProducts = modalProducts.map(product => {
                //         if (product.instanceIndex === instanceIndex) {
                //             return { ...product, scanStatus: true }; // Set scanStatus to true
                //         }
                //         return product;
                //     });

                //     console.log("updatedProducts",updatedProducts);

                //     saveModalProducts(updatedProducts)
                //     loadModalProducts()
                //     // setModalProducts(updatedProducts);
                //     // setValidateData(prev => ({
                //     //     ...prev, 
                //     //     itemScanned: 1 
                //     // }));
                //     handleUpdateItemScanned();




                //     // Update scan progress for the scanned product
                //     // setScanProgress(prev => {
                //     //     const newProgress = { ...prev };
                //     //     const productIndex = newProgress[modalReference].products.findIndex(
                //     //         p => p.product_code === productCode
                //     //     );

                //     //     if (productIndex >= 0) {
                //     //         if (newProgress[modalReference].products[productIndex].stock < newProgress[modalReference].products[productIndex].quantity) {
                //     //             newProgress[modalReference].products[productIndex].stock += 1; // Increment product scanned count
                //     //             newProgress[modalReference].stock += 1; // Increment total scanned count
                //     //         } else {
                //     //             Alert.alert('Info', 'All units scanned for this product');
                //     //         }
                //     //     }
                //     //     return newProgress;
                //     // });
                // } else {
                //     Alert.alert('Error', 'Failed to scan product. Please try again.');
                // }

            },
        });
    };


    const handlePutScanPress = (reference, stockQty, source_document) => {
        const orderGroup = groupedData[reference];
        if (!orderGroup || orderGroup.length === 0) return;
        const firstItem = orderGroup[0];

        if (firstItem.state !== 'assigned') {
            Alert.alert('Info', 'This order is not in scannable');
            return;
        }

        const progress = scanProgress[reference];
        if (progress.put === 1) {
            Alert.alert('Info', 'PUT scan already completed');
            return;
        }

        navigation.navigate('ScannerScreen', {
            reference,
            scanType: 'Put',
            validateState: stockQty,
            validateJSON: {
                data: {
                    flag: "Receipt",
                    origin: source_document
                }
            },
            onScanned: (ref, scannedBarcode, isGood) => handleScanComplete(ref, scannedBarcode, isGood, 'put'),
        });
    };

    // Modal scan simulate handler. Normally, you would integrate real barcode scanner here.
    const simulateBarcodeScan = (productCode) => {
        // Here, quality is always true for demonstration
        handleScanComplete(modalReference, productCode, true, 'stock');
    };

    // Render each product instance in the modal with a scan button/icon
    // const renderModalProduct = ({ item, index }) => {
    //     // Computed count of scanned items for this product code
    //     const scannedUnits = scanProgress[modalReference]?.products.find(p => p.product_code === item.product_code)?.stock || 0;
    //     // Count how many previous instances of this product in the expanded array have been scanned, or use overall stock count logically
    //     // We simplify by considering scannedUnits as scanned count, so disable scan button if scannedUnits >= quantity
    //     const disabled = scannedUnits >= item.quantity;

    //     return (
    //         <View style={styles.modalProductItem} key={item.product_code + '_' + item.instanceIndex}>
    //             <Text style={styles.modalProductText}>{item.product} (Code: {item.product_code})</Text>
    //             <TouchableOpacity
    //                 style={[styles.scanIconButton, disabled && styles.scanIconButtonDisabled]}
    //                 onPress={() => {
    //                     if (disabled) {
    //                         Alert.alert('Info', 'All units scanned for this product');
    //                         return;
    //                     }
    //                     handleScanPress(item.product_code, item.instanceIndex);
    //                 }}
    //                 disabled={item.scanStatus === "true"}
    //             >
    //                 {item.scanStatus === "false" ?
    //                     <Icon name="barcode-outline" size={30} color={disabled ? Colors.lightGray : Colors.theme} /> :
    //                     <Icon name="checkmark" size={30} color={disabled ? Colors.lightGray : Colors.theme} />}
    //             </TouchableOpacity>
    //         </View>
    //     );
    // };

    const calStockQty = (progress) => {
        return progress.products.reduce((accumulator, product) => {
            return accumulator + product.stock;
        }, 0);
    }
    const renderItem = ({ item }) => {
        const isExpanded = expandedReferences[item.reference];
        const progress = scanProgress[item.reference] || { stock: 0, put: 0, total: 0 };
        // const progress = modalProducts.filter(product => product.scanStatus === "true").length;
        const isAssigned = item.state === 'assigned';
        const stockQty = calStockQty(progress);
        return (
            <View style={styles.card}>
                <TouchableOpacity onPress={() => toggleExpand(item)} style={styles.header}>
                    <View>
                        <Text style={styles.cardTitle}>Reference: {item.reference}</Text>
                        <Text style={[styles.stateText, item.state === 'assigned' ? styles.assignedState : styles.doneState]}>
                            {item.state.toUpperCase()}
                        </Text>
                    </View>
                    <Icon
                        name={isExpanded ? 'chevron-up-outline' : 'chevron-down-outline'}
                        size={wp('6%')}
                        color={Colors.darkGray}
                    />
                </TouchableOpacity>
                {isExpanded && (
                    <View style={styles.content}>
                        {isAssigned && (
                            <View style={styles.scanIconsSection}>
                                <TouchableOpacity
                                    style={styles.scanButton}
                                    onPress={() => handleStockScanPress(item.reference)}
                                    disabled={progress.products.reduce((accumulator, product) => {
                                        return accumulator + product.stock;
                                    }, 0) >= progress.total}
                                >
                                    <Icon
                                        name={stockQty >= progress.total ? 'checkmark-circle' : 'bulb-outline'}
                                        size={wp('6%')}
                                        color={Colors.theme}
                                    />
                                    <Text style={styles.scanText}>
                                        Stock
                                    </Text>
                                    <Text style={styles.scanProgressText}>
                                        {progress.products.reduce((accumulator, product) => {
                                            return accumulator + product.stock;
                                        }, 0)}/{progress.total}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.scanButton}
                                    disabled={item.destination_location_scan}
                                    onPress={() => handlePutScanPress(item.reference, stockQty, item.source_document)}
                                >
                                    {item.destination_location_scan ?
                                        <Icon name={'checkmark-circle'} size={wp('6%')} color={Colors.theme} /> :
                                        <Icon name={'barcode-outline'} size={wp('6%')} color={Colors.theme} />}
                                    {/* <Icon
                                        name={getScanButtonIcon(item.reference, 'put')}
                                        size={wp('6%')}
                                        color={getScanButtonColor(item.reference, 'put')}
                                    /> */}
                                    <Text style={styles.scanText}>Put</Text>
                                    {/* <Text style={styles.scanProgressText}>
                                        {progress.put}/1
                                    </Text> */}
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
                                            scanProgress[item.reference].products[index].stock >= product.quantity ?
                                                styles.scanStatusComplete : styles.scanStatusInProgress
                                        ]}>
                                            {/* Stock: {scanProgress[item.reference].products[index].stock}/{product.quantity} */}
                                        </Text>
                                        <Text style={[
                                            styles.scanStatusText,
                                            progress.put ? styles.scanStatusComplete : styles.scanStatusInProgress
                                        ]}>
                                            {/* Put: {progress.put}/1 */}
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
                keyExtractor={item => item}
                renderItem={({ item }) => renderItem({ item: groupedData[item][0] })}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshing={loading}
                onRefresh={() => {
                    setLoading(true);
                    fetchData();
                }}
            />

            <QualityCheckModal
                visible={isModalVisible}
                onClose={() => setisModalVisible(false)}
                onQualityCheck={(result) => {
                    setQualityCheckResult(result);
                    setisModalVisible(false);
                    if (result === 'good') {
                        Alert.alert('Good', 'Good Product');
                        console.log('Payload ---', payload);
                        postQualityCheckProduct(Services.qualityCheck, payload);
                    }
                    if (result === 'bad') {
                        Alert.alert('Bad', 'Bad Product');
                    }
                }}
            />

            {/* Modal for Stock Scanning */}
            {/* <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Scan Products for {modalReference}</Text>
                        <ScrollView style={styles.modalScroll}>
                            {modalProducts.map((item, index) => renderModalProduct({ item, index }))}
                        </ScrollView>
                        <View style={{
                            flexDirection: 'row', // Arrange buttons side by side
                            justifyContent: 'space-evenly',
                            alignItems: 'center',
                        }}>
                            <TouchableOpacity
                                style={styles.modalCloseButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.modalCloseText}>Close</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </Modal> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        padding: hp('2%'),
    },
    listContent: {
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
    // cardTitle: {
    //     fontSize: wp('4.5%'),
    //     fontWeight: 'bold',
    //     color: Colors.darkGray,
    // },
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
        justifyContent: 'top',
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: wp('4%'),
    },
    modalContainer: {
        width: '90%',
        maxHeight: '80%',
        backgroundColor: Colors.white,
        borderRadius: wp('2%'),
        padding: hp('2%'),
    },
    modalTitle: {
        fontSize: wp('5%'),
        fontWeight: 'bold',
        marginBottom: hp('1.5%'),
        textAlign: 'center',
        color: Colors.darkGray,
    },
    modalScroll: {
        marginBottom: hp('1.5%'),
    },
    modalProductItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.lightGray,
        borderRadius: wp('1.5%'),
        paddingVertical: hp('1%'),
        paddingHorizontal: wp('3%'),
        marginBottom: hp('1%'),
    },
    modalProductText: {
        fontSize: wp('4%'),
        color: Colors.darkGray,
        flex: 1,
    },
    scanIconButton: {
        padding: 6,
        borderRadius: 6,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.theme,
    },
    scanIconButtonDisabled: {
        backgroundColor: Colors.lightGray,
        borderColor: Colors.lightGray,
    },
    modalCloseButton: {
        backgroundColor: Colors.theme,
        borderRadius: wp('2%'),
        paddingVertical: hp('1.2%'),
        alignItems: 'center',
        width: "30%"
    },
    modalValidateButton: {
        backgroundColor: '#007BFF',
        borderRadius: wp('2%'),
        paddingVertical: hp('1.2%'),
        alignItems: 'center',
        width: "30%"
    },
    modalCloseText: {
        color: Colors.white,
        fontSize: wp('4%'),
        fontWeight: 'bold',
    },
});

export default ReceiptsScreen;

