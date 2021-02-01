import { State } from "react-native-gesture-handler"
import { log } from "react-native-reanimated"
import UNIVERSALS from "../@universals"
import reduxStore from "../redux"
import { _deviceListSaga_action } from "../redux/deviceListReducer/saga/deviceList"
import { getCurrentTimeStampInSeconds } from "../util/DateTimeUtil"
import { logger } from "../@logger"




interface beforeUpdateDevice_props {
    device: UNIVERSALS.GLOBALS.DEVICE_t
    preState?: UNIVERSALS.GLOBALS.DEVICE_t
    deletedObject?: UNIVERSALS.GLOBALS.DEVICE_t
}
type beforeUpdateDevice_t = (props: beforeUpdateDevice_props) => void
const beforeUpdateDeviceSideEffect: beforeUpdateDevice_t = async ({ device }) => { }



/*
'########::'########:'##::::'##:'####::'######::'########::::'##::::'##:'########::'########:::::'###::::'########:'########:
 ##.... ##: ##.....:: ##:::: ##:. ##::'##... ##: ##.....::::: ##:::: ##: ##.... ##: ##.... ##:::'## ##:::... ##..:: ##.....::
 ##:::: ##: ##::::::: ##:::: ##:: ##:: ##:::..:: ##:::::::::: ##:::: ##: ##:::: ##: ##:::: ##::'##:. ##::::: ##:::: ##:::::::
 ##:::: ##: ######::: ##:::: ##:: ##:: ##::::::: ######:::::: ##:::: ##: ########:: ##:::: ##:'##:::. ##:::: ##:::: ######:::
 ##:::: ##: ##...::::. ##:: ##::: ##:: ##::::::: ##...::::::: ##:::: ##: ##.....::: ##:::: ##: #########:::: ##:::: ##...::::
 ##:::: ##: ##::::::::. ## ##:::: ##:: ##::: ##: ##:::::::::: ##:::: ##: ##:::::::: ##:::: ##: ##.... ##:::: ##:::: ##:::::::
 ########:: ########:::. ###::::'####:. ######:: ########::::. #######:: ##:::::::: ########:: ##:::: ##:::: ##:::: ########:
........:::........:::::...:::::....:::......:::........::::::.......:::..:::::::::........:::..:::::..:::::..:::::........::
*/

interface add_updateDevices_props {
    cmd: "ADD_UPDATE_DEVICES"
    newDevices: UNIVERSALS.GLOBALS.DEVICE_t[]
    /** weather or not coming devices are coming from cloud as user's all devices latest state */
    cloudState?: boolean
    log?: logger
}
interface add_updateDevices_t { (props: add_updateDevices_props): UNIVERSALS.GLOBALS.DEVICE_t[] }
const add_updateDevices: add_updateDevices_t = ({ newDevices, cloudState, ...props }) => {
    let requireReduxUpdate = false
    let localDeviceList = reduxStore.store.getState().deviceReducer.deviceList
    let newDeviceList = localDeviceList
    newDevices.forEach((newDevice, newDevice_index) => {
        let localStateDevice = newDeviceList.find(item => item.Mac == newDevice.Mac)
        if (localStateDevice) {
            let localStateDeviceIndex = newDeviceList.findIndex(item => item.Mac == newDevice.Mac)
            props.log?.print("device found in local state")
            beforeUpdateDeviceSideEffect({ device: newDevice, preState: localStateDevice })
            if (localStateDevice.localTimeStamp < newDevice.localTimeStamp
                || (newDevice.ts && localStateDevice.localTimeStamp < newDevice.ts)
            ) {
                requireReduxUpdate = true
                newDeviceList = newDeviceList.filter(item => item.Mac != newDevice.Mac)
                newDeviceList.splice(localStateDeviceIndex, 0, newDevice)
            } else if ((localStateDevice.ts && newDevice.ts && localStateDevice.ts != newDevice.ts)
                || (!localStateDevice.ts && newDevice.ts)
            ) {
                requireReduxUpdate = true
                beforeUpdateDeviceSideEffect({ device: { ...localStateDevice, ts: newDevice.ts }, preState: localStateDevice })
                newDeviceList = newDeviceList.filter(item => item.Mac != newDevice.Mac)
                newDeviceList.splice(localStateDeviceIndex, 0, newDevice)
            }
        } else {
            props.log?.print("device not found in local state")
            /* check if device is present in deletedDeviceList */
            let deviceMatchFromDeletedDeviceList = reduxStore.store.getState().deviceReducer.deletedDevices.find(item => item.Mac == newDevice.Mac)
            if (deviceMatchFromDeletedDeviceList) {
                props.log?.print("device found in deleted device list ")
                //props.log?.print("device from deleted list")._printPretty(deviceMatchFromDeletedDeviceList)
                //props.log?.print("device from cloud")._printPretty(newDevice)
            }
            if (deviceMatchFromDeletedDeviceList && deviceMatchFromDeletedDeviceList.localTimeStamp >= newDevice.localTimeStamp) {// IMP - only filter deletedDeviceList in case if its a cloudState comparision, generally user could be re-pairing the device after delete
                /** 
                 * if device is present in deletedDeviceList and timeStamp
                 * is latest compared to `newDevice.ts`, then in that case it is assumed
                 * that the deviec delete is not yet updated to cloud and newDevice shouldn't
                 * be added to list
                 */
                props.log?.print("not adding device " + newDevice.Mac + " to device list as it is deleted and not updated to cloud yet")
            }
            else {
                requireReduxUpdate = true
                newDeviceList.push(newDevice)
                props.log?.print("removing " + newDevice.Mac + " from deleted deviceList")
                reduxStore.store.dispatch(reduxStore.actions.deviceList.deletedDeviceListRedux({
                    deletedDeviceList: reduxStore.store.getState().deviceReducer.deletedDevices.filter(item => item.Mac == newDevice.Mac)
                }))
                beforeUpdateDeviceSideEffect({ device: newDevice })
            }
        }
    });
    if (cloudState) {
        newDeviceList = newDeviceList.filter(item => (!item.id || (() => {
            let devicesFoundInCloudState = false
            newDevices.forEach(element => {
                if (element.Mac == item.Mac)
                    devicesFoundInCloudState = true
            });
            if (devicesFoundInCloudState)
                return true
            props.log?.print("removing device mac " + item.Mac)
            requireReduxUpdate = true
            return false
        })()))
        //props.log?.print("filtered device list " + JSON.stringify(newDeviceList, null, 1))
    }
    if (requireReduxUpdate) {
        props.log?.print("Sending Saga Action with new list is " + JSON.stringify(newDeviceList, null, 2))
        reduxStore.store.dispatch(reduxStore.actions.deviceList.deviceListSaga({
            deviceList: newDeviceList,
            log: props.log ? new logger("devicelist saga", props.log) : undefined
        }))
    } else {
        props.log?.print("update not required ")
    }
    return newDeviceList
}




