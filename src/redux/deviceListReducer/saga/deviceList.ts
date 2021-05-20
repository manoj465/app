import { put, call, select } from "redux-saga/effects";
import { _delay } from "../../sagas/helper";
import { storeData } from "../../../services/db/storage";
import { _getWorker } from '../../sagas/sagaBaseWorkers'
import { _reduxConstant } from "../../ReduxConstant";
import { _actions as _deviceListReduxAction } from "../reducer"
import { _appState } from "../../rootReducer";
import { logger } from "../../../@logger";
import UNIVERSALS from "../../../@universals";


interface _deviceListSagaAction_Props {
    deviceList: UNIVERSALS.GLOBALS.DEVICE_t[]
    saveToDB?: boolean
    log?: logger
}
/** 
 * - @param saveToDB?: `default - true` wetaher to save to local database or not
 * - @param log?: logger
 */
const [_deviceListSaga_watcher, _deviceListSaga_action] = _getWorker<_deviceListSagaAction_Props>({
    type: _reduxConstant.DEVICELIST_SAGA,
    callable: function* containersWorker({ deviceList, saveToDB = true, log }) {
        log?.print("newDeviceList >> " + JSON.stringify(deviceList))
        yield put(_deviceListReduxAction.deviceListRedux({ deviceList, log: log ? new logger("DEVICELIST-REDUX-REDUCER", log) : undefined }));
        if (saveToDB)
            yield put(_________deviceListDB_action({ deviceList, log }));
    }
})



/** 
 * @param device
 * @param saveToDB `default true` wetaher to save to local database or not
 * @param log?: logger
 */
interface _deviceSagaAction_props {
    device: UNIVERSALS.GLOBALS.DEVICE_t
    saveToDB?: boolean // `boolean` default `true` if needs to be saved to DB 
    log?: logger
}
const [_deviceSaga_watcher, _deviceSaga_action] = _getWorker<_deviceSagaAction_props>({
    type: _reduxConstant.DEVICE_SAGA,
    callable: function* containersWorker({ device, saveToDB = true, log }) {
        log?.print("updaing device > " + JSON.stringify(device))
        // @-#todo convert `select` to `redoxStore.state.deviceReducer.deviceList`
        let devicelist: UNIVERSALS.GLOBALS.DEVICE_t[] = yield select((state: _appState) => state.deviceReducer.deviceList)
        let preDevice = devicelist.find(item => item.Mac == device.Mac)
        if (preDevice) {
            log?.print("updating device")
            devicelist = devicelist.map(_device => {
                if (_device.Mac == device.Mac) {
                    return device
                }
                return _device
            })
        }
        else {
            log?.print("adding device as new")
            devicelist.push(device)
        }
        yield put(_deviceListReduxAction.deviceListRedux({ deviceList: devicelist, log }));
        if (saveToDB)
            yield put(_________deviceListDB_action({ deviceList: devicelist, log }));
    }
})



const [_deviceListDB_watcher, _________deviceListDB_action] = _getWorker<_deviceListSagaAction_Props>({
    type: _reduxConstant.DEVICELIST_DB_SAGA,
    callable: function* containersDBWorker({ deviceList, log }) {
        log?.print("DEVICE DB SAGA WORKER")
        yield call(_delay, 1000);
        log?.print("now storing containers to DB >> " + JSON.stringify(deviceList))
        yield storeData("deviceList", deviceList);
    }
})



export { _deviceListSaga_watcher, _deviceListSaga_action, _deviceSaga_watcher, _deviceSaga_action, _deviceListDB_watcher }