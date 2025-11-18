import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, useTheme } from "react-native-paper";

export default function HomeScreen({ navigation }) {
    const { colors } = useTheme();

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
