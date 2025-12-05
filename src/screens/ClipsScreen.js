// import React, { useState, useEffect } from "react";
// import {
//     View,
//     Text,
//     StyleSheet,
//     ScrollView,
//     Image,
//     Modal,
//     TouchableOpacity,
// } from "react-native";
// import { Card, Button, useTheme } from "react-native-paper";
// import RNFS from "react-native-fs";
// import Video from "react-native-video";
// import firestore from "@react-native-firebase/firestore";
// import Toast from "react-native-toast-message";

// export default function ClipsScreen({ route }) {
//     const theme = useTheme();
//     const { deviceId } = route.params; // <-- IMPORTANT

//     const [clips, setClips] = useState([]);
//     const [loading, setLoading] = useState(true);

//     const [videoUrl, setVideoUrl] = useState(null);
//     const [videoVisible, setVideoVisible] = useState(false);

//     const [downloading, setDownloading] = useState(false);
//     const [downloadProgress, setDownloadProgress] = useState(0);
//     console.log("clips Real time update", clips)
//     // Pakistan time format
//     const formatPKT = (timestamp) => {
//         return new Intl.DateTimeFormat("en-PK", {
//             timeZone: "Asia/Karachi",
//             year: "numeric",
//             month: "2-digit",
//             day: "2-digit",
//             hour: "2-digit",
//             minute: "2-digit",
//             second: "2-digit",
//             hour12: true,
//         }).format(new Date(timestamp));
//     };

//     // Load clips
//     useEffect(() => {
//         if (!deviceId) return;

//         const unsubscribe = firestore()
//             .collection("clips")
//             .where("deviceId", "==", deviceId)
//             .orderBy("createdAt", "desc")
//             .onSnapshot((snap) => {
//                 const list = snap.docs.map((doc) => ({
//                     id: doc.id,
//                     ...doc.data(),
//                 }));
//                 setClips(list);
//                 setLoading(false);
//             });

//         return () => unsubscribe();
//     }, [deviceId]);

//     const playVideo = (url) => {
//         setVideoUrl(url);
//         setVideoVisible(true);
//     };

//     // Download video
//     const downloadVideo = async (url) => {
//         try {
//             const fileName = `clip_${Date.now()}.mp4`;
//             const path = `${RNFS.DownloadDirectoryPath}/${fileName}`;

//             setDownloading(true);
//             setDownloadProgress(0);

//             const download = RNFS.downloadFile({
//                 fromUrl: url,
//                 toFile: path,
//                 background: true,
//                 progressDivider: 1,
//                 progress: (data) => {
//                     const percent = Math.floor(
//                         (data.bytesWritten / data.contentLength) * 100
//                     );
//                     setDownloadProgress(percent);
//                 },
//             });

//             await download.promise;
//             setDownloading(false);

//             Toast.show({
//                 type: "success",
//                 text1: "Download Complete",
//                 text2: `Saved to Downloads/${fileName}`,
//             });
//         } catch (err) {
//             console.log("❌ Download error:", err);
//             setDownloading(false);
//         }
//     };

//     return (
//         <View style={[styles.container, { backgroundColor: theme.colors.secondary }]}>
//             {/* Header */}
//             <View style={styles.header}>
//                 <Text style={styles.heading}>Saved Clips</Text>
//             </View>

//             {loading && (
//                 <Text style={{ color: "#8FA3B0", margin: 20 }}>Loading clips…</Text>
//             )}

//             <ScrollView style={styles.scrollArea}>
//                 {!loading && clips.length === 0 && (
//                     <Text style={{ color: "#8FA3B0", textAlign: "center", marginTop: 20 }}>
//                         No clips found.
//                     </Text>
//                 )}

//                 {clips.map((item) => (
//                     <Card key={item.id} style={styles.card}>
//                         <View style={styles.row}>
//                             <Image
//                                 source={{
//                                     uri:
//                                         item.thumbnail ||
//                                         "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrkPyqzSTU_5JJeKFYznFnKQpbgRzjTu0zoA&s",
//                                 }}
//                                 style={styles.thumbnail}
//                             />

//                             <View style={styles.details}>
//                                 <Text style={styles.title}>{item.title}</Text>
//                                 <Text style={styles.subtitle}>{formatPKT(item.createdAt)}</Text>
//                             </View>
//                         </View>

//                         <View style={styles.actions}>
//                             <Button
//                                 mode="contained"
//                                 onPress={() => playVideo(item.url)}
//                                 style={styles.btn}
//                             >
//                                 View
//                             </Button>

