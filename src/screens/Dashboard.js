// import React, { useEffect, useState } from "react";
// import { View, StyleSheet } from "react-native";
// import { Text, Button, Card, IconButton, useTheme } from "react-native-paper";
// import firestore from "@react-native-firebase/firestore";

// export default function DashboardScreen({ route }) {
//     const theme = useTheme();
//     const { deviceId } = route.params;

//     const [status, setStatus] = useState("Checking...");

//     // 🔥 Listen for status from emitter
//     useEffect(() => {
//         const unsub = firestore()
//             .collection("status")
//             .doc(deviceId)
//             .onSnapshot((doc) => {
//                 if (!doc.exists) {
//                     console.log("⚠️ No status document yet");
//                     setStatus("Idle");
//                     return;
//                 }

//                 const data = doc.data();

//                 // Prevent crashes if data is undefined
// if (!data || data.recording === undefined) {
//     setStatus("Idle");
//     return;
// }

//                 setStatus(data.recording ? "Recording" : "Idle");
//             });

//         return () => unsub();
//     }, [deviceId]);

//     // 🔥 Send remote command to emitter
//     const sendCommand = async (cmd) => {
//         try {
//             await firestore()
//                 .collection("control")
//                 .doc(deviceId)
//                 .set({
//                     command: cmd,
//                     time: Date.now(),
//                 });

//             console.log("📡 Command Sent →", cmd);
//         } catch (err) {
//             console.log("❌ Command Error:", err);
//         }
//     };

//     return (
//         <View style={[styles.container, { backgroundColor: theme.colors.secondary }]}>

//             {/* HEADER */}
//             <View style={{ alignItems: "center", marginBottom: 30 }}>
//                 <IconButton icon="remote" size={48} iconColor={theme.colors.primary} />
//                 <Text style={styles.title}>Remote Control</Text>
//                 <Text style={styles.deviceId}>Device ID: {deviceId}</Text>
//             </View>

//             {/* STATUS CARD */}
//             <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
//                 <Card.Content>
//                     <Text style={styles.label}>Current Status</Text>
//                     <Text style={[styles.value, { color: theme.colors.primary }]}>
//                         {status}
//                     </Text>
//                 </Card.Content>
//             </Card>

//             {/* CONTROL BUTTONS */}
//             <View style={styles.buttons}>
//                 <Button
//                     mode="contained"
//                     onPress={() => sendCommand("START_RECORD")}
//                     icon="record-circle"
//                     style={[styles.btn, { backgroundColor: "#FF5252" }]}
//                 >
//                     Start Recording
//                 </Button>

//                 <Button
//                     mode="contained"
//                     onPress={() => sendCommand("STOP_RECORD")}
//                     icon="stop-circle"
//                     style={[styles.btn, { backgroundColor: theme.colors.danger }]}
//                 >
//                     Stop Recording
//                 </Button>

//             </View>

//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, paddingHorizontal: 25, paddingTop: 40 },

//     title: { fontSize: 26, fontWeight: "700", color: "white", marginTop: 5 },
//     deviceId: { fontSize: 14, color: "#8FA3B0", marginTop: 5 },

//     card: {
//         paddingVertical: 22,
//         borderRadius: 16,
//         marginBottom: 30,
//     },

//     label: { color: "#8FA3B0", fontSize: 14 },
//     value: { fontSize: 22, fontWeight: "700", marginTop: 6 },

//     buttons: { gap: 14 },

//     btn: {
//         paddingVertical: 10,
//         borderRadius: 12,
//     },
// });

import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button, Card, IconButton, useTheme } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";

