import types from "../../../@types/huelite";
import { storeData } from "../../../services/db/storage";
import { logger } from "../../../util/logger";
import { _reduxConstant } from "../../ReduxConstant";
import { appCtxDBAction } from "../saga/appCTXSagas"
import { _getBaseAction, __baseAction_Props } from "../../sagas/sagaBaseWorkers";

export interface appCTXReducerState_Prop {
  welcomeScreenStatus: boolean
  user?: types.HUE_USER_t
}

export const initialState: appCTXReducerState_Prop = {
  welcomeScreenStatus: false,
  user: undefined
};

export const appCTXReducer = (
  state = initialState,
  action: _actionReturnTypes
) => {
  switch (action.type) {
    case _reduxConstant.USER_REDUX:
      action.props.log?.print("state before change >> " + JSON.stringify(state))
      const __state = Object.assign({}, state, { user: action.props.user });
      action.props.log?.print("state after change >> " + JSON.stringify(__state))
      return __state;

    case _reduxConstant.APPCTX_REDUX:
      action.props.log?.print("appCtxRedux state for update>> " + JSON.stringify(state))
      if (action.props.data)
        return action.props.data
      else
        return state
      break;

    default:
      return state;
  }
};

interface userReduxAction_Props {
  user?: types.HUE_USER_t
  log?: logger
}
interface appCtxReduxAction_Props {
  data: appCTXReducerState_Prop
  log?: logger
}
export const _actions = {
  userRedux: _getBaseAction<userReduxAction_Props>(_reduxConstant.USER_REDUX),
  appCTXRedux: _getBaseAction<appCtxReduxAction_Props>(_reduxConstant.APPCTX_REDUX)
}

export type _actionReturnTypes =
  | __baseAction_Props<userReduxAction_Props> & {
    type: _reduxConstant.USER_REDUX
  } | __baseAction_Props<appCtxReduxAction_Props> & {
    type: _reduxConstant.APPCTX_REDUX
  }