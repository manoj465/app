import { State } from "react-native-gesture-handler";
import { put, select } from "redux-saga/effects";
import { types } from "../../../@types/huelite";
import { convertHSVToRgb, convertRGBToHex } from "../../../util/Color";
import { logger } from "../../../util/logger";
import { _appState } from "../../reducers";
import { HBSocketList_t } from "../../reducers/HBReducer";
import { _reduxConstant } from "../../ReduxConstant";
import { _getWorker } from '../../sagas/sagaBaseWorkers';
import { _deviceListSaga_action } from "./deviceList";


export interface _colorAction_Props {
    deviceMac: string[]
    conUUID?: string
    hsv: { h?: number, s?: number, v?: number }
    gestureState: number
    log?: logger
}

const [_colorSaga_watcher, _colorSaga_action] = _getWorker<_colorAction_Props>({
    type: _reduxConstant.COLOR_UPDATE_SAGA,
    shouldTakeLatest: true,
    callable: function* containersWorker({ deviceMac, hsv: { h, s, v }, gestureState, log }) {
        const list: { Mac: string, socket: WebSocket | null }[] = []
        let _deviceList: HBSocketList_t[] = yield select((state: _appState) => state.HBReducer.HBSocketList)
        let devicelist: types.HUE_DEVICE_t[] = yield select((state: _appState) => state.deviceReducer.deviceList)
        const newDeviceList = yield Promise.all(devicelist.map(async device => {
            let deviceMatched = false
            deviceMac.forEach(mac => {
                if (mac == device.Mac) {
                    deviceMatched = true
                }
            })
            if (deviceMatched) {
                h = h != undefined ? h : device.hsv.h
                s = s != undefined ? s : device.hsv.s
                v = v != undefined ? v : device.hsv.v
                let socket: WebSocket
                _deviceList.forEach(item => {
                    if (item.Mac == device.Mac && item.socket) {
                        socket = item.socket
                    }
                })
                if (socket) {
                    log?.print("sending color to device " + h + " " + s + " " + v)
                    socket.send(convertRGBToHex(convertHSVToRgb(h, s, v)))
                }
                else {
                    log?.print("device has no socket ")
                    if (gestureState == State.END) {
                        //TODO send code via mqtt
                    }
                }
            }
            return { ...device, hsv: { h, s, v } }
        }))
        if (gestureState == State.END) {
            log?.print("[COLOR SAGA] Gesture has ended >> sending Redux Data Update")
            log?.printDeviceList(newDeviceList)
            yield put(_deviceListSaga_action({ deviceList: newDeviceList, log }))
        }
    }
})




export { _colorSaga_watcher, _colorSaga_action };





