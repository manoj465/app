import { select } from "redux-saga/effects";
import { reduxStore } from "../..";
import UNIVERSALS from "../../../@universals";
import api from "../../../services/api";
import { deviceSocketHBResponse, getWebSocket } from "../../../services/backGroundServices/webSocket";
import { appOperator } from "../../../util/app.operator";
import { getCurrentTimeStampInSeconds } from "../../../util/DateTimeUtil";
import { logger } from "../../../util/logger";
import { _deviceSaga_action } from "../../deviceListReducer/saga/deviceList";
import { _reduxConstant } from "../../ReduxConstant";
import { _appState } from "../../rootReducer";
import { _getWorker } from "../../sagas/sagaBaseWorkers";
import { HBSocketList_t, _actions } from "../reducers/HBReducer";



interface bgServiceSagaAction_porps {
    iteration: number
    log?: logger
}
export const [bgServiceWatcher, bgServiceSagaAction] = _getWorker<bgServiceSagaAction_porps>({
    type: _reduxConstant.BG_SERVICE_SAGA,
    shouldTakeLatest: true,
    callable: function* containersWorker({ iteration, log }) {
        try {
            let _deviceList: UNIVERSALS.GLOBALS.DEVICE_t[] = yield select((state: _appState) => state.deviceReducer.deviceList)
            log?.print(iteration + " - bgService : : >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> : devicelist length - " + _deviceList.length)
            performSideEffects({
                user: reduxStore.store.getState().appCTXReducer.user,
                iteration,
                //log: log ? new logger("performSideEffect", log) : undefined
            })
            let socketContainer: HBSocketList_t[] = yield select((state: _appState) => state.HBReducer.HBSocketList)
            if (_deviceList.length) {
                _deviceList.forEach(async device => {
                    handleDeviceInMapLoop({
                        device,
                        iteration,
                        user: reduxStore.store.getState().appCTXReducer.user,
                        //log: log ? new logger("handle_device_in_loop", log) : undefined
                    })
                    const localSocketContainer = socketContainer.find(item => item.Mac == device.Mac)
                    if (localSocketContainer?.socket) {
                        log?.print("device : " + device.Mac + " has socket")
                    } else {
                        let socket = null
                        let res = await api.deviceAPI.authAPI.v1({
                            IP: device.IP,
                            log: log ? new logger("authAPI", log) : undefined
                        })
                        log?.print("authAPI from device : " + device.Mac + " >> " + JSON.stringify(res))
                        if (res.RES?.Mac == device.Mac) {
                            log?.print(device.ts + "getting socket for device : " + device.Mac)
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
                                            reduxStore.store.dispatch(_actions.HBSocket({ item: { Mac: device.Mac, lastMsgRecTs: getCurrentTimeStampInSeconds() } }))
                                            //log("SOCKET MSG >> " + JSON.stringify(data))
                                        } catch (error) {
                                            console.log(error);
                                        }
                                    },
                                    onErr: (e) => {
                                        log?.print("Ws Error - " + JSON.stringify(e));
                                        reduxStore.store.dispatch(_actions.HBSocket({ item: { Mac: device.Mac, socket: undefined } }))
                                    },
                                    onClose: () => {
                                        reduxStore.store.dispatch(_actions.HBSocket({ item: { Mac: device.Mac, socket: undefined } }))
                                    },
                                })
                                if (socket) {
                                    log?.print("updating HBsocket list for device : " + device.Mac)
                                    reduxStore.store.dispatch(_actions.HBSocket({ item: { Mac: device.Mac, socket, lastMsgRecTs: getCurrentTimeStampInSeconds() } }))
                                } else {
                                    log?.print("no socket : " + device.Mac)
                                }
                            } catch (error) {
                                log?.print("get socket error")
                            }
                        } else {
                            //log?.print("no response from Auth api")
                        }
                    }

                })
            }
        } catch (error) {
            log?.print("try-catch error")
            log?.print(error)
        }
    }
})

/**
 * @description performs data sideEffects for app and Cloud state sync
 * 
 * @responsiblities
 * - [ ] onFirstIteration get cloudState and operate upon data
 *      - [ ] remove deleted devices from user DataSetdevicesList
 */
