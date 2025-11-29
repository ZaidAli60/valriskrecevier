// import React, { useEffect, useState, useRef } from "react";
// import {
//     View,
//     StyleSheet,
//     Animated,
//     TouchableOpacity,
// } from "react-native";
// import MapLibreGL from "@maplibre/maplibre-react-native";
// import { Text } from "react-native-paper";
// import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// export default function GPSScreen() {
//     // 🔵 Dynamic location
//     const [location] = useState({
//         latitude: 31.428640593830114,
//         longitude: 73.11795937958168,
//     });
//     const [city, setCity] = useState("Loading...");
//     const [country, setCountry] = useState("Loading...");

//     const cameraRef = useRef(null);
//     const pulseAnim = useRef(new Animated.Value(1)).current;

//     // 🔥 Marker Pulse Animation
//     useEffect(() => {
//         Animated.loop(
//             Animated.sequence([
//                 Animated.timing(pulseAnim, {
//                     toValue: 1.5,
//                     duration: 1300,
//                     useNativeDriver: true,
//                 }),
//                 Animated.timing(pulseAnim, {
//                     toValue: 1,
//                     duration: 1300,
//                     useNativeDriver: true,
//                 }),
//             ])
//         ).start();
//     }, []);

//     // 🌍 Reverse Geocode → Get City + Country
//     const getLocationInfo = async (lat, lng) => {
//         try {
//             const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;

//             const res = await fetch(url, {
//                 headers: {
//                     "User-Agent": "ValRiskReceiver/1.0",
//                     "Accept-Language": "en",
//                 },
//             });

//             const data = await res.json();
//             const place = data.address;

//             setCity(
//                 place.city ||
//                 place.town ||
//                 place.village ||
//                 place.state ||
//                 "Unknown"
//             );
//             setCountry(place.country || "Unknown");
//         } catch (err) {
//             console.log("City Fetch Error:", err);
//             setCity("Unknown");
//             setCountry("Unknown");
//         }
//     };

//     useEffect(() => {
//         getLocationInfo(location.latitude, location.longitude);
//     }, []);

//     // 🔄 Recenter Camera
//     const recenter = () => {
//         cameraRef.current?.setCamera({
//             centerCoordinate: [location.longitude, location.latitude],
//             zoomLevel: 14,
//             animationDuration: 800,
//         });
//     };

//     return (
//         <View style={styles.container}>

//             {/* ⭐ PREMIUM STATUS CARD */}
//             <View style={styles.statusCard}>
//                 <Text style={styles.label}>Current Location</Text>

//                 <Text style={styles.cityText}>📍 {city}</Text>
//                 <Text style={styles.countryText}>🌎 {country}</Text>

//                 <Text style={styles.coords}>
//                     Lat: {location.latitude.toFixed(4)} | Lng: {location.longitude.toFixed(4)}
//                 </Text>
//             </View>

//             {/* ⭐ MAP VIEW */}
//             <MapLibreGL.MapView
//                 style={styles.map}
//                 styleURL="https://tiles.openfreemap.org/styles/liberty"
//                 compassEnabled={false}
//                 logoEnabled={false}
//             >
//                 <MapLibreGL.Camera
//                     ref={cameraRef}
//                     zoomLevel={14}
//                     centerCoordinate={[location.longitude, location.latitude]}
//                 />

//                 {/* 🔥 PULSE MARKER */}
//                 <MapLibreGL.PointAnnotation
//                     id="gps-marker"
//                     coordinate={[location.longitude, location.latitude]}
//                 >
//                     <Animated.View
//                         style={[
//                             styles.pulseCircle,
//                             { transform: [{ scale: pulseAnim }] },
//                         ]}
//                     />
//                     <View style={styles.centerDot} />
//                 </MapLibreGL.PointAnnotation>
//             </MapLibreGL.MapView>

//             {/* ⭐ RECENTER BUTTON */}
//             <TouchableOpacity style={styles.recenterBtn} onPress={recenter}>
//                 <Icon name="crosshairs-gps" size={26} color="white" />
//             </TouchableOpacity>

//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1 },
//     map: { flex: 1 },

//     /* ⭐ Status Card (No blur, no gradient) */
//     statusCard: {
//         padding: 15,
//         margin: 12,
//         borderRadius: 18,
//         backgroundColor: "rgba(0,0,0,0.50)",
//         borderWidth: 1,
//         borderColor: "rgba(255,255,255,0.06)",
//         position: "absolute",
//         top: 10,
//         left: 0,
//         right: 0,
//         zIndex: 20,
//     },

//     label: {
//         fontSize: 13,
//         color: "#C9D6E0",
//     },
//     cityText: {
//         fontSize: 24,
//         fontWeight: "700",
//         marginTop: 5,
//         color: "#00E5A8",
//     },
//     countryText: {
//         fontSize: 16,
//         marginTop: 6,
//         fontWeight: "600",
//         color: "#D7E2EB",
//     },
//     coords: {
//         fontSize: 12,
//         marginTop: 6,
//         color: "#AAB9C7",
//     },

//     /* ⭐ Floating City Overlay */
//     cityOverlay: {
//         position: "absolute",
//         top: 120,
//         alignSelf: "center",
//         backgroundColor: "rgba(0,0,0,0.45)",
//         paddingHorizontal: 16,
//         paddingVertical: 8,
//         borderRadius: 14,
//         zIndex: 20,
//     },
//     cityOverlayText: {
//         color: "white",
//         fontSize: 18,
//         fontWeight: "600",
//     },

