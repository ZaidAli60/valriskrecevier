import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, useTheme } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

export default function HomeScreen({ navigation }) {
    const { colors } = useTheme();

        useEffect(() => {
        const checkPairStatus = async () => {
            try {
                const receiverId = auth().currentUser?.uid;

                if (!receiverId) return;

                console.log("🔍 Checking if Receiver is already paired...");

                const devicesSnap = await firestore()
                    .collection("devices")
                    .get();

                for (const doc of devicesSnap.docs) {
                    const statusRef = doc.ref
                        .collection("pairStatus")
                        .doc("status");

                    const snap = await statusRef.get();

                    if (snap.exists && snap.data()?.receiverId === receiverId) {
                        const deviceId = doc.id;

                        console.log("✅ Receiver already paired with device:", deviceId);

                        navigation.replace("dashboard", { deviceId });
                        return;
                    }
                }

                console.log("❌ No pairing found. Show normal home.");

            } catch (e) {
                console.log("Pair Check Error:", e);
            }
        };

        checkPairStatus();
    }, []);

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
