import { put, takeEvery, all, call, takeLatest } from "redux-saga/effects";
import { _delay } from "../index";
import { _reduxConstant } from "../../ReduxConstant";
import { deviceTimerSagaAction_Props, timerSagaAction_Props } from "../../actions/timerActions";
import { store } from "../../../../App";
import { deviceListSagaAction } from "../../deviceListReducer/actions/DeviceListAction";
import { timerDialogShowHideReduxAction } from "../../actions/AppCTXActions";
import { createTimerWithDeviceMac } from "../../../services/gql_n_rest/timer_gql_n_rest";



interface deviceTimerWorker_Props {
    props: deviceTimerSagaAction_Props;
}

function* deviceTimerWorker({
    props: { timer, groupUUID, },
}: deviceTimerWorker_Props) {
    const log = (s: string) => { true && console.log("[[ CREATE/UPDATE DEVICE TIMER ]] " + s) }
    log("")
    const updatedDeviceList = store
        .getState()
        .deviceReducer.deviceList.map((groupFromStore, groupFromStoreIndex) => {
            return Object.assign({}, groupFromStore,
                {
                    devices: groupFromStore.groupUUID == groupUUID ? groupFromStore.devices.map((deviceFromStore, deviceFromStore_index) => {
                        return Object.assign({}, deviceFromStore, {
                            timers: (
                                (Array.isArray(timer.deviceMac) && timer.deviceMac.includes(deviceFromStore.Mac)) ||
                                (!Array.isArray(timer.deviceMac) && timer.deviceMac == deviceFromStore.Mac)
                            ) ? (() => {
                                if (timer?.id) {
                                    /* TODO update timer */
                                    log("request came for updating timer for Mac : " + deviceFromStore.Mac + ", timer : " + timer.id + " -- " + timer.timerUUID)
                                } else {
                                    /* TODO create timer */
                                    log("request came for creating new timer for device -- " + deviceFromStore.Mac + " -- " + deviceFromStore.deviceName)
                                    createTimerWithDeviceMac({
                                        data: {
                                            Mac: deviceFromStore.Mac,
                                            HR: timer.HR,
                                            MIN: timer.MIN,
                                            DT: timer.DT,
                                            ET: timer.ET,
                                            DAYS: timer.DAYS,
                                            TS: timer.ldb.TS,
                                            DBS: timer.ldb.DBS,
                                            DST: timer.ldb.DST
                                        }
                                    }, log)
                                        .then(() => { })
                                        .catch(() => { })
                                }
                            })() : deviceFromStore.timers
                        })
                    }) : groupFromStore.devices,
                    timers: groupFromStore.groupUUID == groupUUID ? groupFromStore.timers.map((groupTimerFromStore, groupTimerFromStore_index) => {
                        return groupTimerFromStore;
                    }) : groupFromStore.timers
                })
        })

    /* yield put(deviceListSagaAction({ deviceList: updatedDeviceList }));
    yield put(
        timerDialogShowHideReduxAction({ showTimerDialog: false, timer: undefined })
    ); */
}


export function* deviceTimerWatcher() {
    yield takeLatest(_reduxConstant.DEVICE_TIMER_SAGA, deviceTimerWorker);
}