export default function DashboardScreen({ route }) {
    const theme = useTheme();
    const { deviceId } = route.params;

    const [status, setStatus] = useState("Checking...");
    const [cameraSide, setCameraSide] = useState("back");

    useEffect(() => {
        const unsub = firestore()
            .collection("status")
            .doc(deviceId)
            .onSnapshot((doc) => {
                if (!doc.exists()) {
                    setStatus("Idle");
                    return;
                }

                const data = doc.data();
                if (!data || data.recording === undefined) {
                    setStatus("Idle");
                    return;
                }
                setStatus(data?.recording ? "Recording" : "Idle");
            });

        return () => unsub();
    }, [deviceId]);

    const sendCommand = async (cmd) => {
        try {
            await firestore()
                .collection("control")
                .doc(deviceId)
                .set({
                    command: cmd,
                    time: Date.now(),
                });

            console.log("📡 Command Sent →", cmd);
        } catch (err) {
            console.log("❌ Command Error:", err);
        }
    };

    const toggleCameraUI = () => {
        setCameraSide((prev) => (prev === "front" ? "back" : "front"));
        sendCommand("TOGGLE_CAMERA");
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.secondary }]}>

            {/* HEADER */}
            <View style={styles.headerBox}>
                <IconButton
                    icon="remote"
                    size={50}
                    iconColor={theme.colors.primary}
                    style={styles.headerIcon}
                />
                <Text style={styles.title}>ValRisk Remote Control</Text>
                <Text style={styles.subtitle}>Paired Device: {deviceId}</Text>
            </View>

            {/* STATUS CARD */}
            <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
                <Card.Content>
                    <Text style={styles.label}>Recording Status</Text>
                    <Text style={[styles.value, { color: theme.colors.primary }]}>
                        {status}
                    </Text>

                    <Text style={[styles.label, { marginTop: 15 }]}>Camera Side</Text>
                    <Text style={[styles.value, { color: theme.colors.accent }]}>
                        {cameraSide.toUpperCase()}
                    </Text>
                </Card.Content>
            </Card>

            {/* CONTROL PANEL */}
            <View style={styles.controlPanel}>

                {/* Row 1 */}
                <View style={styles.row}>
                    <Button
                        mode="contained"
                        onPress={() => sendCommand("START_RECORD")}
                        icon="record-circle"
                        style={[styles.controlBtn, { backgroundColor: "#FF3B30" }]}
                        labelStyle={styles.controlLabel}
                    >
                        Start
                    </Button>

                    <Button
                        mode="contained"
                        onPress={() => sendCommand("STOP_RECORD")}
                        icon="stop-circle"
                        style={[styles.controlBtn, { backgroundColor: theme.colors.danger }]}
                        labelStyle={styles.controlLabel}
                    >
                        Stop
                    </Button>
                </View>

                {/* Row 2 */}
                <View style={styles.row}>
                    <Button
                        mode="contained"
                        onPress={() => sendCommand("PAUSE_RECORD")}
                        icon="pause-circle"
                        style={[styles.controlBtn, { backgroundColor: theme.colors.accent }]}
                        labelStyle={styles.controlLabel}
                    >
                        Pause
                    </Button>

                    <Button
                        mode="contained"
                        onPress={() => sendCommand("SNAPSHOT")}
                        icon="camera"
                        style={[styles.controlBtn, { backgroundColor: theme.colors.primary }]}
                        labelStyle={styles.controlLabel}
                    >
                        Snapshot
                    </Button>
                </View>

                {/* Row 3 - Center button */}
                <View style={styles.rowCenter}>
                    <Button
                        mode="contained"
                        onPress={toggleCameraUI}
                        icon="camera-switch"
                        style={[styles.controlBtn, { backgroundColor: "#0096FF", width: "60%" }]}
                        labelStyle={styles.controlLabel}
                    >
                        Toggle Camera
                    </Button>
                </View>

            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 25, paddingTop: 40 },

    headerBox: { alignItems: "center", marginBottom: 28 },
    headerIcon: {
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: 50,
        padding: 8,
    },
    title: {
        fontSize: 26,
        fontWeight: "700",
        color: "white",
        marginTop: 8,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 14,
        color: "#8FA3B0",
        marginTop: 4,
        textAlign: "center",
    },

    card: {
        paddingVertical: 25,
        borderRadius: 18,
        marginBottom: 28,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.06)",
    },

    label: { color: "#8FA3B0", fontSize: 14 },
    value: { fontSize: 22, fontWeight: "bold", marginTop: 4 },

    controlPanel: {
        gap: 16,
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
    },

    rowCenter: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 6,
    },

    controlBtn: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 14,
        elevation: 3,
    },

    controlLabel: {
        fontSize: 16,
        fontWeight: "700",
    },
});
