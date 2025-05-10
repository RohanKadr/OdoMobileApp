import React, { useEffect } from "react";
import { Image, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

//Importing Navigators from React package
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

//Import Utils
import { Colors } from "../utils/Color";
import { Assets } from "../../assets/images/Assets";
import { getHeaderOptions } from "../component/HeaderIcon";

//Import Screens
import LoginScreen from "../views/Login";
import HomeScreen from "../views/Home";
import InboundScreen from "../views/Inbound";
import OutboundScreen from "../views/Outbound";
import ProfileScreen from "../views/Profile";
import ScannerScreen from "../views/Scanner";
import Launcher from "../views/Launcher";
import ASNScreen from "../views/ASN";
import ReceiptsScreen from "../views/Receipts";
import PutawayScreen from "../views/Putaway";
import SalesOrdersScreen from "../views/SalesOrders";
import PickingScreen from "../views/Picking";
import DeliveriesScreen from "../views/Deliveries";
import InternalScreen from "../views/Internal";
import PackageDeliveryApp from "../views/Printlabel";
import PlusButton from "../component/PlusButton";



const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const EmptyScreen = () => null;

const AuthNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

const TabNavigator = ({ route }) => {
    // Determine the initial tab based on itemID
    const initialScreen = route.params?.initialScreen || 1;

    const getInitialRouteName = (screen) => {
        switch (screen) {
            case 1: return 'ReceiptsTab';
            case 2: return 'PutawayTab';
            case 3: return 'PickingTab';
            case 4: return 'DeliveryTab';
            default: return 'ReceiptsTab';
        }
    };

    // Common header options for all tab screens
    const getTabHeaderOptions = (navigation, title) => ({
        headerLeft: () => (
            <TouchableOpacity
                onPress={() => navigation.navigate('Home')}
                style={{ marginLeft: 15 }}
            >
                <Image source={Assets.img_logo} style={style.logo} />
            </TouchableOpacity>
        ),
        headerTitle: () => (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={style.HeaderTab}>{title}</Text>
            </View>
        ),
        headerTitleAlign: 'center',
        headerStyle: {
            backgroundColor: Colors.theme,
        },
        headerTintColor: Colors.white,
        headerRight: () => (
            <TouchableOpacity
                style={{ marginRight: 15 }}
                onPress={() => navigation.navigate('ProfileScreen')}
            >
                <Image source={Assets.img_man} style={style.HeaderProfile} />
            </TouchableOpacity>
        ),
    });

    return (
        <Tab.Navigator
            initialRouteName={getInitialRouteName(initialScreen)}
            screenOptions={{
                tabBarActiveTintColor: Colors.white,
                tabBarStyle: {
                    position: 'absolute',
                    backgroundColor: Colors.theme,
                    elevation: 20,
                },
                headerShown: false
            }}>

            {/* Receipts Tab with nested stack */}
            <Tab.Screen
                name="ReceiptsTab"
                options={{
                    tabBarLabel: 'Receipts',
                    tabBarIcon: ({ color, size }) => (
                        <Image source={Assets.img_receipt} style={{ width: size, height: size, tintColor: color }} />
                    ),
                }}>
                {() => (
                    <Stack.Navigator>
                        <Stack.Screen
                            name="Receipts"
                            component={ReceiptsScreen}
                            options={({ navigation }) => getTabHeaderOptions(navigation, 'Receipts')}
                        />
                    </Stack.Navigator>
                )}
            </Tab.Screen>

            {/* Putaway Tab */}
            <Tab.Screen
                name="PutawayTab"
                options={{
                    tabBarLabel: 'Putaway',
                    tabBarIcon: ({ color, size }) => (
                        <Image source={Assets.img_putaway} style={{ width: size, height: size, tintColor: color }} />
                    ),
                }}>
                {() => (
                    <Stack.Navigator>
                        <Stack.Screen
                            name="Putaway"
                            component={PutawayScreen}
                            options={({ navigation }) => getTabHeaderOptions(navigation, 'Putaway')}
                        />
                    </Stack.Navigator>
                )}
            </Tab.Screen>

            {/* Custom add button */}
            <Tab.Screen
                name="PlusButton"
                component={EmptyScreen}
                options={({ navigation }) => ({
                    tabBarButton: (props) => (
                        <View style={{ top: 70 }}>
                            <PlusButton navigation={navigation} />
                        </View>
                    ),
                })}
            />

            {/* Picking Tab */}
            <Tab.Screen
                name="PickingTab"
                options={{
                    tabBarLabel: 'Picking',
                    tabBarIcon: ({ color, size }) => (
                        <Image source={Assets.img_picking} style={{ width: size, height: size, tintColor: color }} />
                    ),
                }}>
                {() => (
                    <Stack.Navigator>
                        <Stack.Screen
                            name="Picking"
                            component={PickingScreen}
                            options={({ navigation }) => getTabHeaderOptions(navigation, 'Picking')}
                        />
                    </Stack.Navigator>
                )}
            </Tab.Screen>

            {/* Deliveries Tab */}
            <Tab.Screen
                name="DeliveryTab"
                options={{
                    tabBarLabel: 'Deliveries',
                    tabBarIcon: ({ color, size }) => (
                        <Image source={Assets.img_deliveries} style={{ width: size, height: size, tintColor: color }} />
                    ),
                }}>
                {() => (
                    <Stack.Navigator>
                        <Stack.Screen
                            name="Deliveries"
                            component={DeliveriesScreen}
                            options={({ navigation }) => getTabHeaderOptions(navigation, 'Deliveries')}
                        />
                    </Stack.Navigator>
                )}
            </Tab.Screen>
        </Tab.Navigator>
    );
};

const AllNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Launcher">
                {/* SplashScreen which will come once for 3 Seconds */}
                <Stack.Screen
                    name="Launcher"
                    component={Launcher}
                    // Hiding header for Splash Screen
                    options={{ headerShown: false }}
                />
                {/* Auth Navigator: Include Login, Registration & Forgot Password */}
                <Stack.Screen
                    name="AuthNavigator"
                    component={AuthNavigator}
                    options={{ headerShown: false }}
                />
                {/* TabBar as a landing page after Login */}
                <Stack.Screen
                    name="TabNavigator"
                    component={TabNavigator}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="InboundScreen"
                    component={InboundScreen}
                    options={{
                        title: 'Inbound', //Set Header Title
                        headerStyle: {
                            backgroundColor: Colors.theme, //Set Header color
                        },
                        headerTintColor: Colors.white, //Set Header text color
                        headerTitleStyle: {
                            fontWeight: '500', //Set Header text style
                        },
                    }}
                />
                <Stack.Screen
                    name="OutboundScreen"
                    component={OutboundScreen}
                    options={{
                        title: 'Outbound', //Set Header Title
                        headerStyle: {
                            backgroundColor: Colors.theme, //Set Header color
                        },
                        headerTintColor: Colors.white, //Set Header text color
                        headerTitleStyle: {
                            fontWeight: '500', //Set Header text style
                        },
                    }}
                />
                <Stack.Screen
                    name="ScannerScreen"
                    component={ScannerScreen}
                    options={({ navigation }) => ({
                        title: 'Scan', //Set Header Title
                        headerStyle: {
                            backgroundColor: Colors.theme, //Set Header color
                        },
                        headerTintColor: Colors.white, //Set Header text color
                        headerLeft: () => (
                            <TouchableOpacity
                                style={{ marginLeft: 15 }}
                                onPress={() => navigation.goBack()}
                            >
                                <Icon
                                    name="arrow-left"
                                    size={24}
                                    color={Colors.white}
                                />
                            </TouchableOpacity>
                        ),
                        headerTitle: () => (
                            <TouchableOpacity
                                style={{ marginRight: 15 }}
                                onPress={() => navigation.navigate('Home')}
                            >
                                <Image source={Assets.img_logo} style={style.logo} />
                            </TouchableOpacity>

                        ),
                        headerRight: () => (
                            <TouchableOpacity
                                style={{ marginRight: 15 }}
                                onPress={() => navigation.navigate('ProfileScreen')}
                            >
                                <Image source={Assets.img_man} style={style.HeaderProfile} />
                            </TouchableOpacity>
                        )
                    })}
                />
                <Stack.Screen
                    name="ASNScreen"
                    component={ASNScreen}
                    options={{
                        title: 'ASN',
                        headerStyle: {
                            backgroundColor: Colors.theme,
                        },
                        headerTintColor: Colors.white,
                        headerTitleStyle: {
                            fontWeight: '500',
                        },
                    }}
                />
                <Stack.Screen
                    name="ReceiptsScreen"
                    component={ReceiptsScreen}
                    options={({ navigation }) => ({
                        headerStyle: { backgroundColor: Colors.theme },
                        headerTintColor: Colors.white,
                        headerRight: () => (
                            <TouchableOpacity
                                style={{ marginRight: 15 }}
                                onPress={() => navigation.navigate('ProfileScreen')}
                            >
                                <Image source={Assets.img_man} style={style.HeaderProfile} />
                            </TouchableOpacity>
                        )
                    })}
                />
                <Stack.Screen
                    name="PutawayScreen"
                    component={PutawayScreen}
                    options={({ navigation }) => ({
                        headerStyle: { backgroundColor: Colors.theme },
                        headerTintColor: Colors.white,
                        headerRight: () => (
                            <TouchableOpacity
                                style={{ marginRight: 15 }}
                                onPress={() => navigation.navigate('ProfileScreen')}
                            >
                                <Image source={Assets.img_man} style={style.HeaderProfile} />
                            </TouchableOpacity>
                        )
                    })}
                />
                <Stack.Screen
                    name="SalesOrdersScreen"
                    component={SalesOrdersScreen}
                    options={{
                        title: 'Sales Orders',
                        headerStyle: {
                            backgroundColor: Colors.theme,
                        },
                        headerTintColor: Colors.white,
                        headerTitleStyle: {
                            fontWeight: '500',
                        },
                    }}
                />
                <Stack.Screen
                    name="PickingScreen"
                    component={PickingScreen}
                    options={({ navigation }) => ({
                        headerStyle: { backgroundColor: Colors.theme },
                        headerTintColor: Colors.white,
                        headerRight: () => (
                            <TouchableOpacity
                                style={{ marginRight: 15 }}
                                onPress={() => navigation.navigate('ProfileScreen')}
                            >
                                <Image source={Assets.img_man} style={style.HeaderProfile} />
                            </TouchableOpacity>
                        )
                    })}
                />
                <Stack.Screen
                    name="DeliveriesScreen"
                    component={DeliveriesScreen}
                    options={({ navigation }) => ({
                        headerStyle: { backgroundColor: Colors.theme },
                        headerTintColor: Colors.white,
                        headerRight: () => (
                            <TouchableOpacity
                                style={{ marginRight: 15 }}
                                onPress={() => navigation.navigate('ProfileScreen')}
                            >
                                <Image source={Assets.img_man} style={style.HeaderProfile} />
                            </TouchableOpacity>
                        )
                    })}
                />
                <Stack.Screen
                    name="InternalScreen"
                    component={InternalScreen}
                    options={{
                        title: 'Internal',
                        headerStyle: {
                            backgroundColor: Colors.theme,
                        },
                        headerTintColor: Colors.white,
                        headerTitleStyle: {
                            fontWeight: '500',
                        },
                    }}
                />
                <Stack.Screen
                    name="ProfileScreen"
                    component={ProfileScreen}
                    options={({ navigation }) => ({
                        headerStyle: {
                            backgroundColor: Colors.theme,
                        },
                        headerTintColor: Colors.white,
                        headerLeft: () => null,
                        headerTitle: () => (
                            <TouchableOpacity
                                style={{ marginRight: 15 }}
                                onPress={() => navigation.navigate('Home')}
                            >
                                <Image source={Assets.img_logo} style={style.logo} /> 
                            </TouchableOpacity>
                        ),
                        headerRight: () => (
                            <TouchableOpacity
                                style={{ marginRight: 15 }}
                                onPress={() => navigation.navigate('ProfileScreen')}
                            >
                                <Image source={Assets.img_man} style={style.HeaderProfile} />
                            </TouchableOpacity>
                        )
                    })}
                />
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={({ navigation }) => ({
                        headerStyle: { backgroundColor: Colors.theme },
                        headerTintColor: Colors.white,
                        headerLeft: () => null,
                        headerTitle: () => (
                            <TouchableOpacity
                                style={{ marginRight: 15 }}
                                onPress={() => navigation.navigate('Home')}
                            >
                                <Image source={Assets.img_logo} style={style.logo} /> 
                            </TouchableOpacity>
                        ),
                        headerRight: () => (
                            <TouchableOpacity
                                style={{ marginRight: 15 }}
                                onPress={() => navigation.navigate('ProfileScreen')}
                            >
                                <Image source={Assets.img_man} style={style.HeaderProfile} />
                            </TouchableOpacity>
                        )
                    })}
                />
                <Stack.Screen
                    name="Printlabel"
                    component={PackageDeliveryApp}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const style = StyleSheet.create({
    HeaderProfile: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.white
    },
    logo: {
        width: 110,
        height: 20,
    },
    HeaderTab: {
        fontWeight: '500',
        color: Colors.white,
        fontSize: 18,
        includeFontPadding: false,
        textAlignVertical: 'center',

    }
})
export default AllNavigator;