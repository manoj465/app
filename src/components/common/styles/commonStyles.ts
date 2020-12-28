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
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    absoluteFill: {
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0
    }
})