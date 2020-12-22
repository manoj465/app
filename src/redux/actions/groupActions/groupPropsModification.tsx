import { deviceContainerType } from "../../../util/dummyData/DummyData";
import { actionReturnTypes,_reduxConstant } from "../../ReduxConstant";

/* Sec1: groupPropsModificationAction => saga*/
export interface groupPropsModification_saga_action_propsInterface {
  newGroup: deviceContainerType;
  pre_groupUUID: string;
}
export const groupPropsModification_saga_action = ({
  newGroup,
  pre_groupUUID,
}: groupPropsModification_saga_action_propsInterface): actionReturnTypes => {
  return {
    type:_reduxConstant.GROUP_MODIFICATION_SAGA,
    props: { newGroup, pre_groupUUID },
  };
};

/* Sec1: groupPropsModificationAction => saga*/

export type groupPropsModification_returnActionTypes = {
  type:_reduxConstant.GROUP_MODIFICATION_SAGA;
  props: groupPropsModification_saga_action_propsInterface;
};
