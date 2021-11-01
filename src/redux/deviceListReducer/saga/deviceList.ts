import { put, call, select } from 'redux-saga/effects';
import { _delay } from '../../sagas/helper';
import { storeData } from '../../../services/db/storage';
import { _getWorker } from '../../sagas/sagaBaseWorkers';
import { _reduxConstant } from '../../ReduxConstant';
import { _actions as _deviceListReduxAction } from '../reducer';
import { _appState } from '../../rootReducer';
import { logger } from '../../../@logger';
import UNIVERSALS from '../../../@universals';

interface _deviceListSagaAction_Props {
  deviceList: DEVICE_t[];
  saveToDB?: boolean;
  log?: logger;
}
/**
 * - @param saveToDB?: `default - true` wetaher to save to local database or not
 * - @param log?: logger
 */
const [_deviceListSaga_watcher, _deviceListSaga_action] = _getWorker<_deviceListSagaAction_Props>({
  type: _reduxConstant.DEVICELIST_SAGA,
  callable: function* containersWorker({ deviceList, saveToDB = true, log }) {
    log?.print('newDeviceList >> ' + JSON.stringify(deviceList));
    yield put(
      _deviceListReduxAction.deviceListRedux({
        deviceList,
        log: log ? new logger('DEVICELIST-REDUX-REDUCER', log) : undefined,
      })
    );
    if (saveToDB) yield put(_________deviceListDB_action({ deviceList, log }));
  },
});

const [_deviceListDB_watcher, _________deviceListDB_action] = _getWorker<_deviceListSagaAction_Props>({
  type: _reduxConstant.DEVICELIST_DB_SAGA,
  callable: function* containersDBWorker({ deviceList, log }) {
    log?.print('DEVICE DB SAGA WORKER');
    yield call(_delay, 1000);
    log?.print('now storing containers to DB >> ' + JSON.stringify(deviceList));
    yield storeData('deviceList_v2', deviceList);
  },
});

export { _deviceListSaga_watcher, _deviceListSaga_action, _deviceListDB_watcher };
