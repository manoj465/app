import React from 'react'
import { View, Text, StyleProp, ViewStyle, TextStyle, TouchableOpacity, StyleSheet } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import styles from '../styles'
import STYLES from "../styles"

interface Props {
    buttonStyle?: StyleProp<ViewStyle>
    textStyle?: StyleProp<TextStyle>
    text?: string
    shadow?: boolean
    onPress?: () => void
    children?: React.ReactNode
    useReanimated?: boolean
}

/** 
 * //TODO add support for dynamic JSX.elsment as children
 */
export const NewRectButton = ({ buttonStyle, textStyle, text, onPress = () => { }, useReanimated = false }: Props) => {
    return (
        <View style={[STYLES.shadow, _styles.buttonContainer, buttonStyle]}>
            {useReanimated ? <RectButton style={[_styles.innerbutton]}
                onPress={onPress}>
                <Text style={[{ textAlign: "center", fontSize: 18 }, textStyle]}>{text ? text : "BUTTON"}</Text>
            </RectButton>
                : <TouchableOpacity style={[_styles.innerbutton]}
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
    useReanimated?: boolean
    children?: React.ReactNode
}/**
 * @param style `StyleProp<ViewStyle>` button ContainerView Style 
 * @param innerCompStyle `StyleProp<ViewStyle>` RectButton Style 
 * @param shadow `default false` 
 * @param onPress 
 * @param children `React.Node` children component
 * @returns  
 */
export const NewRectButtonWithChildren = ({ style, innerCompStyle, onPress = () => { }, useReanimated = false, children, shadow }: NewRectButtonWithChildrenProps) => {
    return (
        <View style={[_styles.buttonContainer, shadow ? STYLES.shadow : {}, style,]}>
            {useReanimated ?
                <RectButton style={
                    [_styles.innerbutton, innerCompStyle]}
                    onPress={onPress}>
                    {children}
                </RectButton>
                : <TouchableOpacity style={
                    [_styles.innerbutton, innerCompStyle]}
                    onPress={onPress}>
                    {children}
                </TouchableOpacity>}
        </View>
    )
}


const _styles = StyleSheet.create({
    buttonContainer: {
        backgroundColor: "#fff",
        overflow: "hidden",
        borderRadius: 10,
        marginVertical: 5,
        width: "100%",
        height: 50,
    },
    innerbutton: {
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }
})


//export default NewRectButton