const performSideEffects = async ({ user, iteration, log }: { user?: UNIVERSALS.GLOBALS.USER_t, iteration: number, log?: logger }) => {
    if ((iteration == 0 || iteration % 5 == 0) && user?.id) {
        log?.print("fetching user")
        const userRes = await api.cloudAPI.user.userQuery.v1({
            id: user.id,
            log: log ? new logger("userQueryAPI", log) : undefined
        })
        log?.print("userQueryRes " + JSON.stringify(userRes, null, 2))
        if (userRes.RES?.id) {
            appOperator.userStoreUpdateFunction({ user: UNIVERSALS.GLOBALS.convert_user_backendToLocal({ user: userRes.RES }) })
        }
        if (userRes.RES?.devices) {
            appOperator.device({
                cmd: "ADD_UPDATE_DEVICES",
                cloudState: true,
                newDevices: userRes.RES.devices ? UNIVERSALS.GLOBALS.convert_Devices_backendToLocal({ devices: userRes.RES.devices }) : [],
                //log: log ? new logger("device-operator add_update_devices", log) : undefined
            })
        }
    }
}


const handleDeviceInMapLoop = ({ device, user, iteration, log }: { device: UNIVERSALS.GLOBALS.DEVICE_t, user?: UNIVERSALS.GLOBALS.USER_t, iteration: number, log?: logger }) => {
    if (user?.id) {
        if (!device.id) /** create device or sync ID */ {
            (async () => {
                log?.print("getting device ID for device " + device.Mac + " - " + device.deviceName)
                const res = await api.cloudAPI.device.deviceQueryWithMac.v1({ device, log: log ? new logger("device_query Api", log) : undefined })
                if (res.RES?.id && device.Mac == res.RES.Mac) {
                    // - [ ] compare both local and api response data and save the latest one to redux store
                    appOperator.device({
                        cmd: "ADD_UPDATE_DEVICES",
                        newDevices: [{ ...UNIVERSALS.GLOBALS.convert_Device_backendToLocal({ device: res.RES }), localTimeStamp: device.localTimeStamp }],
                        log: log ? new logger("device-operator add/update devices", log) : undefined
                    })
                }
                else if (res.ERR?.errCode == api.cloudAPI.device.deviceQueryWithMac.deviceQueryWithMacApiErrors_e.DEVICE_QUERY_NO_DEVICES_FOUND) {
                    //@ts-ignore - [error]=> due to user.id(could be undefined) field. [resolution]=> but we have already check for user.id field at the begning of the method
                    const createDeviceApiRes = await api.cloudAPI.device.createDeviceMutation.v1({ device, userID: user.id, log: log ? new logger("device_create_mutation Api", log) : undefined })
                    if (createDeviceApiRes.RES)
                        appOperator.device({
                            cmd: "ADD_UPDATE_DEVICES",
                            newDevices: [{ ...UNIVERSALS.GLOBALS.convert_Device_backendToLocal({ device: createDeviceApiRes.RES }), localTimeStamp: device.localTimeStamp }],
                            log: log ? new logger("device-operator add/update devices", log) : undefined
                        })
                }
            })()
        }
        else if (!device.ts || (device.ts && device.localTimeStamp > device.ts)) /** sync local state with cloud */
            (async () => {
                log?.print(device.deviceName + " time to sync, localTimeStamp : " + device.localTimeStamp + ", serverTimestamp : " + device.ts)
                if (device.id) {
                    let updateApiRes = await api.cloudAPI.device.updateDeviceMutation.v1({ device: { ...device, id: device.id }, log: log ? new logger("update device api", log) : undefined })
                    if (updateApiRes.RES) {
                        log?.print("updated device serverts : " + updateApiRes.RES.ts)
                        appOperator.device({
                            cmd: "ADD_UPDATE_DEVICES",
                            newDevices: [{ ...UNIVERSALS.GLOBALS.convert_Device_backendToLocal({ device: updateApiRes.RES }), localTimeStamp: device.localTimeStamp }],
                            log: log ? new logger("update device saga", log) : undefined
                        })
                    }
                }
            })()
    }
}