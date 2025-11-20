import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Camera } from "react-native-camera-kit";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useTheme } from "react-native-paper";

import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

export default function QRScanScreen({ navigation }) {
  const { colors } = useTheme();
  const [scanned, setScanned] = useState(false);
  const scanAnim = useRef(new Animated.Value(0)).current;

  // 🔥 ANIMATED SCAN LINE
  useEffect(() => {
    Animated.loop(
      Animated.timing(scanAnim, {
        toValue: 1,
        duration: 1600,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 250],
  });

  // 🔥 SAFE LOGIN (Receiver must be authenticated)
  useEffect(() => {
    ensureReceiverAuth();
  }, []);

  const ensureReceiverAuth = async () => {
    try {
      if (auth().currentUser) return; // Already logged in

      const res = await auth().signInAnonymously();
      console.log("Receiver Auth UID:", res.user.uid);
    } catch (e) {
      console.log("Receiver Auth Error:", e);
    }
  };

  // 🔥 QR READ HANDLER WITH FIREBASE OTP VALIDATION
  const handleQR = async (event) => {
    if (scanned) return;
    setScanned(true);

    try {
      const raw = event.nativeEvent.codeStringValue;
      const parsed = JSON.parse(raw);

      const { deviceId, otp } = parsed;

      if (!deviceId || !otp) {
        throw new Error("Incomplete QR data.");
      }

      console.log("🔍 Scanned → Device:", deviceId, "OTP:", otp);

      // 1️⃣ Validate OTP in Firestore
      const otpRef = firestore()
        .collection("devices")
        .doc(deviceId)
        .collection("otp")
        .doc(otp);

      const otpSnap = await otpRef.get();

      if (!otpSnap.exists) {
        Alert.alert("Invalid or Expired QR", "The OTP does not exist.");
        setScanned(false);
        return;
      }

      const data = otpSnap.data();

      // Check expiration
      if (Date.now() > data.exp) {
        Alert.alert("Expired OTP", "Please generate a new QR code.");
        otpRef.delete();
        setScanned(false);
        return;
      }

      // 2️⃣ OTP VALID — DELETE IT
      await otpRef.delete();

      // 3️⃣ Save pairing info
      // await firestore()
      //   .collection("pairs")
      //   .doc(deviceId)
      //   .set({
      //     receiverId: auth().currentUser?.uid || "receiver_device",
      //     pairedAt: Date.now(),
      //   });

      await firestore()
        .collection("devices")
        .doc(deviceId)
        .collection("pairStatus")
        .doc("status")
        .set({
          paired: true,
          receiverId: auth().currentUser?.uid || "receiver_device",
          pairedAt: Date.now(),
        });


      console.log("🔗 Pairing saved.");

      // 4️⃣ Navigate to dashboard with device ID
      navigation.replace("dashboard", { deviceId });

    } catch (err) {
      console.log("QR ERROR:", err);
      Alert.alert("QR Error", "Unable to process QR code.");
      setScanned(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.secondary }]}>

      {/* Dim Background */}
      <View style={styles.dim} />

      {/* BACK BUTTON */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>

      {/* CENTER scanner */}
      <View style={styles.centerWrapper}>
        <View style={styles.scannerBox}>

          {/* Camera inside box */}
          <Camera
            style={styles.camera}
            scanBarcode={true}
            onReadCode={handleQR}
          />

          {/* Neon Corners */}
          <View style={[styles.cornerTL, { borderColor: colors.primary }]} />
          <View style={[styles.cornerTR, { borderColor: colors.primary }]} />
          <View style={[styles.cornerBL, { borderColor: colors.primary }]} />
          <View style={[styles.cornerBR, { borderColor: colors.primary }]} />

          {/* Laser Scan Line */}
          <Animated.View
            style={[
              styles.scanLine,
              { backgroundColor: colors.primary, transform: [{ translateY }] },
            ]}
          />
        </View>
      </View>

      {/* Bottom Text */}
      <Text style={[styles.infoText, { color: colors.text }]}>
        Place QR Code Inside the Frame
      </Text>

    </View>
  );
}


const BOX = 260;

// Same styles as before
const styles = StyleSheet.create({
  container: { flex: 1 },
  dim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.70)",
  },
  backBtn: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 5,
    zIndex: 100,
  },
  centerWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scannerBox: {
    width: BOX,
    height: BOX,
    overflow: "hidden",
    borderRadius: 20,
    position: "relative",
  },
  camera: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  scanLine: {
    position: "absolute",
    width: "100%",
    height: 3,
    opacity: 0.9,
  },
  cornerTL: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 40,
    height: 40,
    borderLeftWidth: 4,
    borderTopWidth: 4,
    borderRadius: 8,
  },
  cornerTR: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderRadius: 8,
  },
  cornerBL: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 40,
    height: 40,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderRadius: 8,
  },
  cornerBR: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderRadius: 8,
  },
  infoText: {
    position: "absolute",
    bottom: 70,
    width: "100%",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    opacity: 0.9,
  },
});
