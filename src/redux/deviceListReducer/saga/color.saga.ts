import { State } from "react-native-gesture-handler";
import { put, select } from "redux-saga/effects";
import { convertHSVToRgbShortRange, convertRGBToHex } from "../../../util/Color";
import { logger } from "../../../util/logger";
import { _appState } from "../../rootReducer";
import { HBSocketList_t } from "../../helperSideEffect/reducers/HBReducer";
import { _reduxConstant } from "../../ReduxConstant";
import { _delay } from "../../sagas/helper";
import { _getWorker } from '../../sagas/sagaBaseWorkers';
import { _deviceListSaga_action } from "./deviceList";
import UNIVERSALS from "../../../@universals";

interface beforeUpdateProps {
    /** previous state of the device */
    preDeviceState: UNIVERSALS.GLOBALS.DEVICE_t,
    /** update state of the device, in this case with updated color/hsv code */
    newDeviceState: UNIVERSALS.GLOBALS.DEVICE_t
}
interface onActionCompleted_props {
    newDeviceList: UNIVERSALS.GLOBALS.DEVICE_t[]
}
export interface _colorAction_Props {
    deviceMac: string[]
    hsv: { h?: number, s?: number, v?: number }
    gestureState: number
    beforeUpdate?: ({ preDeviceState, newDeviceState }: beforeUpdateProps) => UNIVERSALS.GLOBALS.DEVICE_t
    onActionComplete?: ({ newDeviceList }: onActionCompleted_props) => void
    log?: logger
}

const [_colorSaga_watcher, _colorSaga_action] = _getWorker<_colorAction_Props>({
    type: _reduxConstant.COLOR_UPDATE_SAGA,
    shouldTakeLatest: true,
    callable: function* containersWorker({
        deviceMac,
        hsv: { h, s, v },
        gestureState,
        beforeUpdate = ({ newDeviceState }) => { return newDeviceState },
        onActionComplete,
        log }) {
        log = log ? new logger("COLOR SAGA", log) : undefined
        const list: { Mac: string, socket: WebSocket | null }[] = []
        let _deviceList: HBSocketList_t[] = yield select((state: _appState) => state.HBReducer.HBSocketList)
        let devicelist: UNIVERSALS.GLOBALS.DEVICE_t[] = yield select((state: _appState) => state.deviceReducer.deviceList)
        const newDeviceList = yield Promise.all(devicelist.map(async device => {
            if (deviceMac.includes(device.Mac)) {/* check weather this device is present in requested deviceMac array */
                h = h != undefined ? h : device.hsv.h
                s = s != undefined ? s : device.hsv.s
                v = v != undefined ? v : device.hsv.v
                let tempdevice = _deviceList.find(item => item.Mac == device.Mac)
                if (tempdevice?.socket) {/* if device has socket than send the color live */
                    log?.print("sending color to device " + h + " " + s + " " + v)
                    //@ts-ignore
                    let tempCol = convertRGBToHex(convertHSVToRgbShortRange(h, s, v))
                    tempdevice.socket.send(tempCol)
                } else if (gestureState == State.END && !tempdevice?.socket) {/* if device has no socket than send the color over mqtt only upon gestureState end */
                    log?.print("device has no socket ")
                    // - [ ] send code via mqtt
                }
                return beforeUpdate({ preDeviceState: device, newDeviceState: { ...device, hsv: { h, s, v }, localTimeStamp: Math.floor(Date.now() / 1000) } })
            }
            return device
        }))
        yield _delay(500)/* wait for the gesture to end befire sending  */
        log?.print("[COLOR SAGA] Gesture has ended >> sending Redux Data Update")
        log?.print(JSON.stringify(newDeviceList, null, 2))
        if (onActionComplete)
            onActionComplete({ newDeviceList })
    }
})




export { _colorSaga_watcher, _colorSaga_action };





