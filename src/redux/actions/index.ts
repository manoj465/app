import { _actionReturnTypes as reducer_actionReturnTypes } from "../reducers";
import { _actionReturnTypes as deviceActionReturnTypes } from "../deviceListReducer"
import { groupModes_returnActionTypes } from "./groupActions/groupModeActions";
import { groupPropsModification_returnActionTypes } from "./groupActions/groupPropsModification";
import { Pairing_actionReturnTypes } from "./pairingActions";
import { timer_actionReturnTypes } from "./timerActions";
import { HBDeviceListReturnTypes } from "./HBDeviceListActions";

export type _actionReturnTypes =
  | deviceActionReturnTypes
  | reducer_actionReturnTypes
  | Pairing_actionReturnTypes
  | groupPropsModification_returnActionTypes
  | groupModes_returnActionTypes
  | timer_actionReturnTypes
  | HBDeviceListReturnTypes;


export default {}