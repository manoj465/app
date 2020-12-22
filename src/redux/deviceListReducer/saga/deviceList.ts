import { put, call, select } from "redux-saga/effects";
import { _delay } from "../../sagas/helper";
import { storeData } from "../../../services/db/storage";
import { _getWorker } from '../../sagas/sagaBaseWorkers'
import { _reduxConstant } from "../../ReduxConstant";
import { types } from "../../../@types/huelite";
import { _actions as _deviceListReduxAction } from "../reducer"
import { _appState } from "../../reducers";
import { logger } from "../../../util/logger";


interface _deviceListSagaAction_Props {
    deviceList: types.HUE_DEVICE_t[]
    persistent?: boolean
    log?: logger
}

const [_deviceListSaga_watcher, _deviceListSaga_action] = _getWorker<_deviceListSagaAction_Props>({
    type: _reduxConstant.DEVICELIST_SAGA,
    callable: function* containersWorker({ deviceList, persistent = true, log }) {
        log?.addStack("DEVICELIST SAGA WORKER")
        log?.print("newDeviceList >> " + JSON.stringify(deviceList))
        yield put(_deviceListReduxAction.redux({ deviceList, log }));
        if (persistent)
            yield put(_deviceListDB_action({ deviceList, log }));
        log?.removeStack()
    }
})

interface _deviceSagaAction_props {
    device: types.HUE_DEVICE_t
    persistent?: boolean
    log?: logger
}
const [_deviceSaga_watcher, _deviceSaga_action] = _getWorker<_deviceSagaAction_props>({
    type: _reduxConstant.DEVICE_SAGA,
    callable: function* containersWorker({ device, persistent = true, log }) {
        log?.addStack("DEVICE SAGA WORKER")
        log?.print("container list > " + JSON.stringify(device))
        let deviceUpdated = false
        //const newDeviceList = []
        let devicelist: types.HUE_DEVICE_t[] = yield select((state: _appState) => state.deviceReducer.deviceList)
        const newDeviceList = devicelist.map(_device => {
            if (_device.Mac == device.Mac) {
                deviceUpdated = true
                return device
            }
            return _device
        })
        if (!deviceUpdated)
            newDeviceList.push(device)
        yield put(_deviceListReduxAction.redux({ deviceList: newDeviceList, log }));
        if (persistent)
            yield put(_deviceListDB_action({ deviceList: newDeviceList, log }));
        log?.removeStack()
    }
})


const [_deviceListDB_watcher, _deviceListDB_action] = _getWorker<_deviceListSagaAction_Props>({
    type: _reduxConstant.DEVICELIST_CONTAINERS_DB_SAGA,
    callable: function* containersDBWorker({ deviceList, log }) {
        log?.addStack("DEVICE DB SAGA WORKER")
        yield call(_delay, 2000);
        const newdeviceList = deviceList.map((_device, d_index) => {
            return {
                ..._device,
                socket: null
            }
        });
        log?.print("now storing containers to DB >> " + JSON.stringify(newdeviceList))
        yield storeData("deviceList", newdeviceList);
        log?.removeStack()
    }
})



export { _deviceListSaga_watcher, _deviceListSaga_action, _deviceSaga_watcher, _deviceSaga_action, _deviceListDB_watcher/* , _deviceListDB_action */ }