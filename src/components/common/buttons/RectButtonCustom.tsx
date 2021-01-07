import React from 'react'
import { View, Text, StyleProp, ViewStyle, TextStyle, TouchableOpacity } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import styles from '../styles'
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
    style?: StyleProp<ViewStyle>
    innerCompStyle?: StyleProp<ViewStyle>
    shadow?: boolean
    onPress?: () => void
    children?: React.ReactNode
}/**
 * @param style `StyleProp<ViewStyle>` button ContainerView Style 
 * @param innerCompStyle `StyleProp<ViewStyle>` RectButton Style 
 * @param shadow `default false` 
 * @param onPress 
 * @param children `React.Node` children component
 * @returns  
 */
export const NewRectButtonWithChildren = ({ style, innerCompStyle, onPress = () => { }, children, shadow }: NewRectButtonWithChildrenProps) => {
    return (
        <View style={[{
            backgroundColor: "#fff",
            overflow: "hidden",
            marginVertical: 5,
        },
            style,
        shadow ? STYLES.shadow : {}
        ]}>
            <RectButton style={
                [{
                    height: "100%",
                    width: "100%",
                    justifyContent: "center",
                    alignContent: "center"
                }, innerCompStyle]}
                onPress={onPress}>
                {children}
            </RectButton>
        </View>
    )
}

//export default NewRectButton
