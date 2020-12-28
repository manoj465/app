import { State } from "react-native-gesture-handler";
import { types } from "../@types/huelite";
import { reduxStore } from "../redux";
import { logger } from "./logger";


interface addNewDevice_props {
    newDevice: types.HUE_DEVICE_t
    groupName?: string
    forceUpdate?: boolean
    log?: logger
}
type addNewDevice_t = (props: addNewDevice_props, log?: logger) => types.HUE_DEVICE_t[]
const addNewDevice: addNewDevice_t = ({ newDevice, groupName, forceUpdate }, log) => {
    let deviceFound = false
    const newDeviceList = reduxStore.store.getState().deviceReducer.deviceList.map((device, index) => {
        if (device.Mac == newDevice.Mac) {
            deviceFound = true
            if (forceUpdate)
                return newDevice
            return device
        }
        return device
    })
    if (!deviceFound)
        newDeviceList.push(newDevice)
    return newDeviceList
}



interface removeDevice_props {
    Mac: string
    log?: logger
}
type removeDevice_t = (props: removeDevice_props) => types.HUE_DEVICE_t[]
const removeDevice: removeDevice_t = ({ Mac }) => {
    return reduxStore.store.getState().deviceReducer.deviceList.filter(device => device.Mac != Mac)
}


interface colorUpdate_props {
    deviceMac: string[]
    hsv: { h?: number, s?: number, v?: number }
    gestureState: State,
    log?: logger
}
type colorUpdate_t = (props: colorUpdate_props) => void
const colorUpdate: colorUpdate_t = ({ deviceMac, hsv: { h, s, v }, gestureState, log }) => {
    reduxStore.store.dispatch(
        reduxStore.actions.deviceList.colorSaga({
            deviceMac,
            hsv: { h, s, v },
            gestureState,
            log
        })
    );
    return
}


interface containerListOperation_props {
    props:
    | { cmd: "ADD_NEW_DEVICE" } & addNewDevice_props
    | { cmd: "REMOVE_DEVICE" } & removeDevice_props
    | { cmd: "COLOR_UPDATE" } & colorUpdate_props
}
type containerListOperation_t = (props: containerListOperation_props) => Promise<types.HUE_DEVICE_t[]>
export const deviceListOperation: containerListOperation_t = async ({ props }) => {
    switch (props.cmd) {
        case "REMOVE_DEVICE":
            let _newDeviceList = removeDevice(props)
            props.log?.print("device removed > sending saga update")
            props.log?.printDeviceList(_newDeviceList)
            reduxStore.store.dispatch(reduxStore.actions.deviceList.deviceListSaga({ deviceList: _newDeviceList, log: props.log }))
            return _newDeviceList
            break;

        case "ADD_NEW_DEVICE":
            props.log?.print("ADD NEW DEVICE")
            let __newdeviceList = addNewDevice(props, props.log)
            if (__newdeviceList.length > 0) {
                props.log?.print("Sending Saga Action with new list is ")
                props.log?.printDeviceList(__newdeviceList)
                reduxStore.store.dispatch(reduxStore.actions.deviceList.deviceListSaga({ deviceList: __newdeviceList, log: props.log }))
            }
            else {
                props.log?.print("Device cannot be added")
            }
            return __newdeviceList
            break;

        case "COLOR_UPDATE":
            props.log = props.log ? new logger("D's OP - color update", props.log) : undefined
            colorUpdate(props)
            break;

        default:
            break;
    }
    return []
}


interface doesDeviceNameAlreadyExists_props {
    deviceName: string
}
type doesDeviceNameAlreadyExists_t = ({ deviceName }: doesDeviceNameAlreadyExists_props) => boolean
export const doesDeviceNameAlreadyExists: doesDeviceNameAlreadyExists_t = ({ deviceName }) => {
    let returnValue = false
    reduxStore.store.getState().deviceReducer.deviceList.forEach((device, index) => {
        if (device.deviceName?.toLowerCase() == deviceName.toLowerCase()) {
            returnValue = true
            return true
        }
    })
    return returnValue
}