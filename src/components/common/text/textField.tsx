import React from "react";
import { Text, TextInput, View } from "react-native";
import { NewRectButtonWithChildren } from "../buttons/RectButtonCustom";
import { STYLES } from "../../../@styles";

interface props {
    placeholder?: string
    heading?: string
    highlightColor?: string
    onPress?: () => void
    value?: string
    setValue: React.Dispatch<React.SetStateAction<string>>
}
export default ({ placeholder, heading, highlightColor = "#aaaaaa", onPress = () => { }, setValue, value }: props) => {

    return (
        <View>
            <Text style={[STYLES.H7, STYLES.tertiaryTextColor, { marginLeft: 10, marginBottom: 3 }]}>{heading}</Text>
            <View style={{
                borderColor: highlightColor,
                width: "100%",
                borderWidth: 0.5,
                minHeight: 50,
                borderRadius: 10,
                paddingHorizontal: 10,
                justifyContent: "center"
            }}>
                <TextInput style={[STYLES.H6]}
                    value={value}
                    placeholder={placeholder}
                    onChangeText={text => { setValue(text) }}
                />
            </View>
        </View>
    )
}