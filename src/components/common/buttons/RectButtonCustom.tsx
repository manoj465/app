import React from 'react'
import { View, Text, StyleProp, ViewStyle, TextStyle, TouchableOpacity } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import STYLES from "../styles"

interface Props {
    buttonStyle?: StyleProp<ViewStyle>
    textStyle?: StyleProp<TextStyle>
    text?: string
    onPress?: () => void
    children?: React.ReactNode
    useReanimated?: boolean
}

/** 
 * //TODO add support for dynamic JSX.elsment as children
 */
export const NewRectButton = ({ buttonStyle, textStyle, text, onPress = () => { }, useReanimated = true }: Props) => {
    return (
        <View style={[STYLES.shadow, { height: 50, width: "100%", overflow: "hidden", backgroundColor: "white", borderRadius: 25, }, buttonStyle]}>
            {useReanimated ? <RectButton style={{ height: "100%", width: "100%", flex: 1, justifyContent: "center", alignContent: "center" }}
                onPress={onPress}>
                <Text style={[{ textAlign: "center", fontSize: 18 }, textStyle]}>{text ? text : "BUTTON"}</Text>
            </RectButton>
                : <TouchableOpacity style={{ height: "100%", width: "100%", flex: 1, justifyContent: "center", alignContent: "center" }}
                    onPress={onPress}>
                    <Text style={[{ textAlign: "center", fontSize: 18 }, textStyle]}>{text ? text : "BUTTON"}</Text>
                </TouchableOpacity>}
        </View>
    )
}


interface NewRectButtonWithChildrenProps {
    buttonStyle?: StyleProp<ViewStyle>
    onPress?: () => void
    children?: React.ReactNode
}
export const NewRectButtonWithChildren = ({ buttonStyle, onPress = () => { }, children }: NewRectButtonWithChildrenProps) => {
    return (
        <View style={[{
            backgroundColor: "#fff",
            overflow: "hidden",
            borderRadius: 25,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 25,
            elevation: 5,
            marginVertical: 5
        }, buttonStyle]}>
            <RectButton style={{ height: "100%", width: "100%", justifyContent: "center", alignContent: "center" }}
                onPress={onPress}>
                {children}
            </RectButton>
        </View>
    )
}

//export default NewRectButton
