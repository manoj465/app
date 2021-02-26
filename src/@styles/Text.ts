import { StyleSheet } from "react-native";
import color from "./colors"


const common = StyleSheet.create({
    _headingCommonStyles: {
        ...color.primaryTextColors,
        marginHorizontal: 5,
        fontWeight: "bold",
    }
})
export default StyleSheet.create({
    _headingCommonStyles: {
        marginHorizontal: 5,
        fontWeight: "bold"
    },
    H1: {
        ...common._headingCommonStyles,
        fontSize: 30,
    },
    H2: {
        ...common._headingCommonStyles,
        fontSize: 27,
    },
    H3: {
        ...common._headingCommonStyles,
        fontSize: 24,
    },
    H4: {
        ...common._headingCommonStyles,
        fontSize: 21,
    },
    H5: {
        ...common._headingCommonStyles,
        fontSize: 18,
    },
    H6: {
        ...common._headingCommonStyles,
        fontSize: 15,
    },
    H7: {
        ...common._headingCommonStyles,
        fontSize: 12,
    }
})