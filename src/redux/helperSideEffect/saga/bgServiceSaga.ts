import { put, select, takeLatest } from "redux-saga/effects";
import types from "../../../@types/huelite";
import api from "../../../services/api";
import { deviceSocketHBResponse, getWebSocket } from "../../../services/backGroundServices/webSocket";
import { getCurrentTimeStamp } from "../../../util/DateTimeUtil";
import { logger } from "../../../util/logger";
import { _appState } from "../../rootReducer";
import { HBSocketList_t, _actions } from "../reducers/HBReducer";
import { _reduxConstant } from "../../ReduxConstant";
import { _getWorker } from "../../sagas/sagaBaseWorkers";



interface bgServiceSagaAction_porps {
    log?: logger
}
export const [bgServiceWatcher, bgServiceSagaAction] = _getWorker<bgServiceSagaAction_porps>({
    type: _reduxConstant.BG_SERVICE_SAGA,
    shouldTakeLatest: true,
    callable: function* containersWorker({ log }) {
        //log?.print("bgService : : >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
        let _deviceList: types.HUE_DEVICE_t[] = yield select((state: _appState) => state.deviceReducer.deviceList)
        let socketContainer: HBSocketList_t[] = yield select((state: _appState) => state.HBReducer.HBSocketList)
        if (_deviceList.length) {
            _deviceList.forEach(async device => {
                //log?.print("device : " + device.Mac + ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
                const localSocketContainer = socketContainer.find(item => item.Mac == device.Mac)
                if (localSocketContainer?.socket) {
                    //log("device : " + device.Mac + " has socket")
                } else {
                    let socket = null
                    let res = await api.deviceAPI.authAPI.v1({ IP: device.IP })
                    //log("res for device : " + device.Mac + " >> " + JSON.stringify(res))
                    if (res.RES?.Mac == device.Mac) {
                        //log(device.ts + "getting socket for device : " + device.Mac)
                        try {
                            socket = await getWebSocket({
                                ipAddr: device.IP,
                                onOpen: () => {
                                    //log("WS Connected for Devie >> " + device.Mac);
                                },
                                onMsg: (msg) => {
                                    try {
                                        const data: deviceSocketHBResponse | null = msg
                                            ? JSON.parse(msg)
                                            : null;
                                        put(_actions.HBMsgRec({
                                            Mac: device.Mac,
                                            lastMsgRecTs: getCurrentTimeStamp()
                                        }))
                                        //log("SOCKET MSG >> " + JSON.stringify(data))
                                    } catch (error) {
                                        console.log(error);
                                    }
                                },
                                onErr: (e) => {
                                    log?.print("Ws Error - " + e);
                                    put(_actions.HBSocket({ Mac: device.Mac, socket: null }))
                                },
                                onClose: () => {
                                    put(_actions.HBSocket({ Mac: device.Mac, socket: null }))
                                },
                            })
                            if (socket) {
                                log?.print("updating HBsocket list for device : " + device.Mac)
                                put(_actions.HBSocket({ Mac: device.Mac, socket }))
                            }
                        } catch (error) {
                            log?.print("get socket error")
                        }
                    } else {
                        log?.print(device.ts + "no response from Auth api")
                    }
                }

            })
        }
    }
})