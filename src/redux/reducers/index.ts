const { combineReducers } = require("redux");
import { _reducer as deviceReducer, reducer_i as deviceReducer_i, initialState as deviceListInitailState } from "../deviceListReducer";
import { appCTXReducer, appCTXReducerState_Prop, initialState as appCtxInitailState, _actionReturnTypes as appCTX_actionReturnTypes, _actions as appCTX_actions } from "./AppCTXReducer";
import { _actionReturnTypes as HBReducer_actionReturnTypes, _actions as HBReducer_actions } from "./HBReducer";
import { HBReducer, HBReducerReducerState_Prop, initialState as HBInitailState } from "./HBReducer";

const initialState: _appState = {
  deviceReducer: deviceListInitailState,
  appCTXReducer: appCtxInitailState,
  HBReducer: HBInitailState
}

function rootReducer(state = initialState, action: any) {
  return {
    deviceReducer: deviceReducer(state.deviceReducer, action),
    appCTXReducer: appCTXReducer(state.appCTXReducer, action),
    HBReducer: HBReducer(state.HBReducer, action),
  };
}

export type _appState = {
  deviceReducer: deviceReducer_i;
  appCTXReducer: appCTXReducerState_Prop;
  HBReducer: HBReducerReducerState_Prop;
};

export type _actionReturnTypes = | appCTX_actionReturnTypes | HBReducer_actionReturnTypes

export const _actions = { appCTX: appCTX_actions, HBReducer: HBReducer_actions }

export default rootReducer;