/*
'########::'########:'##::::'##::'#######::'##::::'##:'########::::'########::'########:'##::::'##:'####::'######::'########:
 ##.... ##: ##.....:: ###::'###:'##.... ##: ##:::: ##: ##.....::::: ##.... ##: ##.....:: ##:::: ##:. ##::'##... ##: ##.....::
 ##:::: ##: ##::::::: ####'####: ##:::: ##: ##:::: ##: ##:::::::::: ##:::: ##: ##::::::: ##:::: ##:: ##:: ##:::..:: ##:::::::
 ########:: ######::: ## ### ##: ##:::: ##: ##:::: ##: ######:::::: ##:::: ##: ######::: ##:::: ##:: ##:: ##::::::: ######:::
 ##.. ##::: ##...:::: ##. #: ##: ##:::: ##:. ##:: ##:: ##...::::::: ##:::: ##: ##...::::. ##:: ##::: ##:: ##::::::: ##...::::
 ##::. ##:: ##::::::: ##:.:: ##: ##:::: ##::. ## ##::: ##:::::::::: ##:::: ##: ##::::::::. ## ##:::: ##:: ##::: ##: ##:::::::
 ##:::. ##: ########: ##:::: ##:. #######::::. ###:::: ########:::: ########:: ########:::. ###::::'####:. ######:: ########:
..:::::..::........::..:::::..:::.......::::::...:::::........:::::........:::........:::::...:::::....:::......:::........::
*/


interface removeDeviceProps {
    cmd: "REMOVE_DEVICE"
    Mac: string
    log?: logger
}
const removeDevice = (props: removeDeviceProps) => {
    let device = reduxStore.store.getState().deviceReducer.deviceList.find(item => item.Mac == props.Mac)
    if (device) {
        let newDeviceList = reduxStore.store.getState().deviceReducer.deviceList.filter(device => device.Mac != props.Mac)
        props.log?.print("device removed > sending saga update")._print(JSON.stringify(newDeviceList, null, 2))
        if (device.id) {/** if device is synced with cloud add device in the deleted deviceList so as to remove it from the cloud later from background service */
            let __foo = reduxStore.store.getState().deviceReducer.deletedDevices
            let deviceFromDeletedDeviceList = reduxStore.store.getState().deviceReducer.deletedDevices.find(item => item.Mac == props.Mac)
            if (deviceFromDeletedDeviceList)
                __foo = __foo.filter(item => item.Mac != props.Mac)
            __foo.push({ ...device, localTimeStamp: getCurrentTimeStampInSeconds() })
            reduxStore.store.dispatch(reduxStore.actions.deviceList.deletedDeviceListRedux({
                deletedDeviceList: __foo
            }))
        }
        reduxStore.store.dispatch(reduxStore.actions.deviceList.deviceListSaga({ deviceList: newDeviceList, log: props.log }))
    }
}



