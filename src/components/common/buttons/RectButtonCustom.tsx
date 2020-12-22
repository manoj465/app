import React from 'react'
import { View, Text, StyleProp, ViewStyle, TextStyle } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'

interface Props {
    buttonStyle?: StyleProp<ViewStyle>
    textStyle?: StyleProp<TextStyle>
    text?: string
    onPress?: () => void
    children?: React.ReactNode
}

/** 
 * //TODO add support for dynamic JSX.elsment as children
 */
export const NewRectButton = ({ buttonStyle, textStyle, text, onPress = () => { } }: Props) => {
    return (
        <View style={[{ height: 50, overflow: "hidden", backgroundColor: "white", elevation: 4, borderRadius: 25, }, buttonStyle]}>
            <RectButton style={{ height: "100%", width: "100%", justifyContent: "center", alignContent: "center" }}
                onPress={onPress}>
                <Text style={[{ textAlign: "center", fontSize: 18 }, textStyle]}>{text ? text : "BUTTON"}</Text>
            </RectButton>
        </View>
    )
}

//export default NewRectButton
