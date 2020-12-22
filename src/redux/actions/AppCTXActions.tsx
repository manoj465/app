import { _reduxConstant } from "../ReduxConstant";
import { appCTXType } from "../reducers/AppCTXReducer";
import { timerType } from "../../util/dummyData/timerTypes";
import { types } from "../../@types/huelite";
import { logFun_t } from "../../util/logger";
/* Sec1:  appCTXAction*/
export interface appCTXAction_Props {
  appCTX: any;
}
export const appCTXAction = ({
  appCTX,
}: appCTXAction_Props): appCTX_actionsReturnTypes => {
  return {
    type: _reduxConstant.APP_CTX,
    props: { appCTX },
  };
};
/* Sec2: */
export interface timerDialogShowHideReduxAction_Props {
  showTimerDialog: boolean;
  timer?: timerType;
}
export const timerDialogShowHideReduxAction = ({
  showTimerDialog,
  timer = undefined,
}: timerDialogShowHideReduxAction_Props): appCTX_actionsReturnTypes => {
  return {
    type: _reduxConstant.TIMER_DIALOG_SHOW_HIDE_REDUX_ACTION,
    props: { showTimerDialog, timer },
  };
};

/* Sec3: WelcomeScreenStatus_CTX_ReduxAction */
export interface WelcomeScreenStatusCTXReduxAction_Props {
  welcomeScreenStatus: boolean;
}
export const WelcomeScreenStatusCTXReduxAction = ({
  welcomeScreenStatus,
}: WelcomeScreenStatusCTXReduxAction_Props): appCTX_actionsReturnTypes => {
  return {
    type: _reduxConstant.APPCTX_WELCOMESCREEN_STATUS,
    props: { welcomeScreenStatus },
  };
};

export const appCTXUpdateAction = () => {
  return {
    type: _reduxConstant.APP_CTX_UPDATE,
  };
};

export type appCTX_actionsReturnTypes =
  | {
    type: _reduxConstant.APP_CTX;
    props: appCTXAction_Props;
  }
  | {
    type: _reduxConstant.TIMER_DIALOG_SHOW_HIDE_REDUX_ACTION;
    props: timerDialogShowHideReduxAction_Props;
  }
  | {
    type: _reduxConstant.APPCTX_WELCOMESCREEN_STATUS;
    props: WelcomeScreenStatusCTXReduxAction_Props;
  }
