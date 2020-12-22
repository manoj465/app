import { takeLatest } from "redux-saga/effects";
import api from "../../../services/api";
import { deviceSocketHBResponse, getWebSocket } from "../../../services/backGroundServices/webSocket";
import { getCurrentTimeStamp } from "../../../util/DateTimeUtil";
import { logFun } from "../../../util/logger";
import { reduxStore } from "../../index";
import { _reduxConstant } from "../../ReduxConstant";
import { bgServiceSagaAction_porps } from "../actions/bgServiceActions";




/** @method -BG_SERVICE_SAGA_ACTION_LISTNER */
export function* watchBGServiceAction() {
    //@ts-ignore
    yield takeLatest(_reduxConstant.BG_SERVICE_SAGA, bgServiceWorker);
}

/** @method -BG_SERVICE_SAGA_WORKER_FUNCTION
 *
 **/
interface devicesWorker_Props {
    props: bgServiceSagaAction_porps;
}
function* bgServiceWorker({
    props: { _log },
}: devicesWorker_Props) {
    const log = logFun("BG SERVICE SAGA", _log)
    console.log("bgService : : >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
    yield reduxStore.store.getState().deviceReducer.deviceList.forEach(async device => {
        let socketContainer = reduxStore.store.getState().HBReducer.HBSocketList.filter(item => item.Mac == device.Mac)
        console.log("device : " + device.Mac + ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
        if (socketContainer[0]?.socket) {
            log("device : " + device.Mac + " has socket")
        } else {
            let socket = null
            let res = await api.v1.deviceAPI.authAPI(device.IP)
            //log("res for device : " + device.Mac + " >> " + JSON.stringify(res))
            if (res.RES?.Mac == device.Mac) {
                log(device.ts + "getting socket for device : " + device.Mac)
                try {
                    socket = await getWebSocket({
                        Mac: device.Mac,
                        ipAddr: device.IP,
                        onOpen: () => {
                            //log("WS Connected for Devie >> " + device.Mac);
                        },
                        onMsg: (msg) => {
                            const d = getCurrentTimeStamp();
                            try {
                                const data: deviceSocketHBResponse | null = msg
                                    ? JSON.parse(msg)
                                    : null;
                                reduxStore.store.dispatch(reduxStore.actions.HBReducer.HBMsgRec({
                                    Mac: device.Mac,
                                    lastMsgRecTs: getCurrentTimeStamp()
                                }))
                                //log("SOCKET MSG >> " + JSON.stringify(data))
                            } catch (error) {
                                console.log(error);
                            }
                        },
                        onErr: (e) => {
                            log("Ws Error - " + e);
                            reduxStore.store.dispatch(reduxStore.actions.HBReducer.HBSocket({ Mac: device.Mac, socket: null }))
                        },
                        onClose: () => {
                            reduxStore.store.dispatch(reduxStore.actions.HBReducer.HBSocket({ Mac: device.Mac, socket: null }))
                        },
                    })
                    if (socket) {
                        log("updating HBsocket list for device : " + device.Mac)
                        reduxStore.store.dispatch(reduxStore.actions.HBReducer.HBSocket({ Mac: device.Mac, socket }))
                    }
                } catch (error) {
                    log("get socket error")
                }
            } else {
                log(device.ts + "no response from Auth api")
            }
        }

    })
}








/* reduxStore.store.getState().deviceReducer.containers.forEach(async (container, c_index) => {
           const newDeviceList: HUE_DEVICE_t[] = []
           container.devices.forEach(async (device, d_index) => {
               setTimeout(() => {
                   log("checking device : " + device.Mac)
               }, 1000);
               newDeviceList.push(device)
           })
           newContainerList.push({ ...container, devices: newDeviceList })
       }) */