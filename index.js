/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;
globalThis.MbglLogging = {
  level: 'error', // only show critical errors
};
AppRegistry.registerComponent(appName, () => App);
