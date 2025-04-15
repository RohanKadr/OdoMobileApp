import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors } from '../utils/Color';
import { Assets } from '../../assets/images/Assets';
import SalesOrdersScreen from './SalesOrders';
import PickingScreen from './Picking';
import DeliveriesScreen from './Deliveries';

const OutboundScreen = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState(1); // Default to first tab
    
    const tabs = [
        { id: 1, title: 'Sales Orders', icon: Assets.img_order, component: <SalesOrdersScreen navigation={navigation} /> },
        { id: 2, title: 'Picking', icon: Assets.img_picking, component: <PickingScreen navigation={navigation} /> },
        { id: 3, title: 'Deliveries', icon: Assets.img_deliveries, component: <DeliveriesScreen navigation={navigation} /> },
    ];

    const renderTabContent = () => {
        const activeTabData = tabs.find(tab => tab.id === activeTab);
        return activeTabData ? activeTabData.component : null;
    };

    return (
        <View style={styles.container}>
            {/* Tab Content - Takes up most of the screen */}
            <View style={styles.contentContainer}>
                {renderTabContent()}
            </View>
            
            {/* Tab Buttons - Fixed at the bottom */}
            <View style={styles.tabContainer}>
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab.id}
                        style={styles.tabButton}
                        onPress={() => setActiveTab(tab.id)}
                        activeOpacity={0.7}
                    >
                        <View style={[
                            styles.tabInner,
                            activeTab === tab.id && styles.activeTabInner
                        ]}>
                            <Image 
                                source={tab.icon} 
                                style={[
                                    styles.icon,
                                    activeTab === tab.id ? styles.activeIcon : styles.inactiveIcon
                                ]} 
                            />
                            <Text style={[
                                styles.tabText,
                                activeTab === tab.id ? styles.activeText : styles.inactiveText
                            ]}>
                                {tab.title}
                            </Text>
                            {activeTab === tab.id && (
                                <View style={styles.activeIndicator} />
                            )}
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    contentContainer: {
        flex: 1,
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: hp('1%'),
        backgroundColor: Colors.theme,
        borderTopWidth: 1,
        borderTopColor: Colors.lightGray,
        height: hp('8%'),
    },
    tabButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: wp('30%'),
    },
    tabInner: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: hp('0.5%'),
        width: '100%',
    },
    activeTabInner: {
        position: 'relative',
    },
    icon: {
        width: wp('6%'),
        height: hp('3%'),
        resizeMode: 'contain',
        marginBottom: hp('0.3%'),
        tintColor: Colors.white,
    },
    activeIcon: {
        tintColor: Colors.white,
        width: wp('7%'),
        height: hp('3.5%'),
    },
    inactiveIcon: {
        tintColor: Colors.gray,
        opacity: 0.7,
    },
    tabText: {
        fontSize: wp('3%'),
        fontWeight: '500',
        color: Colors.white,
    },
    activeText: {
        color: Colors.white,
        fontWeight: 'bold',
    },
    inactiveText: {
        color: Colors.darkcyan,
        opacity: 0.7,
    },
    activeIndicator: {
        position: 'absolute',
        top: -hp('1.5%'),
        width: wp('12%'),
        height: hp('0.5%'),
        backgroundColor: Colors.white,
        borderRadius: wp('0.5%'),
    },
});

export default OutboundScreen;