import { StyleSheet } from "react-native";

export const textColors = {
    primary: "#333",
    secondary: "#555",
    tertiary: "#777",
    warning: "#E74C3C",
    success: "#2ECC71",
    feather: "#aaa"
}

export const themeColors = {
    primary: "#5555ff"
}

export default StyleSheet.create({
    primaryTextColors: {
        color: textColors.primary
    },
    secondaryTextColor: {
        color: textColors.secondary
    },
    tertiaryTextColor: {
        color: textColors.tertiary
    },
    warningText: {
        color: textColors.warning
    },
    textFeather: {
        color: textColors.feather
    }
})