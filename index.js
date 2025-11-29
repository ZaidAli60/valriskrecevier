/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { Logger } from "@maplibre/maplibre-react-native";

// Disable noisy MapLibre warnings
Logger.setLogCallback((log) => {
    const { message } = log;

    if (
        message.includes("source must have tiles") ||
        message.includes("Request failed due to a permanent error") ||
        message.includes("stream was reset: CANCEL") ||
        message.includes("Canceled") ||
        message.includes("Socket Closed")
    ) {
        return true; // hide it
    }

    return false; // show other important logs
});
globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;

AppRegistry.registerComponent(appName, () => App);
