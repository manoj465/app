import { StyleSheet } from "react-native";

export const colors = {
    primary: "#333",
    secondary: "#555",
    tertiary: "#777",
    warning: "#cd6155",
    feather: "#aaa"
}

export default StyleSheet.create({
    primaryTextColors: {
        color: colors.primary
    },
    secondaryTextColor: {
        color: colors.secondary
    },
    tertiaryTextColor: {
        color: colors.tertiary
    },
    warningText: {
        color: colors.warning
    },
    textFeather: {
        color: colors.feather
    }
})