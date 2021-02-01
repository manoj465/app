import { Platform, View } from "react-native";

export default Platform.OS !== 'web' ? require('react-native').Modal : require('./WebModal').default;