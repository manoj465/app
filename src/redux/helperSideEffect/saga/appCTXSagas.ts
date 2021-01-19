import { call, put, select } from "redux-saga/effects";
import { _getWorker } from "../../sagas/sagaBaseWorkers";
import { saveAppCTX } from "../../../services/db/storage";
import { _reduxConstant } from "../../ReduxConstant";
import { _delay } from "../../sagas/helper";
import { logger } from "../../../util/logger";
import { appCTXReducerState_Prop, _actions } from "../reducers/AppCTXReducer"
import { _appState } from "../../rootReducer"
import UNIVERSALS from "../../../@universals";


/*
:::'###::::'########::'########:::'######::'########:'##::::'##::::'########::'########::::::'######:::::'###:::::'######::::::'###::::
::'## ##::: ##.... ##: ##.... ##:'##... ##:... ##..::. ##::'##::::: ##.... ##: ##.... ##::::'##... ##:::'## ##:::'##... ##::::'## ##:::
:'##:. ##:: ##:::: ##: ##:::: ##: ##:::..::::: ##:::::. ##'##:::::: ##:::: ##: ##:::: ##:::: ##:::..:::'##:. ##:: ##:::..::::'##:. ##::
'##:::. ##: ########:: ########:: ##:::::::::: ##::::::. ###::::::: ##:::: ##: ########:::::. ######::'##:::. ##: ##::'####:'##:::. ##:
 #########: ##.....::: ##.....::: ##:::::::::: ##:::::: ## ##:::::: ##:::: ##: ##.... ##:::::..... ##: #########: ##::: ##:: #########:
 ##.... ##: ##:::::::: ##:::::::: ##::: ##:::: ##::::: ##:. ##::::: ##:::: ##: ##:::: ##::::'##::: ##: ##.... ##: ##::: ##:: ##.... ##:
 ##:::: ##: ##:::::::: ##::::::::. ######::::: ##:::: ##:::. ##:::: ########:: ########:::::. ######:: ##:::: ##:. ######::: ##:::: ##:
..:::::..::..:::::::::..::::::::::......::::::..:::::..:::::..:::::........:::........:::::::......:::..:::::..:::......::::..:::::..::
*/


interface appCtxSaga_props {
  data: appCTXReducerState_Prop
  saveToDB?: boolean
  log?: logger
}

export const [appCtxDBWatcher, appCtxDBAction] = _getWorker<appCtxSaga_props>({
  type: _reduxConstant.APPCTX_DB_SAGA,
  shouldTakeLatest: true,
  callable: function* appCtxDbWorker({ log, data }) {
    log?.print("appctxDB waiting to save: " + JSON.stringify(data))
    yield call(_delay, 1000);
    log?.print("appctxDB now saving: " + JSON.stringify(data))
    yield call(saveAppCTX, data);
  }
})


/*
:::'###::::'########::'########:::'######::'########:'##::::'##:::::'######:::::'###:::::'######::::::'###::::
::'## ##::: ##.... ##: ##.... ##:'##... ##:... ##..::. ##::'##:::::'##... ##:::'## ##:::'##... ##::::'## ##:::
:'##:. ##:: ##:::: ##: ##:::: ##: ##:::..::::: ##:::::. ##'##:::::: ##:::..:::'##:. ##:: ##:::..::::'##:. ##::
'##:::. ##: ########:: ########:: ##:::::::::: ##::::::. ###:::::::. ######::'##:::. ##: ##::'####:'##:::. ##:
 #########: ##.....::: ##.....::: ##:::::::::: ##:::::: ## ##:::::::..... ##: #########: ##::: ##:: #########:
 ##.... ##: ##:::::::: ##:::::::: ##::: ##:::: ##::::: ##:. ##:::::'##::: ##: ##.... ##: ##::: ##:: ##.... ##:
 ##:::: ##: ##:::::::: ##::::::::. ######::::: ##:::: ##:::. ##::::. ######:: ##:::: ##:. ######::: ##:::: ##:
..:::::..::..:::::::::..::::::::::......::::::..:::::..:::::..::::::......:::..:::::..:::......::::..:::::..::
*/


export const [appCtxSagaWatcher, appCtxSagaAction] = _getWorker<appCtxSaga_props>({
  type: _reduxConstant.APPCTX_SAGA,
  shouldTakeLatest: true,
  callable: function* appCtxSagaWorker(props) {
    props.log?.print("appctx Saga : " + JSON.stringify(props.data))
    yield put(_actions.appCTXRedux(props))
    if (props.saveToDB)
      yield put(appCtxDBAction({ data: props.data/* , log: props.log */ }))
  }
})


/*
'##::::'##::'######::'########:'########::::::'######:::::'###:::::'######::::::'###::::
 ##:::: ##:'##... ##: ##.....:: ##.... ##::::'##... ##:::'## ##:::'##... ##::::'## ##:::
 ##:::: ##: ##:::..:: ##::::::: ##:::: ##:::: ##:::..:::'##:. ##:: ##:::..::::'##:. ##::
 ##:::: ##:. ######:: ######::: ########:::::. ######::'##:::. ##: ##::'####:'##:::. ##:
 ##:::: ##::..... ##: ##...:::: ##.. ##:::::::..... ##: #########: ##::: ##:: #########:
 ##:::: ##:'##::: ##: ##::::::: ##::. ##:::::'##::: ##: ##.... ##: ##::: ##:: ##.... ##:
. #######::. ######:: ########: ##:::. ##::::. ######:: ##:::: ##:. ######::: ##:::: ##:
:.......::::......:::........::..:::::..::::::......:::..:::::..:::......::::..:::::..::
*/

interface userSaga_props {
  user: UNIVERSALS.GLOBALS.USER_t | undefined
  /** `default - false` weather to save to DB or not */
  saveToDB?: boolean
  log?: logger
}
export const [userSagaWatcher, userSagaAction] = _getWorker<userSaga_props>({
  type: _reduxConstant.USER_SAGA,
  shouldTakeLatest: true,
  callable: function* appCtxSagaWorker(props) {
    console.log("user Saga : " + JSON.stringify(props.user))
    let appCtx: appCTXReducerState_Prop = yield select((state: _appState) => state.appCTXReducer)
    let newappCtx: appCTXReducerState_Prop = Object.assign({}, appCtx, { user: { ...props.user, devices: [] } })
    yield put(_actions.appCTXRedux({ data: newappCtx }))
    if (props.saveToDB)
      yield put(appCtxDBAction({ data: newappCtx, log: props.log }))
  }
})