//                             <Button
//                                 mode="outlined"
//                                 onPress={() => downloadVideo(item.url)}
//                                 style={styles.btnOutline}
//                             >
//                                 Download
//                             </Button>
//                         </View>
//                     </Card>
//                 ))}
//             </ScrollView>

//             {/* Video Modal */}
//             <Modal visible={videoVisible} animationType="slide">
//                 <View style={styles.videoContainer}>
//                     <TouchableOpacity
//                         style={styles.closeBtn}
//                         onPress={() => setVideoVisible(false)}
//                     >
//                         <Text style={{ color: "#fff", fontSize: 18 }}>✖ Close</Text>
//                     </TouchableOpacity>

//                     <Video
//                         source={{ uri: videoUrl }}
//                         style={styles.videoPlayer}
//                         controls
//                         resizeMode="contain"
//                     />
//                 </View>
//             </Modal>

//             {/* Download progress */}
//             <Modal visible={downloading} transparent animationType="fade">
//                 <View style={styles.downloadModal}>
//                     <View style={styles.downloadBox}>
//                         <Text style={styles.downloadTitle}>Downloading…</Text>

//                         <View style={styles.progressBarBackground}>
//                             <View
//                                 style={[
//                                     styles.progressBarFill,
//                                     { width: `${downloadProgress}%` },
//                                 ]}
//                             />
//                         </View>

//                         <Text style={styles.progressText}>{downloadProgress}%</Text>
//                     </View>
//                 </View>
//             </Modal>

//             <Toast />
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1 },

//     header: {
//         height: 60,
//         paddingHorizontal: 22,
//         backgroundColor: "#0D1623",
//         borderBottomWidth: 1,
//         borderBottomColor: "#1F2A38",
//         justifyContent: "flex-end",
//         paddingBottom: 15,
//     },

//     heading: {
//         fontSize: 24,
//         color: "#fff",
//         fontWeight: "700",
//     },

//     scrollArea: { padding: 15 },

//     card: {
//         backgroundColor: "#1C1F25",
//         borderRadius: 16,
//         padding: 12,
//         marginBottom: 12,
//     },

//     row: { flexDirection: "row" },

//     thumbnail: { width: 100, height: 70, borderRadius: 10 },

//     details: { marginLeft: 12, flex: 1 },

//     title: { color: "white", fontSize: 15, fontWeight: "700" },

//     subtitle: { color: "#8FA3B0", marginTop: 3, fontSize: 12 },

//     actions: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         marginTop: 12,
//     },

//     btn: { flex: 1, marginRight: 6, borderRadius: 10 },

//     btnOutline: {
//         flex: 1,
//         marginLeft: 6,
//         borderRadius: 10,
//         borderWidth: 1.5,
//         borderColor: "#00E5A8",
//     },

//     videoContainer: {
//         flex: 1,
//         backgroundColor: "#000",
//         justifyContent: "center",
//         alignItems: "center",
//     },

//     videoPlayer: {
//         width: "100%",
//         height: "80%",
//     },

//     closeBtn: {
//         position: "absolute",
//         top: 20,
//         right: 20,
//         zIndex: 20,
//     },

//     downloadModal: {
//         flex: 1,
//         backgroundColor: "rgba(0,0,0,0.6)",
//         justifyContent: "center",
//         alignItems: "center",
//     },

//     downloadBox: {
//         width: "75%",
//         backgroundColor: "#1C1F25",
//         padding: 20,
//         borderRadius: 16,
//         alignItems: "center",
//     },

//     downloadTitle: {
//         color: "white",
//         fontSize: 18,
//         marginBottom: 15,
//         fontWeight: "600",
//     },

//     progressBarBackground: {
//         backgroundColor: "#2E3A4A",
//         width: "100%",
//         height: 12,
//         borderRadius: 8,
//         overflow: "hidden",
//     },

//     progressBarFill: {
//         height: "100%",
//         backgroundColor: "#00E5A8",
//     },

//     progressText: {
//         marginTop: 10,
//         color: "#fff",
//         fontSize: 14,
//         fontWeight: "600",
//     },
// });