//     /* ⭐ Marker */
//     pulseCircle: {
//         width: 40,
//         height: 40,
//         borderRadius: 20,
//         backgroundColor: "rgba(0, 229, 168, 0.25)",
//         position: "absolute",
//     },
//     centerDot: {
//         width: 16,
//         height: 16,
//         backgroundColor: "#00E5A8",
//         borderRadius: 10,
//         borderWidth: 2,
//         borderColor: "white",
//     },

//     /* ⭐ Recenter Button */
//     recenterBtn: {
//         position: "absolute",
//         bottom: 35,
//         right: 20,
//         backgroundColor: "#00E5A8",
//         width: 52,
//         height: 52,
//         borderRadius: 30,
//         justifyContent: "center",
//         alignItems: "center",
//         elevation: 6,
//     },
// });


import React, { useEffect, useState, useRef } from "react";
import {
    View,
    StyleSheet,
    Animated,
    TouchableOpacity,
} from "react-native";
import MapLibreGL from "@maplibre/maplibre-react-native";
import { Text } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import firestore from "@react-native-firebase/firestore";

export default function GPSScreen({ route }) {
    const { deviceId } = route.params; // <-- IMPORTANT from QR pairing

    const [location, setLocation] = useState(null);
    const [city, setCity] = useState("Loading...");
    const [country, setCountry] = useState("Loading...");

    const cameraRef = useRef(null);
    const pulseAnim = useRef(new Animated.Value(1)).current;

    // 🔥 Pulse Animation
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.5,
                    duration: 1300,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1300,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    // 🌍 Reverse Geocode → City + Country
    const getLocationInfo = async (lat, lng) => {
        try {
            const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
            const res = await fetch(url, {
                headers: {
                    "User-Agent": "ValRiskReceiver/1.0",
                    "Accept-Language": "en",
                },
            });

            const data = await res.json();
            const place = data.address;

            setCity(
                place.city ||
                place.town ||
                place.village ||
                place.state ||
                "Unknown"
            );
            setCountry(place.country || "Unknown");
        } catch (err) {
            setCity("Unknown");
            setCountry("Unknown");
        }
    };

    // ⭐ REAL-TIME GPS Listener
    useEffect(() => {
        if (!deviceId) return;

        const unsub = firestore()
            .collection("devices")
            .doc(deviceId)
            .collection("gps")
            .doc("live")
            .onSnapshot((doc) => {
                if (doc.exists) {
                    const gps = doc.data();
                    setLocation({
                        latitude: gps.lat,
                        longitude: gps.lng,
                    });

                    getLocationInfo(gps.lat, gps.lng);
                }
            });

        return () => unsub();
    }, [deviceId]);

    // 🔄 Recenter Camera
    const recenter = () => {
        if (!location) return;

        cameraRef.current?.setCamera({
            centerCoordinate: [location.longitude, location.latitude],
            zoomLevel: 14,
            animationDuration: 800,
        });
    };

    return (
        <View style={styles.container}>

            {/* ⭐ STATUS CARD */}
            <View style={styles.statusCard}>
                <Text style={styles.label}>Emitter Current Location</Text>

                <Text style={styles.cityText}>
                    📍 {city}
                </Text>

                <Text style={styles.countryText}>
                    🌎 {country}
                </Text>

                {location ? (
                    <Text style={styles.coords}>
                        Lat: {location.latitude.toFixed(4)} | Lng: {location.longitude.toFixed(4)}
                    </Text>
                ) : (
                    <Text style={styles.coords}>Waiting for GPS...</Text>
                )}
            </View>

            {/* ⭐ MAP VIEW */}
            <MapLibreGL.MapView
                style={styles.map}
                styleURL="https://tiles.openfreemap.org/styles/liberty"
                compassEnabled={false}
                logoEnabled={false}
            >
                {location && (
                    <>
                        <MapLibreGL.Camera
                            ref={cameraRef}
                            zoomLevel={14}
                            centerCoordinate={[location.longitude, location.latitude]}
                        />

                        <MapLibreGL.PointAnnotation
                            id="gps-marker"
                            coordinate={[location.longitude, location.latitude]}
                        >
                            <Animated.View
                                style={[
                                    styles.pulseCircle,
                                    { transform: [{ scale: pulseAnim }] },
                                ]}
                            />
                            <View style={styles.centerDot} />
                        </MapLibreGL.PointAnnotation>
                    </>
                )}
            </MapLibreGL.MapView>

            {/* ⭐ RECENTER BUTTON */}
            <TouchableOpacity style={styles.recenterBtn} onPress={recenter}>
                <Icon name="crosshairs-gps" size={26} color="white" />
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },

    statusCard: {
        padding: 15,
        margin: 12,
        borderRadius: 18,
        backgroundColor: "rgba(0,0,0,0.50)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.06)",
        position: "absolute",
        top: 10,
        left: 0,
        right: 0,
        zIndex: 20,
    },

    label: {
        fontSize: 13,
        color: "#C9D6E0",
    },
    cityText: {
        fontSize: 24,
        fontWeight: "700",
        marginTop: 5,
        color: "#00E5A8",
    },
    countryText: {
        fontSize: 16,
        marginTop: 6,
        fontWeight: "600",
        color: "#D7E2EB",
    },
    coords: {
        fontSize: 12,
        marginTop: 6,
        color: "#AAB9C7",
    },

    /* Marker */
    pulseCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(0, 229, 168, 0.25)",
        position: "absolute",
    },
    centerDot: {
        width: 16,
        height: 16,
        backgroundColor: "#00E5A8",
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "white",
    },

    recenterBtn: {
        position: "absolute",
        bottom: 35,
        right: 20,
        backgroundColor: "#00E5A8",
        width: 52,
        height: 52,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        elevation: 6,
    },
});

