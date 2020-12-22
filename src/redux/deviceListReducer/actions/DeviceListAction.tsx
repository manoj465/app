import { deviceContainerType } from "../../../util/dummyData/DummyData";
import { actionReturnTypes, _reduxConstant } from "../../ReduxConstant";
import { HUE_CONTAINER_t } from "../../../@types/huelite/globalTypes";
import { logFun_t } from "../../../util/logger";


export interface brightnessUpdateSagaAction_Props {
  value: number;
  deviceMac: string[];
  groupUUID: string;
}
/** @deprecated */
export const brightnessUpdateSagaAction = ({
  value,
  deviceMac,
  groupUUID,
}: brightnessUpdateSagaAction_Props): actionReturnTypes => {
  return {
    type: _reduxConstant.BRIGHTNESS_UPDATE_SAGA,
    props: { value, deviceMac, groupUUID },
  };
};
/* -----------------Sec4:: DEVICELIST UPDTAE => redux || saga----------------- */
///saga
export interface deviceListSagaAction_Props {
  deviceList: deviceContainerType[];
}
/** @deprecated */
export const deviceListSagaAction = ({
  deviceList,
}: deviceListSagaAction_Props): actionReturnTypes => {
  return {
    type: _reduxConstant.DEVICELIST_SAGA,
    props: { deviceList },
  } as const;
};
///redux
interface deviceListReduxAction_Props {
  deviceList: deviceContainerType[];
}
/** @deprecated */
export const deviceListReduxAction = ({
  deviceList,
}: deviceListReduxAction_Props): actionReturnTypes => {
  return {
    type: _reduxConstant.DEVICELIST_REDUX,
    props: { deviceList },
  } as const;
};
///DB-saga
export interface updateDeviceListDB_sagaActionPorps {
  deviceList: deviceContainerType[];
}
/** @deprecated */
export const updateDeviceListDB_sagaAction = ({
  deviceList,
}: updateDeviceListDB_sagaActionPorps): actionReturnTypes => {
  return {
    type: _reduxConstant.DEVICELIST_DB,
    props: { deviceList: deviceList },
  };
};
/* -----------------Sec4:: DEVICELIST UPDTAE => redux || saga----------------- */






/* -----------------Sec3: EXPORT DEVICE_LIST_ACTION_TYPE----------------- */
export const _actions = {}


export type _actionReturnTypes =
  | {
    type: _reduxConstant.DEVICELIST_REDUX;
    props: deviceListReduxAction_Props;
  }
  | {
    type: _reduxConstant.DEVICELIST_DB;
    props: updateDeviceListDB_sagaActionPorps;
  }
  | {
    type: _reduxConstant.DEVICELIST_SAGA;
    props: deviceListSagaAction_Props;
  }
  | {
    type: _reduxConstant.BRIGHTNESS_UPDATE_SAGA;
    props: { value: number; deviceMac: string[]; groupUUID: string };
  } 