import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Modal,
    TouchableOpacity,
} from "react-native";
import { Card, Button, useTheme } from "react-native-paper";
import RNFS from "react-native-fs";
import Video from "react-native-video";
import firestore from "@react-native-firebase/firestore";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function ClipsScreen({ route }) {
    const theme = useTheme();
    const { deviceId } = route.params;

    const [clips, setClips] = useState([]);
    const [loading, setLoading] = useState(true);

    const [videoUrl, setVideoUrl] = useState(null);
    const [videoVisible, setVideoVisible] = useState(false);

    const [downloading, setDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);

    // Delete states
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    console.log("Clips ==>", clips)
    const formatPKT = (timestamp) => {
        return new Intl.DateTimeFormat("en-PK", {
            timeZone: "Asia/Karachi",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        }).format(new Date(timestamp));
    };

    // Load Clips (Firestore realtime)
    useEffect(() => {
        if (!deviceId) return;

        const unsubscribe = firestore()
            .collection("clips")
            .where("deviceId", "==", deviceId)
            .orderBy("createdAt", "desc")
            .onSnapshot((snap) => {
                const list = snap.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setClips(list);
                setLoading(false);
            });

        return () => unsubscribe();
    }, [deviceId]);

    const playVideo = (url) => {
        setVideoUrl(url);
        setVideoVisible(true);
    };

    const confirmDelete = (id) => {
        setDeleteId(id);
        setConfirmVisible(true);
    };

    const deleteClip = async () => {
        try {
            await firestore().collection("clips").doc(deleteId).delete();

            Toast.show({
                type: "success",
                text1: "Clip Deleted",
                text2: "The clip has been removed.",
            });

            setConfirmVisible(false);
            setDeleteId(null);
        } catch (error) {
            console.log("❌ Delete Error:", error);
            Toast.show({
                type: "error",
                text1: "Delete Failed",
            });
        }
    };

    const downloadVideo = async (url) => {
        try {
            const fileName = `clip_${Date.now()}.mp4`;
            const path = `${RNFS.DownloadDirectoryPath}/${fileName}`;

            setDownloading(true);
            setDownloadProgress(0);

            const download = RNFS.downloadFile({
                fromUrl: url,
                toFile: path,
                background: true,
                progressDivider: 1,
                progress: (data) => {
                    const percent = Math.floor(
                        (data.bytesWritten / data.contentLength) * 100
                    );
                    setDownloadProgress(percent);
                },
            });

            await download.promise;
            setDownloading(false);

            Toast.show({
                type: "success",
                text1: "Download Complete",
                text2: `Saved to Downloads/${fileName}`,
            });
        } catch (err) {
            console.log("❌ Download error:", err);
            setDownloading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.secondary }]}>
            <View style={styles.header}>
                <Text style={styles.heading}>Saved Clips</Text>
            </View>

            {loading && (
                <Text style={{ color: "#8FA3B0", margin: 20 }}>Loading clips…</Text>
            )}

            <ScrollView style={styles.scrollArea}>
                {!loading && clips.length === 0 && (
                    <Text style={{ color: "#8FA3B0", textAlign: "center", marginTop: 20 }}>
                        No clips found.
                    </Text>
                )}

                {clips.map((item) => (
                    <Card key={item.id} style={styles.card}>

                        {/* Row with Thumbnail + Details + Delete Icon */}
                        <View style={styles.row}>
                            <Image
                                source={{
                                    uri:
                                        item.thumbnail ||
                                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrkPyqzSTU_5JJeKFYznFnKQpbgRzjTu0zoA&s",
                                }}
                                style={styles.thumbnail}
                            />

                            <View style={styles.details}>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.subtitle}>{formatPKT(item.createdAt)}</Text>
                            </View>

                            {/* DELETE ICON */}
                            <TouchableOpacity
                                style={styles.deleteIconBtn}
                                onPress={() => confirmDelete(item.id)}
                            >
                                <Icon name="trash-can-outline" size={26} color="#FF4F4F" />

                            </TouchableOpacity>
                        </View>

                        {/* Bottom Buttons */}
                        <View style={styles.actions}>
                            <Button
                                mode="contained"
                                onPress={() => playVideo(item.url)}
                                style={styles.btn}
                            >
                                View
                            </Button>

                            <Button
                                mode="outlined"
                                onPress={() => downloadVideo(item.url)}
                                style={styles.btnOutline}
                            >
                                Download
                            </Button>
                        </View>
                    </Card>
                ))}
            </ScrollView>

            {/* Video Modal */}
            <Modal visible={videoVisible} animationType="slide">
                <View style={styles.videoContainer}>
                    <TouchableOpacity
                        style={styles.closeBtn}
                        onPress={() => setVideoVisible(false)}
                    >
                        <Text style={{ color: "#fff", fontSize: 18 }}>✖ Close</Text>
                    </TouchableOpacity>

                    <Video
                        source={{ uri: videoUrl }}
                        style={styles.videoPlayer}
                        controls
                        resizeMode="contain"
                    />
                </View>
            </Modal>

            {/* Download Progress Modal */}
            <Modal visible={downloading} transparent animationType="fade">
                <View style={styles.downloadModal}>
                    <View style={styles.downloadBox}>
                        <Text style={styles.downloadTitle}>Downloading…</Text>

                        <View style={styles.progressBarBackground}>
                            <View
                                style={[styles.progressBarFill, { width: `${downloadProgress}%` }]}
                            />
                        </View>

                        <Text style={styles.progressText}>{downloadProgress}%</Text>
                    </View>
                </View>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal visible={confirmVisible} transparent animationType="fade">
                <View style={styles.confirmOverlay}>
                    <View style={styles.confirmBox}>
                        <Text style={styles.confirmTitle}>Delete Clip?</Text>
                        <Text style={styles.confirmMsg}>Are you sure you want to delete this recording?</Text>

                        <View style={styles.confirmActions}>
                            <TouchableOpacity
                                style={styles.cancelBtn}
                                onPress={() => setConfirmVisible(false)}
                            >
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.deleteBtn} onPress={deleteClip}>
                                <Text style={styles.deleteText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Toast />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },

    header: {
        height: 60,
        paddingHorizontal: 22,
        backgroundColor: "#0D1623",
        borderBottomWidth: 1,
        borderBottomColor: "#1F2A38",
        justifyContent: "flex-end",
        paddingBottom: 15,
    },

    heading: {
        fontSize: 24,
        color: "#fff",
        fontWeight: "700",
    },

    scrollArea: { padding: 15 },

    card: {
        backgroundColor: "#1C1F25",
        borderRadius: 16,
        padding: 12,
        marginBottom: 12,
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
    },

    thumbnail: {
        width: 100,
        height: 70,
        borderRadius: 10,
    },

    details: {
        marginLeft: 12,
        flex: 1,
    },

    title: {
        color: "white",
        fontSize: 15,
        fontWeight: "700",
    },

    subtitle: {
        color: "#8FA3B0",
        marginTop: 3,
        fontSize: 12,
    },

    deleteIconBtn: {
        padding: 6,
        marginLeft: 8,
    },

    deleteIcon: {
        fontSize: 22,
        color: "#FF4F4F",
    },

    actions: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 12,
    },

    btn: {
        flex: 1,
        marginRight: 6,
        borderRadius: 10,
    },

    btnOutline: {
        flex: 1,
        marginLeft: 6,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: "#00E5A8",
    },

    videoContainer: {
        flex: 1,
        backgroundColor: "#000",
        justifyContent: "center",
        alignItems: "center",
    },

    videoPlayer: {
        width: "100%",
        height: "80%",
    },

    closeBtn: {
        position: "absolute",
        top: 20,
        right: 20,
        zIndex: 20,
    },

    downloadModal: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },

    downloadBox: {
        width: "75%",
        backgroundColor: "#1C1F25",
        padding: 20,
        borderRadius: 16,
        alignItems: "center",
    },

    downloadTitle: {
        color: "white",
        fontSize: 18,
        marginBottom: 15,
        fontWeight: "600",
    },

    progressBarBackground: {
        backgroundColor: "#2E3A4A",
        width: "100%",
        height: 12,
        borderRadius: 8,
        overflow: "hidden",
    },

    progressBarFill: {
        height: "100%",
        backgroundColor: "#00E5A8",
    },

    progressText: {
        marginTop: 10,
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },

    confirmOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },

    confirmBox: {
        width: "80%",
        backgroundColor: "#1C1F25",
        padding: 20,
        borderRadius: 16,
    },

    confirmTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "white",
        marginBottom: 10,
    },

    confirmMsg: {
        fontSize: 14,
        color: "#8FA3B0",
        marginBottom: 20,
    },

    confirmActions: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },

    cancelBtn: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        marginRight: 10,
    },

    cancelText: {
        color: "#8FA3B0",
        fontSize: 16,
    },

    deleteBtn: {
        backgroundColor: "#FF4F4F",
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 6,
    },

    deleteText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
    },
});
