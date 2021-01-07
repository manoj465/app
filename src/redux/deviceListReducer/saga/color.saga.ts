import { State } from "react-native-gesture-handler";
import { put, select } from "redux-saga/effects";
import { types } from "../../../@types/huelite";
import { convertHSVToRgbShortRange, convertRGBToHex } from "../../../util/Color";
import { logger } from "../../../util/logger";
import { _appState } from "../../rootReducer";
import { HBSocketList_t } from "../../helperSideEffect/reducers/HBReducer";
import { _reduxConstant } from "../../ReduxConstant";
import { _delay } from "../../sagas/helper";
import { _getWorker } from '../../sagas/sagaBaseWorkers';
import { _deviceListSaga_action } from "./deviceList";


export interface _colorAction_Props {
    deviceMac: string[]
    hsv: { h?: number, s?: number, v?: number }
    gestureState: number
    log?: logger
}

const [_colorSaga_watcher, _colorSaga_action] = _getWorker<_colorAction_Props>({
    type: _reduxConstant.COLOR_UPDATE_SAGA,
    shouldTakeLatest: true,
    callable: function* containersWorker({ deviceMac, hsv: { h, s, v }, gestureState, log }) {
        log = log ? new logger("COLOR SAGA", log) : undefined
        const list: { Mac: string, socket: WebSocket | null }[] = []
        let _deviceList: HBSocketList_t[] = yield select((state: _appState) => state.HBReducer.HBSocketList)
        let devicelist: types.HUE_DEVICE_t[] = yield select((state: _appState) => state.deviceReducer.deviceList)
        const newDeviceList = yield Promise.all(devicelist.map(async device => {
            if (deviceMac.includes(device.Mac)) {/* check weather this device is present in requested deviceMac array */
                h = h != undefined ? h : device.hsv.h
                s = s != undefined ? s : device.hsv.s
                v = v != undefined ? v : device.hsv.v
                let tempdevice = _deviceList.find(item => item.Mac == device.Mac)
                if (tempdevice) {
                    if (tempdevice.socket) {/* if device has socket than send the color live */
                        log?.print("sending color to device " + h + " " + s + " " + v)
                        let tempCol = convertRGBToHex(convertHSVToRgbShortRange(h, s, v))
                        tempdevice.socket.send(tempCol)
                    }
                    else {/* if device has no socket than send the color over mqtt only upon gestureState end */
                        log?.print("device has no socket ")
                        if (gestureState == State.END) {
                            //TODO send code via mqtt
                        }
                    }
                }
            }
            return { ...device, hsv: { h, s, v } }
        }))
        yield _delay(500)/* wait for the gesture to end befire sending  */
        log?.print("[COLOR SAGA] Gesture has ended >> sending Redux Data Update")
        log?.printDeviceList(newDeviceList)
        yield put(_deviceListSaga_action({ deviceList: newDeviceList, log }))
    }
})




export { _colorSaga_watcher, _colorSaga_action };





