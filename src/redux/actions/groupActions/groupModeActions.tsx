import {_reduxConstant, actionReturnTypes } from "../../ReduxConstant";

/* Sec1: groupPropsModificationAction => saga*/
export interface groupModes_saga_action_propsInterface {
  Mode: string;
  Action?: 0 | 1;
  groupUUID: string;
  deviceMac: string[];
}
export const groupModes_saga_action = ({
  Mode,
  Action = 1,
  groupUUID,
  deviceMac,
}: groupModes_saga_action_propsInterface): actionReturnTypes => {
  return {
    type:_reduxConstant.GROUP_MODES_SAGA,
    props: { Mode, Action, groupUUID, deviceMac },
  };
};

/* Sec1: groupPropsModificationAction => saga*/

export type groupModes_returnActionTypes = {
  type:_reduxConstant.GROUP_MODES_SAGA;
  props: groupModes_saga_action_propsInterface;
};
