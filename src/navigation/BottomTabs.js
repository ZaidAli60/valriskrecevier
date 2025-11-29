import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "react-native-paper";

// Screens
import DashboardScreen from "../screens/Dashboard";
import ClipsScreen from "../screens/ClipsScreen";
import GPSScreen from "../screens/GPSScreen";

const Tab = createBottomTabNavigator();

export default function MainTabs({ route }) {
    const theme = useTheme();

    // deviceId jo HomeScreen ya QRScan se aya hai
    const { deviceId } = route.params;


    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: theme.colors.secondary,
                    borderTopColor: "#0D1624",
                    height: 62,
                    paddingBottom: 8,
                },
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: "#8FA3B0",

                tabBarIcon: ({ color }) => {
                    let iconName = "home";

                    if (route.name === "Dashboard")
                        iconName = "remote-desktop";
                    if (route.name === "Clips")
                        iconName = "filmstrip";
                    if (route.name === "GPS")
                        iconName = "map-marker-radius";

                    return <Icon name={iconName} size={26} color={color} />;
                },
            })}
        >
            <Tab.Screen
                name="Dashboard"
                component={DashboardScreen}
                initialParams={{ deviceId }}
            />

            <Tab.Screen
                name="Clips"
                component={ClipsScreen}
                initialParams={{ deviceId }}
            />

            <Tab.Screen
                name="GPS"
                component={GPSScreen}
                initialParams={{ deviceId }}
            />
        </Tab.Navigator>
    );
}
