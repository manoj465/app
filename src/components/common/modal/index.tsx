import React from 'react'
import { StyleProp, View, ViewStyle, Text } from 'react-native'
import Modal from './baseModal'
/**test change to bit comp
 * 
 * .
 * .
 * 
 */
interface Props {
    children?: any
    outerContainerStyle?: StyleProp<ViewStyle>
    style?: StyleProp<ViewStyle>
    visible?: boolean
    onShow?: () => void
}

export default ({ children, visible, ...props }: Props) => {

    return (
        <Modal
            animationType="slide"
            transparent
            visible={visible}
            onShow={props.onShow}>
            <View /**modal outer container */ style={[{ flex: 1, justifyContent: "center", alignItems: "center", width: "100%" }, props.outerContainerStyle]}>
                {children}
            </View>
        </Modal>
    )
}



