import { State } from "react-native-gesture-handler";
import { actionChannel, select } from "redux-saga/effects";
import UNIVERSALS from "../../../@universals";
import { convertHSVToRgbShortRange, convertRGBToHex, hsv2hex, hsv2hex_shortRange } from "../../../util/Color";
import { logger } from "../../../@logger";
import { HBSocketList_t } from "../../helperSideEffect/reducers/HBReducer";
import { _reduxConstant } from "../../ReduxConstant";
import { _appState } from "../../rootReducer";
import { _delay } from "../../sagas/helper";
import { _getWorker } from '../../sagas/sagaBaseWorkers';
import { deviceType_e } from "../../../@universals/globals/device";
import { device } from "../../../@api/v1/cloud";
import { getCurrentTimeStampInSeconds } from "../../../util/DateTimeUtil";

enum com_channels_e {
    COM_CHANNEL_SOCKET,
    COM_CHANNEL_MQTT
}

interface onActionCompleted_props {
    newDeviceList: UNIVERSALS.GLOBALS.DEVICE_t[]
}
/**
 * NOTE: whatever changes made to this interface also applies to deviceOperator colorUpdate Function
 */
export interface _colorAction_Props {
    deviceMac: string[]
    state?: string
    gestureState: number
    channelBrightnessObject?: {
        /** `value` - brightness value for active channels */
        value: number
        /** `activeChannel` array of boolean representing the actie channels at respectives index flagged as true */
        activeChannel: boolean[]
    },
    stateObject?: {
        state: UNIVERSALS.GLOBALS.channelState_e,
        hsv?: {
            h?: number
            s?: number
            v?: number
        }
    }
    onActionComplete?: ({ newDeviceList }: onActionCompleted_props) => void
    log?: logger
}
/**
 * 
 * ## road-map
 * 
 * rename colorSaga to deviceComm Saga
 * 
 * ### responsiblities
 * - [ ] decides weather to send msg over socket or mqtt
 * - [ ] ability to consume communication channel priority via `com_channels_e`
 * 
 * ## channel object priorities
 * 
 * colorSaga provides multiple ways you can define the channel output. if more than one is present than only one with highest priority will be considered
 * 
 * 1 - state
 * 2 - channelBrightnessObject
 * 3 - stateObject
 * 
 */
const [_colorSaga_watcher, _colorSaga_action] = _getWorker<_colorAction_Props & {}>({
    type: _reduxConstant.COLOR_UPDATE_SAGA,
    shouldTakeLatest: true,
    callable: function* containersWorker({
        deviceMac,
        state,
        channelBrightnessObject,
        stateObject,
        gestureState,
        onActionComplete,
        log }) {
        //let log = new logger("debug")
        let deviceSocketList: HBSocketList_t[] = yield select((state: _appState) => state.HBReducer.HBSocketList)
        let devicelist: UNIVERSALS.GLOBALS.DEVICE_t[] = yield select((state: _appState) => state.deviceReducer.deviceList)
        //@ts-ignore
        const newDeviceList = yield Promise.all(devicelist.map(async (device) => {
            if (deviceMac.includes(device.Mac)) {/* check weather this device is present in requested deviceMac array */
                let [newHex, newDevice] = getHex({ device, channelBrightnessObject, stateObject })
                let deviceSocketObject = deviceSocketList.find(item => item.Mac == newDevice.Mac)
                if (deviceSocketObject?.socket) {/* if device has socket than send the color live */
                    log?.print("sending state to device  " + newHex)
                    log?.print("sending color to device - " + device.IP + " - ")
                    if (state) {
                        deviceSocketObject.socket.send(state)
                    } else if (newHex)
                        deviceSocketObject.socket.send(newHex)
                } else if (gestureState == State.END && !deviceSocketObject?.socket) {/* if device has no socket than send the color over mqtt only upon gestureState end */
                    log?.print("--sending color to device - " + device.IP + " - ")
                    log?.print("device has no socket ")
                    // - [ ] send code via mqtt
                }
                log?.print("new Device from HexConverter " + JSON.stringify(newDevice, null, 2))
                return newDevice
            }
            return device
        }))
        yield _delay(300)/* wait until gesture interval 200ms exceeds to ensure this next line of code only executes upon gesture end */
        log?.print("[COLOR SAGA] Gesture has ended >> sending Redux Data Update" + JSON.stringify(newDeviceList/* , null, 2 */))
        if (onActionComplete)
            onActionComplete({ newDeviceList })
    }
})

interface getHex_i {
    channelBrightnessObject?: {
        /** `value` - brightness value for active channels */
        value: number
        /** `activeChannel` array of boolean representing the actie channels at respectives index flagged as true */
        activeChannel: boolean[]
    },
    stateObject?: {
        state: UNIVERSALS.GLOBALS.channelState_e
        hsv?: {
            h?: number
            s?: number
            v?: number
        }
    },
    device: UNIVERSALS.GLOBALS.DEVICE_t
}
/** 
 * - [x] consume & handle `channelBrightnessObject` variable
 * 
 * - ### handle `channelBrightnessObject` for *handle for perticular device according to respective `outputChannelTypes_e`*
 * - [x] `outputChannelTypes_e.colorChannel_temprature`
 * - [ ] `outputChannelTypes_e.colorChannel_hsv`
 * - [x] send newState hex code upon processing and updateing channelObject
 * - [ ] make activeChannel optional in which case if activeChannel props is missing than apply the value to all channel
 * 
 * - BUG #cleared hex code not generated properly in case of channelType `UNIVERSALS.GLOBALS.outputChannelTypes_e.colorChannel_temprature`
 * - BUG for deviceType NW4 hex should be 4 pair which is currently 5 pair --resolution remove new pair addition code to newState from `line 149-150`
 */
