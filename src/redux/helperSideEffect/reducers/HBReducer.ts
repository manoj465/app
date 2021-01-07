import { _reduxConstant } from "../../ReduxConstant";
import { _getBaseAction, __baseAction_Props } from "../../sagas/sagaBaseWorkers";

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
    case _reduxConstant.HB_DEVICELIST_REDUX:
      const data = Object.assign({}, state, {
        HBDevieclist_msgSent: action.props.HBDeviceList.HBDevieclist_msgSent,
        HBDevieclist_msgRec: action.props.HBDeviceList.HBDevieclist_msgRec
      });
      return data;

    case _reduxConstant.HB_DEVICELIST_MSG_SENT:
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

    case _reduxConstant.HB_DEVICELIST_MSG_REC:
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
  HBList: _getBaseAction<HBDeviceListReduxAction_Props>(_reduxConstant.HB_DEVICELIST_REDUX),
  HBMsgSent: _getBaseAction<HBDeviceList_msgSentType>(_reduxConstant.HB_DEVICELIST_MSG_SENT),
  HBMsgRec: _getBaseAction<HBDeviceList_msgRecType>(_reduxConstant.HB_DEVICELIST_MSG_REC),
  HBSocket: _getBaseAction<HBSocketList_t>(_reduxConstant.HB_SOCKET_LIST)
}

export type _actionReturnTypes =
  | __baseAction_Props<HBDeviceListReduxAction_Props> & {
    type: _reduxConstant.HB_DEVICELIST_REDUX
  }
  | __baseAction_Props<HBDeviceList_msgSentType> & {
    type: _reduxConstant.HB_DEVICELIST_MSG_SENT
  }
  | __baseAction_Props<HBDeviceList_msgRecType> & {
    type: _reduxConstant.HB_DEVICELIST_MSG_REC
  }
  | __baseAction_Props<HBSocketList_t> & {
    type: _reduxConstant.HB_SOCKET_LIST
  }