import { put, call, select } from "redux-saga/effects";
import { _delay } from "../../sagas/helper";
import { storeData } from "../../../services/db/storage";
import { _getWorker } from '../../sagas/sagaBaseWorkers'
import { _reduxConstant } from "../../ReduxConstant";
import types from "../../../@types/huelite";
import { _actions as _deviceListReduxAction } from "../reducer"
import { _appState } from "../../rootReducer";
import { logger } from "../../../util/logger";


/*
'########::'########:'##::::'##:'####::'######::'########:'##:::::::'####::'######::'########::::'##::::'##:'########::'########:::::'###::::'########:'########:::::'######:::::'###:::::'######::::::'###::::
 ##.... ##: ##.....:: ##:::: ##:. ##::'##... ##: ##.....:: ##:::::::. ##::'##... ##:... ##..::::: ##:::: ##: ##.... ##: ##.... ##:::'## ##:::... ##..:: ##.....:::::'##... ##:::'## ##:::'##... ##::::'## ##:::
 ##:::: ##: ##::::::: ##:::: ##:: ##:: ##:::..:: ##::::::: ##:::::::: ##:: ##:::..::::: ##::::::: ##:::: ##: ##:::: ##: ##:::: ##::'##:. ##::::: ##:::: ##:::::::::: ##:::..:::'##:. ##:: ##:::..::::'##:. ##::
 ##:::: ##: ######::: ##:::: ##:: ##:: ##::::::: ######::: ##:::::::: ##::. ######::::: ##::::::: ##:::: ##: ########:: ##:::: ##:'##:::. ##:::: ##:::: ######::::::. ######::'##:::. ##: ##::'####:'##:::. ##:
 ##:::: ##: ##...::::. ##:: ##::: ##:: ##::::::: ##...:::: ##:::::::: ##:::..... ##:::: ##::::::: ##:::: ##: ##.....::: ##:::: ##: #########:::: ##:::: ##...::::::::..... ##: #########: ##::: ##:: #########:
 ##:::: ##: ##::::::::. ## ##:::: ##:: ##::: ##: ##::::::: ##:::::::: ##::'##::: ##:::: ##::::::: ##:::: ##: ##:::::::: ##:::: ##: ##.... ##:::: ##:::: ##::::::::::'##::: ##: ##.... ##: ##::: ##:: ##.... ##:
 ########:: ########:::. ###::::'####:. ######:: ########: ########:'####:. ######::::: ##:::::::. #######:: ##:::::::: ########:: ##:::: ##:::: ##:::: ########::::. ######:: ##:::: ##:. ######::: ##:::: ##:
........:::........:::::...:::::....:::......:::........::........::....:::......::::::..:::::::::.......:::..:::::::::........:::..:::::..:::::..:::::........::::::......:::..:::::..:::......::::..:::::..::
*/


interface _deviceListSagaAction_Props {
    deviceList: types.HUE_DEVICE_t[]
    saveToDB?: boolean
    log?: logger
}
/** 
 * `_deviceListSaga_watcher`
 *              - @param saveToDB?: `default - true` wetaher to save to local database or not
 *              - @param log?: logger
 * `_deviceListSaga_action`
 */
const [_deviceListSaga_watcher, _deviceListSaga_action] = _getWorker<_deviceListSagaAction_Props>({
    type: _reduxConstant.DEVICELIST_SAGA,
    callable: function* containersWorker({ deviceList, saveToDB = true, log }) {
        log?.print("newDeviceList >> " + JSON.stringify(deviceList))
        yield put(_deviceListReduxAction.redux({ deviceList, log }));
        if (saveToDB)
            yield put(_________deviceListDB_action({ deviceList, log }));
    }
})

