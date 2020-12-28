import React from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import Animated from 'react-native-reanimated';
import { SafeAreaView } from "react-native-safe-area-context";


interface Props {
    style?: StyleProp<ViewStyle>
    children?: React.ReactNode
}

export default ({ style, children }: Props) => {
    return (
        <SafeAreaView style={[{ width: "100%" }, style]}>
            <Animated.ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                {children}
            </Animated.ScrollView>
        </SafeAreaView>
    )
}
