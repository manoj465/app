import React, { useState } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { appOperator } from '../../util/app.operator'
import { logger } from '../../util/logger'
import Modal from './modal/index'


export default ({ visible, onDeleteComplete }: { visible: boolean, onDeleteComplete?: () => void }) => {


    const DeleteModal = ({ Node, ...props }: { Node?: any, outerContainerStyle?: StyleProp<ViewStyle>, style?: StyleProp<ViewStyle> }) => {
        return (
            <Modal /*///Modal */ visible={visible} {...props}>
                <Node />
            </Modal>
        )
    }

    const onDeleteAsk = async ({ Mac }: { Mac: string }) => {
        console.log("REMOVEING DEVICE >> " + Mac)
        appOperator.device({
            cmd: "REMOVE_DEVICE",
            Mac,
            log: new logger("test function delete device")
        })
        onDeleteComplete ? onDeleteComplete() : {}
    }


    return { DeleteModal, onDeleteAsk }
}



