import { call, put } from "redux-saga/effects";
import { _getWorker } from "../../sagas/sagaBaseWorkers";
import { saveAppCTX } from "../../../services/db/storage";
import { _reduxConstant } from "../../ReduxConstant";
import { _delay } from "../../sagas/helper";
import { logger } from "../../../util/logger";
import { appCTXReducerState_Prop, _actions } from "../reducers/AppCTXReducer"
import { _appState } from "../../rootReducer"


interface appCtxSaga_props {
  data: appCTXReducerState_Prop
  saveToDB?: boolean
  log?: logger
}

export const [appCtxDBWatcher, appCtxDBAction] = _getWorker<appCtxSaga_props>({
  type: _reduxConstant.APPCTX_DB_SAGA,
  shouldTakeLatest: true,
  callable: function* appCtxDbWorker({ log, data }) {
    console.log("appctxDB waiting to save: " + JSON.stringify(data))
    yield call(_delay, 1000);
    console.log("appctxDB now saving: " + JSON.stringify(data))
    yield call(saveAppCTX, data);
  }
})

export const [appCtxSagaWatcher, appCtxSagaAction] = _getWorker<appCtxSaga_props>({
  type: _reduxConstant.APPCTX_SAGA,
  shouldTakeLatest: true,
  callable: function* appCtxSagaWorker(props) {
    console.log("appctx Saga : " + JSON.stringify(props.data))
    yield put(_actions.appCTXRedux(props))
    if (props.saveToDB)
      yield put(appCtxDBAction({ data: props.data, log: props.log }))
  }
})
