
import { types } from "../../@types/huelite";
import { deviceType, GROUP_TYPES } from "../../util/dummyData/DummyData";
import { actionReturnTypes, _reduxConstant } from "../ReduxConstant";

export interface newDeviceSagaAction_Props {
  newCon: types.HUE_CONTAINER_t;
}
export const newDeviceSagaAction = ({
  newCon,
}: newDeviceSagaAction_Props): actionReturnTypes => {
  return {
    type:_reduxConstant.NEW_DEVICE_SAGA,
    props: { newCon },
  };
};

export interface newDeviceReduxAction_Props {
  newCon: types.HUE_CONTAINER_t
}
export const newDeviceReduxAction = ({
  newCon
}: newDeviceReduxAction_Props): actionReturnTypes => {
  return {
    type:_reduxConstant.NEW_DEVICE_REDUX,
    props: { newCon },
  };
};

export type Pairing_actionReturnTypes =
  | {
    type:_reduxConstant.NEW_DEVICE_SAGA;
    props: newDeviceSagaAction_Props;
  }
  | {
    type:_reduxConstant.NEW_DEVICE_REDUX;
    props: newDeviceReduxAction_Props;
  };
