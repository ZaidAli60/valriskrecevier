import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import QRScanScreen from '../screens/QRScanScreen';
// import DashboardScreen from '../screens/Dashboard';
import BottomTabs from './BottomTabs';

const Stack = createStackNavigator();

export default function AppNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="QRScan" component={QRScanScreen} /> */}

            {/* If paired → open Bottom Tabs */}
            <Stack.Screen name="MainTabs" component={BottomTabs} />
        </Stack.Navigator>
    );
}
