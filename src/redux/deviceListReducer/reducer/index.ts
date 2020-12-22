import { _reduxConstant } from "../../ReduxConstant";
import { logFun_t, logger } from "../../../util/logger";
import { types } from "../../../@types/huelite";
import { _getBaseAction, __baseAction_Props } from "../../sagas/sagaBaseWorkers";


export interface _reducer_i {
  deviceList: types.HUE_DEVICE_t[]
}

export const initialState: _reducer_i = {
  deviceList: [],
};

export const _reducer = (
  state: _reducer_i = initialState,
  action: _actionReturnTypes
) => {
  switch (action.type) {

    case _reduxConstant.DEVICELIST_REDUX:
      action.props.log?.print("[DEVICELIST-REDUX-REDUCER] ")
      action.props.log?.print("updating new newDeviceList to store >> " + JSON.stringify(action.props.deviceList))
      return Object.assign({}, state, { deviceList: action.props.deviceList })
      break;

    default:
      return state;
  }
};


/************************************************************************************************************************* 
 * /// container Redux Actions
 *************************************************************************************************************************/
interface _containersReduxAction_Props {
  deviceList: types.HUE_DEVICE_t[];
  log?: logger
}
export const _actions = { redux: _getBaseAction<_containersReduxAction_Props>(_reduxConstant.DEVICELIST_REDUX) }

export type _actionReturnTypes =
  | __baseAction_Props<_containersReduxAction_Props> & {
    type: _reduxConstant.DEVICELIST_REDUX
  }
