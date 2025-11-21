// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  */
import { LogBox } from "react-native";
LogBox.ignoreLogs([
  "InteractionManager has been deprecated",
  "Sending `onAnimatedValueUpdate` with no listeners registered."
]);
import React, { useEffect } from "react";
// import { NavigationContainer } from "@react-navigation/native";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
// import BootSplash from "react-native-bootsplash";
import StackNavigator from "./src/navigation/StackNavigator";
import theme from "./src/theme/Colors";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";


export default function App() {
  // useEffect(() => {
  //   // Hide splash after JS loads and navigation mounts
  //   const hide = async () => {
  //     await BootSplash.hide({ fade: true });
  //     console.log("✅ Splash hidden successfully");
  //   };
  //   hide();
  // }, []);

  const toastConfig = {
    success: (props) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: "#22c55e",
          backgroundColor: "#fff",
          elevation: 10,
        }}
        text1Style={{
          fontSize: 16,
          fontWeight: "bold",
          color: "#1d3557",
        }}
        text2Style={{
          fontSize: 13,
          color: "#555",
        }}
      />
    ),
    error: (props) => (
      <ErrorToast
        {...props}
        style={{
          borderLeftColor: "#ef4444",
          backgroundColor: "#fff",
          elevation: 10,
        }}
        text1Style={{
          fontSize: 16,
          fontWeight: "bold",
          color: "#b91c1c",
        }}
        text2Style={{
          fontSize: 13,
          color: "#555",
        }}
      />
    ),
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right","bottom"]}>
        <PaperProvider theme={theme}>
          {/* <NavigationContainer
          // onReady={() => BootSplash.hide({ fade: true })}
          > */}
          <StackNavigator />
          {/* </NavigationContainer> */}
        </PaperProvider>
      </SafeAreaView>
      <Toast config={toastConfig} position="top" topOffset={100} />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
});