const getHex: (props: getHex_i) => [string | undefined, UNIVERSALS.GLOBALS.DEVICE_t] = ({ channelBrightnessObject, stateObject, ...props }) => {
    let newDevice = Object.assign({}, props.device)
    newDevice.localTimeStamp = getCurrentTimeStampInSeconds()
    if (channelBrightnessObject) {
        //console.log("active channels are " + JSON.stringify(channelBrightnessObject.activeChannel))
        if (channelBrightnessObject.value < 10) {
            if (newDevice.channel.preState != UNIVERSALS.GLOBALS.channelState_e.CH_STATE_OFF)
                newDevice.channel.preState = newDevice.channel.state
            newDevice.channel.state = UNIVERSALS.GLOBALS.channelState_e.CH_STATE_OFF
        } else if (newDevice.channel.preState != undefined && newDevice.channel.preState != UNIVERSALS.GLOBALS.channelState_e.CH_STATE_OFF) {
            newDevice.channel.state = newDevice.channel.preState
        } else {
            newDevice.channel.state = UNIVERSALS.GLOBALS.channelState_e.CH_STATE_ALL_ON
        }
        let newState = "#"
        newDevice.channel.outputChannnel.forEach((channel, index) => {
            if (channel.type == UNIVERSALS.GLOBALS.outputChannelTypes_e.colorChannel_temprature) {
                /// update the brightness value to newDevice
                if (channelBrightnessObject.activeChannel[index])
                    newDevice.channel.outputChannnel[index].v = channelBrightnessObject.value < 10 ? 0 : channelBrightnessObject.value
                /// append newState with hex for this perticular channel
                if (newDevice.channel.outputChannnel[index].v <= 15)
                    newState += "0" + newDevice.channel.outputChannnel[index].v.toString(16)
                else if (newDevice.channel.outputChannnel[index].v < 5)
                    newState += "00" + newDevice.channel.outputChannnel[index].v.toString(16)
                else
                    newState += newDevice.channel.outputChannnel[index].v.toString(16)

            }
            else if (channel.type == UNIVERSALS.GLOBALS.outputChannelTypes_e.colorChannel_hsv) {
                /// update the brightness value to newDevice
                if (channelBrightnessObject.activeChannel[index])
                    newDevice.channel.outputChannnel[index].v = channelBrightnessObject.value < 10 ? 0 : channelBrightnessObject.value

                /// append newState with hex for this perticular channel
                newState += hsv2hex_shortRange({ hsv: [channel.h, channel.s, channelBrightnessObject.value] }).substring(1)
            }
        })
        if (newDevice.channel.outputChannnel.length == 4) // REMOVE to be removed --description additional pair addition for firmware dependency of 5 pair decoding technique/algo
            newState = newState + "00"
        return [newState, newDevice]
    }
    /**
     * @description handles colorchange in case `stateObject` is present
     */
    else if (stateObject) {
        console.log("--------state to device  " + stateObject.state)
        // Handles `CH_STATE_OFF` stateObject for all device types
        if (stateObject.state == UNIVERSALS.GLOBALS.channelState_e.CH_STATE_OFF) {
            console.log("preState  " + newDevice.channel.state)
            newDevice.channel.preState = newDevice.channel.state
            newDevice.channel.state = UNIVERSALS.GLOBALS.channelState_e.CH_STATE_OFF
            console.log("newstate to device  " + newDevice.channel.state)
            return ["#0000000000", newDevice]
        }
        // Handles `CH_STATE_RGB` stateObject for RGB device channel
        else if (stateObject.state == UNIVERSALS.GLOBALS.channelState_e.CH_STATE_RGB && newDevice.channel.deviceType == UNIVERSALS.GLOBALS.deviceType_e.deviceType_RGB) {
            if (stateObject?.hsv?.h)
                newDevice.channel.outputChannnel[0].h = stateObject?.hsv?.h
            if (stateObject?.hsv?.s)
                newDevice.channel.outputChannnel[0].s = stateObject?.hsv?.s
            if (stateObject?.hsv?.v)
                newDevice.channel.outputChannnel[0].v = stateObject?.hsv?.v
            newDevice.channel.preState = stateObject.state
            newDevice.channel.state = stateObject.state
            let newHex = hsv2hex_shortRange({ hsv: [newDevice.channel.outputChannnel[0].h, newDevice.channel.outputChannnel[0].s, newDevice.channel.outputChannnel[0].v] })
            return [newHex, newDevice]
        }
        // Handles `CH_STATE_ALL_ON` stateObject for NW4 device channel
        else if (stateObject.state == UNIVERSALS.GLOBALS.channelState_e.CH_STATE_ALL_ON && newDevice.channel.deviceType == UNIVERSALS.GLOBALS.deviceType_e.deviceType_NW4) {
            /**
            * - [ ] get previous brightness from each channel and if brightness is above 10(or minimum limit) than use previous brightness else user preset 80% or anything
            */
            newDevice.channel.preState = stateObject.state
            newDevice.channel.state = stateObject.state
            let newHex = "#5050505000"
            return [newHex, newDevice]
        }
    }
    return [undefined, newDevice]
}




export { _colorSaga_watcher, _colorSaga_action };





