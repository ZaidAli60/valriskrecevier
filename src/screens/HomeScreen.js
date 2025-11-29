import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Button, useTheme } from "react-native-paper";

import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

export default function HomeScreen({ navigation }) {
    const { colors } = useTheme();

    const [checking, setChecking] = useState(true);
    const [isPaired, setIsPaired] = useState(false);
    const [pairedDevice, setPairedDevice] = useState(null);

    useEffect(() => {
        checkIfReceiverAlreadyPaired();
    }, []);

    // CHECK IF THIS RECEIVER IS ALREADY PAIRED
    const checkIfReceiverAlreadyPaired = async () => {
        try {
            // Ensure receiver login
            if (!auth().currentUser) {
                await auth().signInAnonymously();
            }

            const receiverId = auth().currentUser.uid;
            console.log("Receiver ID:", receiverId);

            console.log("🔍 Checking if Receiver is already paired...");

            const devicesSnap = await firestore()
                .collection("devices")
                .get();

            let found = null;

            devicesSnap.forEach((doc) => {
                const data = doc.data();
                if (data?.receiverId === receiverId) {
                    found = doc.id; // deviceId
                }
            });

            if (found) {
                console.log("✅ Already paired with Device:", found);
                setIsPaired(true);
                setPairedDevice(found);

                // Auto navigate after short delay
                setTimeout(() => {
                    navigation.replace("MainTabs", { deviceId: found });
                }, 500);
            } else {
                console.log("❌ No pairing found. Showing home screen.");
                setIsPaired(false);
            }
        } catch (err) {
            console.log("Receiver pairing check error:", err);
        }

        setChecking(false);
    };

    if (checking) {
        return (
            <View style={[styles.container, { backgroundColor: colors.secondary }]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{ color: "white", marginTop: 10 }}>Checking pairing...</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.secondary }]}>
            <Text style={[styles.title, { color: colors.primary }]}>
                ValRisk Receiver
            </Text>

            <Button
                mode="contained"
                onPress={() => navigation.navigate("QRScan")}
                contentStyle={styles.btnContent}
                labelStyle={[styles.btnLabel, { color: colors.surface }]}
                style={[
                    styles.button,
                    { backgroundColor: colors.primary, borderRadius: 12 },
                ]}
            >
                Scan QR Code
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 50,
        textAlign: "center",
    },

    button: {
        width: "70%",
        elevation: 4,
    },

    btnContent: {
        paddingVertical: 10,
    },

    btnLabel: {
        fontSize: 18,
        fontWeight: "700",
    },
});
