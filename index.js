/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;
// globalThis.MbglLogging = {
//   level: 'error', // only show critical errors
// };

import { Logger } from "@maplibre/maplibre-react-native";

// Hide tile-cancel spam
Logger.setLogCallback(log => {
    const msg = log.message || "";

    if (
        msg.includes("Request failed due to a permanent error: Canceled") ||
        msg.includes("Socket Closed")
    ) {
        return true;
    }
    return false;
})

AppRegistry.registerComponent(appName, () => App);
