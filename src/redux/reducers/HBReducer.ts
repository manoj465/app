import { _reduxConstant } from "../ReduxConstant";
import { storeData } from "../../services/db/storage";
import { HBDeviceListReturnTypes } from "../actions/HBDeviceListActions";
import { timerType } from "../../util/dummyData/timerTypes";
import { getCurrentTimeStamp } from "../../util/DateTimeUtil";
import { act } from "react-test-renderer";
import { types } from "../../@types/huelite";
import { logger } from "../../util/logger";
import { _getBaseAction, __baseAction_Props } from "../sagas/sagaBaseWorkers";
import device from "../../services/api/v1/device";

type HBDeviceList_msgSentType = {
  Mac: string;
  lastMsgSentTs: number;
};

type HBDeviceList_msgRecType = {
  Mac: string;
  lastMsgRecTs: number;
};

export interface HBSocketList_t {
  Mac: string
  socket?: WebSocket | null
  //hsv?: { h: number, s: number, v: number }
}

export interface HBReducerReducerState_Prop {
  HBSocketList: HBSocketList_t[]
  HBDevieclist_msgSent: HBDeviceList_msgSentType[]
  HBDevieclist_msgRec: HBDeviceList_msgRecType[]
}

export const initialState: HBReducerReducerState_Prop = {
  HBSocketList: [],
  HBDevieclist_msgSent: [],
  HBDevieclist_msgRec: [],
};

export const HBReducer = (
  state = initialState,
  action: _actionReturnTypes
) => {
  switch (action.type) {
    case _reduxConstant.HB_DEVICE_LIST_REDUX:
      const data = Object.assign({}, state, {
        HBDevieclist_msgSent: action.props.HBDeviceList.HBDevieclist_msgSent,
        HBDevieclist_msgRec: action.props.HBDeviceList.HBDevieclist_msgRec
      });
      return data;

    case _reduxConstant.HB_DEVICELIST_MSG_SENT_TS:
      let deviceFound = false
      const newList = state.HBDevieclist_msgSent.map((item, index) => {
        if (item.Mac == action.props.Mac) {
          deviceFound = true
          item.lastMsgSentTs = action.props.lastMsgSentTs
        }
        return item
      })
      if (!deviceFound) {
        newList.push({ Mac: action.props.Mac, lastMsgSentTs: action.props.lastMsgSentTs })
      }
      return Object.assign({}, state, { HBDevieclist_msgSent: newList })
      break;

    case _reduxConstant.HB_DEVICELIST_MSG_REC_TS:
      let _deviceFound = false
      const _newList = state.HBDevieclist_msgRec.map((item, index) => {
        if (item.Mac == action.props.Mac) {
          _deviceFound = true
          item.lastMsgRecTs = action.props.lastMsgRecTs
        }
        return item
      })
      if (!_deviceFound) {
        _newList.push({ Mac: action.props.Mac, lastMsgRecTs: action.props.lastMsgRecTs })
      }
      return Object.assign({}, state, { HBDeviceList_msgRecType: _newList })
      break;

    case _reduxConstant.HB_SOCKET_LIST:
      let __deviceFound = false
      const __newList = state.HBSocketList.map((item, index) => {
        if (item.Mac == action.props.Mac) {
          __deviceFound = true
          return Object.assign({}, item, { socket: action.props.socket })
        }
        return item
      })
      if (!__deviceFound) {
        __newList.push({ Mac: action.props.Mac, socket: action.props.socket })
      }
      console.log("SOCKET LIST LENGTH >> " + __newList.length)
      return Object.assign({}, state, { HBSocketList: __newList })
      break;

    default:
      return state;
  }
};



interface HBDeviceListReduxAction_Props {
  HBDeviceList: HBReducerReducerState_Prop;
}
export const _actions = {
  HBList: _getBaseAction<HBDeviceListReduxAction_Props>(_reduxConstant.HB_DEVICE_LIST_REDUX),
  HBMsgSent: _getBaseAction<HBDeviceList_msgSentType>(_reduxConstant.HB_DEVICELIST_MSG_SENT_TS),
  HBMsgRec: _getBaseAction<HBDeviceList_msgRecType>(_reduxConstant.HB_DEVICELIST_MSG_REC_TS),
  HBSocket: _getBaseAction<HBSocketList_t>(_reduxConstant.HB_SOCKET_LIST)
}

export type _actionReturnTypes =
  | __baseAction_Props<HBDeviceListReduxAction_Props> & {
    type: _reduxConstant.HB_DEVICE_LIST_REDUX
  }
  | __baseAction_Props<HBDeviceList_msgSentType> & {
    type: _reduxConstant.HB_DEVICELIST_MSG_SENT_TS
  }
  | __baseAction_Props<HBDeviceList_msgRecType> & {
    type: _reduxConstant.HB_DEVICELIST_MSG_REC_TS
  }
  | __baseAction_Props<HBSocketList_t> & {
    type: _reduxConstant.HB_SOCKET_LIST
  }