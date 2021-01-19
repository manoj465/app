import { _reduxConstant } from "../../ReduxConstant";
import { _getBaseAction, __baseAction_Props } from "../../sagas/sagaBaseWorkers";
import { logger } from "../../../util/logger";
import UNIVERSALS from "../../../@universals";
import { getData, storeData } from "../../../services/db/storage";


export interface _reducer_i {
  deviceList: UNIVERSALS.GLOBALS.DEVICE_t[]
  deletedDevices: UNIVERSALS.GLOBALS.DEVICE_t[]
}

export const initialState: _reducer_i = {
  deviceList: [],
  deletedDevices: []
};

export const _reducer = (
  state: _reducer_i = initialState,
  action: _actionReturnTypes
) => {
  switch (action.type) {

    case _reduxConstant.DEVICELIST_REDUX:
      action.props.log?.print("updating new newDeviceList to store >> " + JSON.stringify(action.props.deviceList))
      return Object.assign({}, state, { deviceList: action.props.deviceList.length ? [...action.props.deviceList] : [] })
      break;

    case _reduxConstant.DELETED_DEVICELIST_REDUX:
      action.props.log?.print("updating DELETED DeviceList to store >> " + JSON.stringify(action.props.deletedDeviceList))
      if (!action.props.isDbState)
        storeData("deletedDeviceList", action.props.deletedDeviceList)
      return Object.assign({}, state, { deletedDevices: action.props.deletedDeviceList.length ? [...action.props.deletedDeviceList] : [] })
      break;

    default:
      return state;
  }
};


/************************************************************************************************************************* 
 * /// container Redux Actions
 *************************************************************************************************************************/
interface _deviceListReduxAction_Props {
  deviceList: UNIVERSALS.GLOBALS.DEVICE_t[];
  log?: logger
}
interface _deletedDeviceListReduxAction_Props {
  deletedDeviceList: UNIVERSALS.GLOBALS.DEVICE_t[];
  isDbState?: boolean
  log?: logger
}
export const _actions = {
  deviceListRedux: _getBaseAction<_deviceListReduxAction_Props>(_reduxConstant.DEVICELIST_REDUX),
  deletedDeviceListRedux: _getBaseAction<_deletedDeviceListReduxAction_Props>(_reduxConstant.DELETED_DEVICELIST_REDUX)
}

export type _actionReturnTypes =
  | __baseAction_Props<_deviceListReduxAction_Props> & {
    type: _reduxConstant.DEVICELIST_REDUX
  }
  | __baseAction_Props<_deletedDeviceListReduxAction_Props> & {
    type: _reduxConstant.DELETED_DEVICELIST_REDUX
  }
