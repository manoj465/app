import { timerType, timerType__1_1 } from "../../util/dummyData/timerTypes";
import { actionReturnTypes,_reduxConstant } from "../ReduxConstant";

export interface timerSagaAction_Props {
  timer: timerType;
  groupUUID: string;
}
export const groupTimerSagaAction = ({
  timer,
  groupUUID,
}: timerSagaAction_Props): actionReturnTypes => {
  return {
    type:_reduxConstant.GROUP_TIMER_SAGA,
    props: { timer, groupUUID },
  };
};

export interface timerReduxAction_Props {
  timer: timerType;
  groupUUID: string;
  devicesMac: string[];
}
export const groupTimerReduxAction = ({
  timer,
  groupUUID,
  devicesMac,
}: timerReduxAction_Props): __actionReturnTypes => {
  return {
    type:_reduxConstant.GROUP_TIMER_REDUX,
    props: { timer, groupUUID, devicesMac },
  };
};

export interface deviceTimerSagaAction_Props {
  timer: timerType__1_1;
  groupUUID: string;
}
export const deviceTimerSagaAction = ({
  timer,
  groupUUID,
}: deviceTimerSagaAction_Props): __actionReturnTypes => {
  return {
    type:_reduxConstant.DEVICE_TIMER_SAGA,
    props: { timer, groupUUID, },
  };
};

export type timer_actionReturnTypes =
  | {
    type:_reduxConstant.GROUP_TIMER_SAGA;
    props: timerSagaAction_Props;
  }
  | {
    type:_reduxConstant.GROUP_TIMER_REDUX;
    props: timerReduxAction_Props;
  }
  | {
    type:_reduxConstant.DEVICE_TIMER_SAGA,
    props: deviceTimerSagaAction_Props;
  };
