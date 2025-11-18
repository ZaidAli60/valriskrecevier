// src/theme/Colors.js
import { MD3DarkTheme as DefaultTheme } from "react-native-paper";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,

    primary: "#00E5A8",       // Neon mint
    secondary: "#08121E",     // Deep cyber navy
    card: "#101B2D",          // Dark card
    surface: "#142436",
    text: "#E8F9F1",          // Soft white
    subtext: "#8FA3B0",       // Muted grey
    accent: "#8D5CF6",        // Purple accent
    danger: "#FF4F4F",
    success: "#00D47E",
  },
};

export default theme;
