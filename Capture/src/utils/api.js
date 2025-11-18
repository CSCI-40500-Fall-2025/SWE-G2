import { Platform } from "react-native";

const API_BASE =
  Platform.OS === "android"
    ? "http://10.0.2.2:5001/api"   // Android emulator → your Mac
    : "http://localhost:5001/api"; // iOS simulator → your Mac

export default API_BASE;