/*
:'######::'####:'##::: ##::'######:::'##:::::::'########::::'########::'########:'##::::'##:'####::'######::'########::::'##::::'##:'########::'########:::::'###::::'########:'########:::::'######:::::'###:::::'######::::::'###::::
'##... ##:. ##:: ###:: ##:'##... ##:: ##::::::: ##.....::::: ##.... ##: ##.....:: ##:::: ##:. ##::'##... ##: ##.....::::: ##:::: ##: ##.... ##: ##.... ##:::'## ##:::... ##..:: ##.....:::::'##... ##:::'## ##:::'##... ##::::'## ##:::
 ##:::..::: ##:: ####: ##: ##:::..::: ##::::::: ##:::::::::: ##:::: ##: ##::::::: ##:::: ##:: ##:: ##:::..:: ##:::::::::: ##:::: ##: ##:::: ##: ##:::: ##::'##:. ##::::: ##:::: ##:::::::::: ##:::..:::'##:. ##:: ##:::..::::'##:. ##::
. ######::: ##:: ## ## ##: ##::'####: ##::::::: ######:::::: ##:::: ##: ######::: ##:::: ##:: ##:: ##::::::: ######:::::: ##:::: ##: ########:: ##:::: ##:'##:::. ##:::: ##:::: ######::::::. ######::'##:::. ##: ##::'####:'##:::. ##:
:..... ##:: ##:: ##. ####: ##::: ##:: ##::::::: ##...::::::: ##:::: ##: ##...::::. ##:: ##::: ##:: ##::::::: ##...::::::: ##:::: ##: ##.....::: ##:::: ##: #########:::: ##:::: ##...::::::::..... ##: #########: ##::: ##:: #########:
'##::: ##:: ##:: ##:. ###: ##::: ##:: ##::::::: ##:::::::::: ##:::: ##: ##::::::::. ## ##:::: ##:: ##::: ##: ##:::::::::: ##:::: ##: ##:::::::: ##:::: ##: ##.... ##:::: ##:::: ##::::::::::'##::: ##: ##.... ##: ##::: ##:: ##.... ##:
. ######::'####: ##::. ##:. ######::: ########: ########:::: ########:: ########:::. ###::::'####:. ######:: ########::::. #######:: ##:::::::: ########:: ##:::: ##:::: ##:::: ########::::. ######:: ##:::: ##:. ######::: ##:::: ##:
:......:::....::..::::..:::......::::........::........:::::........:::........:::::...:::::....:::......:::........::::::.......:::..:::::::::........:::..:::::..:::::..:::::........::::::......:::..:::::..:::......::::..:::::..::
*/


interface _deviceSagaAction_props {
    device: types.HUE_DEVICE_t
    /** `boolean` default `true` if needs to be saved to DB */
    saveToDB?: boolean
    log?: logger
}
/** 
 * @param device
 * @param saveToDB `default true` wetaher to save to local database or not
 * @param log?: logger
 */
const [_deviceSaga_watcher, _deviceSaga_action] = _getWorker<_deviceSagaAction_props>({
    type: _reduxConstant.DEVICE_SAGA,
    callable: function* containersWorker({ device, saveToDB = true, log }) {
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
        if (saveToDB)
            yield put(_________deviceListDB_action({ deviceList: newDeviceList, log }));
    }
})


/*
'########::'########:'##::::'##:'####::'######::'########:'##:::::::'####::'######::'########::::'########::'########::::::'######:::::'###:::::'######::::::'###::::
 ##.... ##: ##.....:: ##:::: ##:. ##::'##... ##: ##.....:: ##:::::::. ##::'##... ##:... ##..::::: ##.... ##: ##.... ##::::'##... ##:::'## ##:::'##... ##::::'## ##:::
 ##:::: ##: ##::::::: ##:::: ##:: ##:: ##:::..:: ##::::::: ##:::::::: ##:: ##:::..::::: ##::::::: ##:::: ##: ##:::: ##:::: ##:::..:::'##:. ##:: ##:::..::::'##:. ##::
 ##:::: ##: ######::: ##:::: ##:: ##:: ##::::::: ######::: ##:::::::: ##::. ######::::: ##::::::: ##:::: ##: ########:::::. ######::'##:::. ##: ##::'####:'##:::. ##:
 ##:::: ##: ##...::::. ##:: ##::: ##:: ##::::::: ##...:::: ##:::::::: ##:::..... ##:::: ##::::::: ##:::: ##: ##.... ##:::::..... ##: #########: ##::: ##:: #########:
 ##:::: ##: ##::::::::. ## ##:::: ##:: ##::: ##: ##::::::: ##:::::::: ##::'##::: ##:::: ##::::::: ##:::: ##: ##:::: ##::::'##::: ##: ##.... ##: ##::: ##:: ##.... ##:
 ########:: ########:::. ###::::'####:. ######:: ########: ########:'####:. ######::::: ##::::::: ########:: ########:::::. ######:: ##:::: ##:. ######::: ##:::: ##:
........:::........:::::...:::::....:::......:::........::........::....:::......::::::..::::::::........:::........:::::::......:::..:::::..:::......::::..:::::..::
*/



const [_deviceListDB_watcher, _________deviceListDB_action] = _getWorker<_deviceListSagaAction_Props>({
    type: _reduxConstant.DEVICELIST_DB_SAGA,
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



export { _deviceListSaga_watcher, _deviceListSaga_action, _deviceSaga_watcher, _deviceSaga_action, _deviceListDB_watcher }