import { State } from "react-native-gesture-handler";
import { select } from "redux-saga/effects";
import UNIVERSALS from "../../../@universals";
import { convertHSVToRgbShortRange, convertRGBToHex } from "../../../util/Color";
import { logger } from "../../../@logger";
import { HBSocketList_t } from "../../helperSideEffect/reducers/HBReducer";
import { _reduxConstant } from "../../ReduxConstant";
import { _appState } from "../../rootReducer";
import { _delay } from "../../sagas/helper";
import { _getWorker } from '../../sagas/sagaBaseWorkers';

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
    state: string
    gestureState: number
    channelBrightnessObject?: {
        /** `value` - brightness value for active channels */
        value: number
        /** `activeChannel` array of boolean representing the actie channels at respectives index flagged as true */
        activeChannel?: boolean[]
    }
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
 */
const [_colorSaga_watcher, _colorSaga_action] = _getWorker<_colorAction_Props & {
    comChannel?: com_channels_e
    onActionComplete?: ({ newDeviceList }: onActionCompleted_props) => void
}>({
    type: _reduxConstant.COLOR_UPDATE_SAGA,
    shouldTakeLatest: true,
    callable: function* containersWorker({
        deviceMac,
        state,
        channelBrightnessObject,
        gestureState,
        comChannel,
        onActionComplete,
        log }) {
        log = log ? new logger("COLOR SAGA", log) : undefined
        let _deviceList: HBSocketList_t[] = yield select((state: _appState) => state.HBReducer.HBSocketList)
        let devicelist: UNIVERSALS.GLOBALS.DEVICE_t[] = yield select((state: _appState) => state.deviceReducer.deviceList)
        const newDeviceList = yield Promise.all(devicelist.map(async (device) => {
            if (deviceMac.includes(device.Mac)) {/* check weather this device is present in requested deviceMac array */
                let tempdevice = _deviceList.find(item => item.Mac == device.Mac)
                if (tempdevice?.socket) {/* if device has socket than send the color live */
                    log?.print("sending color to device - " + state)
                    if (state) {
                        tempdevice.socket.send(state)
                    }
                    else if (channelBrightnessObject) {
                        // - [ ] handle channelBrightnessObject and brightness variables
                    }
                } else if (gestureState == State.END && !tempdevice?.socket) {/* if device has no socket than send the color over mqtt only upon gestureState end */
                    log?.print("device has no socket ")
                    // - [ ] send code via mqtt
                }
            }
            return device
        }))
        yield _delay(300)/* wait until gesture interval 200ms exceeds to ensure this next line of code only executes upon gesture end */
        log?.print("[COLOR SAGA] Gesture has ended >> sending Redux Data Update")
        log?.print(JSON.stringify(newDeviceList, null, 2))
        if (onActionComplete)
            onActionComplete({ newDeviceList })
    }
})




export { _colorSaga_watcher, _colorSaga_action };





