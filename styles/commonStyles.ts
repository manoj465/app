import { StyleSheet } from "react-native";

export default StyleSheet.create({
    round50: {
        height: 50,
        width: 50,
        borderRadius: 35,
    },
    shadow: {
        backgroundColor: "#fff",
        alignItems: 'center',
        shadowColor: '#777',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 2,
    },
    absoluteFill: {
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0
    },
    center: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    }
})