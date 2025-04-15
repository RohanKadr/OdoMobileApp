import React, { useEffect } from "react";
import { Image, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

//Importing Navigators from React package
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

//Import Utils
import { Colors } from "../utils/Color";

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
import { Assets } from "../../assets/images/Assets";



const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

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

const TabNavigator = () => {
    return (
        <Tab.Navigator
            initialRouteName={'Home'}
            screenOptions={{
                tabBarActiveTintColor: Colors.white,
                tabBarStyle: {
                    position: 'absolute',
                    backgroundColor: Colors.theme,
                    elevation: 20,
                },
            }}>
            <Tab.Screen
                name={'Home'}
                component={HomeScreen}
                options={({ }) => ({
                    tabBarLabel: 'Home',
                    tabBarLabelStyle: {
                        fontSize: 12,
                    },
                    tabBarHideOnKeyboard: true,
                    tabBarIcon: ({ color, size }) => {
                        return <Icon name={'home'} size={size} color={color} />;
                    },
                    headerStyle: { backgroundColor: Colors.theme },
                    headerTintColor: Colors.white,
                    headerTitleStyle: {
                        fontWeight: 'normal', //Set Header text style
                    },
                })}
            />
            <Tab.Screen
                name={'Profile'}
                component={ProfileScreen}
                options={({ }) => ({
                    tabBarLabel: 'Profile',
                    tabBarLabelStyle: {
                        fontSize: 12,
                    },
                    tabBarHideOnKeyboard: true,
                    tabBarIcon: ({ color, size }) => {
                        return <Icon name={'account'} size={size} color={color} />;
                    },
                    headerStyle: { backgroundColor: Colors.theme },
                    headerTintColor: Colors.white,
                    headerTitleStyle: {
                        fontWeight: 'normal', //Set Header text style
                    },
                })}
            />
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
                    options={{
                        title: 'Scan', //Set Header Title
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
                    options={{
                        title: 'Receipts',
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
                    name="PutawayScreen"
                    component={PutawayScreen}
                    options={{
                        title: 'Putaway',
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
                    options={{
                        title: 'Picking',
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
                    name="DeliveriesScreen"
                    component={DeliveriesScreen}
                    options={{
                        title: 'Deliveries',
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
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AllNavigator;
