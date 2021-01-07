const { combineReducers } = require("redux");
import { initialState as deviceListInitailState, _reducer as deviceReducer } from "./deviceListReducer";
import { _reducer_i as deviceReducer_i } from "./deviceListReducer/reducer/index";
import { appCTXReducer, appCTXReducerState_Prop, initialState as appCtxInitailState, } from "./helperSideEffect/reducers/AppCTXReducer";
import { HBReducer, HBReducerReducerState_Prop, initialState as HBInitailState, } from "./helperSideEffect/reducers/HBReducer";


export interface _appState {
  deviceReducer: deviceReducer_i;
  appCTXReducer: appCTXReducerState_Prop;
  HBReducer: HBReducerReducerState_Prop;
};
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

export default rootReducer