/*
:'######:::'#######::'##::::::::'#######::'########:::::'##::::'##:'########::'########:::::'###::::'########:'########:
'##... ##:'##.... ##: ##:::::::'##.... ##: ##.... ##:::: ##:::: ##: ##.... ##: ##.... ##:::'## ##:::... ##..:: ##.....::
 ##:::..:: ##:::: ##: ##::::::: ##:::: ##: ##:::: ##:::: ##:::: ##: ##:::: ##: ##:::: ##::'##:. ##::::: ##:::: ##:::::::
 ##::::::: ##:::: ##: ##::::::: ##:::: ##: ########::::: ##:::: ##: ########:: ##:::: ##:'##:::. ##:::: ##:::: ######:::
 ##::::::: ##:::: ##: ##::::::: ##:::: ##: ##.. ##:::::: ##:::: ##: ##.....::: ##:::: ##: #########:::: ##:::: ##...::::
 ##::: ##: ##:::: ##: ##::::::: ##:::: ##: ##::. ##::::: ##:::: ##: ##:::::::: ##:::: ##: ##.... ##:::: ##:::: ##:::::::
. ######::. #######:: ########:. #######:: ##:::. ##::::. #######:: ##:::::::: ########:: ##:::: ##:::: ##:::: ########:
:......::::.......:::........:::.......:::..:::::..::::::.......:::..:::::::::........:::..:::::..:::::..:::::........::
*/


interface colorUpdate_props {
    cmd: "COLOR_UPDATE"
    deviceMac: string[]
    hsv: { h?: number, s?: number, v?: number }
    gestureState: State,
    log?: logger
}
/** 
 * ## featureRequest
 * - [ ] send the updated devicelist to devicelistAddUpdater
 */
const colorUpdate = ({ deviceMac, hsv: { h, s, v }, gestureState, log }: colorUpdate_props) => {
    reduxStore.store.dispatch(
        reduxStore.actions.deviceList.colorSaga({
            deviceMac,
            hsv: { h, s, v },
            gestureState,
            onActionComplete: ({ newDeviceList }) => {
                reduxStore.store.dispatch(_deviceListSaga_action({ deviceList: newDeviceList, log }))
            },
            log
        })
    );
}



/*
'########::'########:'##::::'##:'####::'######::'########:::::'#######::'########::'########:'########:::::'###::::'########::'#######::'########::
 ##.... ##: ##.....:: ##:::: ##:. ##::'##... ##: ##.....:::::'##.... ##: ##.... ##: ##.....:: ##.... ##:::'## ##:::... ##..::'##.... ##: ##.... ##:
 ##:::: ##: ##::::::: ##:::: ##:: ##:: ##:::..:: ##:::::::::: ##:::: ##: ##:::: ##: ##::::::: ##:::: ##::'##:. ##::::: ##:::: ##:::: ##: ##:::: ##:
 ##:::: ##: ######::: ##:::: ##:: ##:: ##::::::: ######:::::: ##:::: ##: ########:: ######::: ########::'##:::. ##:::: ##:::: ##:::: ##: ########::
 ##:::: ##: ##...::::. ##:: ##::: ##:: ##::::::: ##...::::::: ##:::: ##: ##.....::: ##...:::: ##.. ##::: #########:::: ##:::: ##:::: ##: ##.. ##:::
 ##:::: ##: ##::::::::. ## ##:::: ##:: ##::: ##: ##:::::::::: ##:::: ##: ##:::::::: ##::::::: ##::. ##:: ##.... ##:::: ##:::: ##:::: ##: ##::. ##::
 ########:: ########:::. ###::::'####:. ######:: ########::::. #######:: ##:::::::: ########: ##:::. ##: ##:::: ##:::: ##::::. #######:: ##:::. ##:
........:::........:::::...:::::....:::......:::........::::::.......:::..:::::::::........::..:::::..::..:::::..:::::..::::::.......:::..:::::..::
*/



type containerListOperation_t = (props: add_updateDevices_props | removeDeviceProps | colorUpdate_props) => void
const deviceOperation: containerListOperation_t = async (props) => {
    switch (props.cmd) {
        case "ADD_UPDATE_DEVICES":
            add_updateDevices(props)
            break;


        case "REMOVE_DEVICE":
            removeDevice(props)
            break;

        case "COLOR_UPDATE":
            props.log = props.log ? new logger("D's OP - color update", props.log) : undefined
            colorUpdate(props)
            break;

        default:
            break;
    }
    return {}
}

export default deviceOperation