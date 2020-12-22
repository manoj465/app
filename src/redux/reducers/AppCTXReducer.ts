import { _reduxConstant } from "../ReduxConstant";
import { storeData } from "../../services/db/storage";
import { appCTX_actionsReturnTypes } from "../actions/AppCTXActions";
import { timerType } from "../../util/dummyData/timerTypes";
import { HUE_TIMER_t, HUE_USER_t } from "../../@types/huelite/globalTypes";
import { logFun_t } from "../../util/logger";
import { types } from "../../@types/huelite";
import { _getBaseAction, __baseAction_Props } from "../sagas/sagaBaseWorkers";

export type appCTXType = {
  welcomeScreenStatus: boolean;
};

export interface appCTXReducerState_Prop {
  appCTX: appCTXType;
  timerDialog: {
    showTimerDialog: boolean;
    timer: HUE_TIMER_t | undefined;
  };
  user: HUE_USER_t | undefined
}

export const initialState: appCTXReducerState_Prop = {
  appCTX: {
    welcomeScreenStatus: false,
  },
  timerDialog: { showTimerDialog: false, timer: undefined },
  user: undefined
};

export const appCTXReducer = (
  state = initialState,
  action: _actionReturnTypes
) => {
  switch (action.type) {
    case _reduxConstant.APP_CTX:
      console.log("<<<<<<<<<<<<<APPCTX REDUCER>>>>>>>>>");
      //console.log("PROP STATE " + JSON.stringify(action.props.appCTX));
      //console.log("PRE STATE " + JSON.stringify(state));
      const data = Object.assign({}, state, action.props.appCTX);
      //console.log("UPDATED db STATE " + JSON.stringify(data));
      storeData("appCTX", data);
      return data;

    case _reduxConstant.TIMER_DIALOG_SHOW_HIDE_REDUX_ACTION:
      console.log("<<<<<<<<<<TIMER SHOW/HIDE REDUX>>>>>>>>>>>>>");
      console.log("PRE APPCTX" + JSON.stringify(state));
      const updatedState = Object.assign({}, state, {
        timerDialog: {
          showTimerDialog: action.props.showTimerDialog,
          timer: action.props.timer,
        },
      });
      console.log("UPDATED APPCTX" + JSON.stringify(updatedState));
      return updatedState;

    case _reduxConstant.APPCTX_WELCOMESCREEN_STATUS:
      const _state = Object.assign({}, state, {
        appCTX: {
          ...state.appCTX,
          welcomeScreenStatus: action.props.welcomeScreenStatus,
        },
      });
      storeData("appCTX", _state);
      return _state;

    case _reduxConstant.APPCTX_USER_REDUX:
      const log: logFun_t = (s) => { action.props.log && action.props.log("[USER REDUX RESOLVER] " + s) }
      log("state before change >> " + JSON.stringify(state))
      const __state = Object.assign({}, state, {
        user: { ...action.props.user, devices: [] }
      });
      log("state after change >> " + JSON.stringify(__state))
      storeData("appCTX", __state);
      return __state;

    default:
      return state;
  }
};

interface appCtxUserReduxAction_Props {
  user: types.HUE_USER_t;
  log?: logFun_t
}
export const _actions = { userRedux: _getBaseAction<appCtxUserReduxAction_Props>(_reduxConstant.APPCTX_USER_REDUX) }

export type _actionReturnTypes =
  | __baseAction_Props<appCtxUserReduxAction_Props> & {
    type: _reduxConstant.APPCTX_USER_REDUX
  }