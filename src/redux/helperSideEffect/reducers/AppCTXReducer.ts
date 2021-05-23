import { logger } from '../../../@logger';
import UNIVERSALS from '../../../@universals';
import { uuidv4_8 } from '../../../util/UUID_utils';
import { _reduxConstant } from '../../ReduxConstant';
import { _getBaseAction, __baseAction_Props } from '../../sagas/sagaBaseWorkers';

interface quickIcons_i {
  stayAwake?: boolean;
}
export enum notificationType_e {
  NORMAL,
  ALERT,
  ERROR,
  SUCCESS,
}
export interface notification_props {
  id: String;
  topic: 'PAIRING' | 'UNIVERSAL';
  title: String;
  subTitle?: String;
  color?: String;
  type?: notificationType_e;
}
export interface appCTXReducerState_Prop {
  welcomeScreenStatus: boolean;
  user?: UNIVERSALS.GLOBALS.USER_t;
  quickActions: quickIcons_i;
  notifications: notification_props[];
}

export const initialState: appCTXReducerState_Prop = {
  welcomeScreenStatus: false,
  user: undefined,
  quickActions: {},
  notifications: [],
};

export const appCTXReducer = (state = initialState, action: _actionReturnTypes) => {
  switch (action.type) {
    case _reduxConstant.USER_REDUX:
      action.props.log?.print('state before change >> ' + JSON.stringify(state));
      const __state = Object.assign({}, state, { user: action.props.user });
      action.props.log?.print('state after change >> ' + JSON.stringify(__state));
      return __state;

    case _reduxConstant.APPCTX_REDUX:
      action.props.log?.print('appCtxRedux state for update>> ' + JSON.stringify(state));
      if (action.props.data) return Object.assign({}, state, action.props.data);
      else return state;
      break;

    case _reduxConstant.APPCTX_QUICK_ACTIONS_REDUX:
      action.props.log?.print('appCtxRedux state for update>> ' + JSON.stringify(state));
      return Object.assign({}, state, { quickActions: { ...state.quickActions, ...action.props.data } });
      break;

    case _reduxConstant.APPCTX_NOTIFICATIONS:
      let newState = state;
      if (action.props.notifications) newState = Object.assign({}, state, { notifications: action.props.notifications });
      else if (action.props.removeNotificationWithId) {
        newState = Object.assign({}, state, {
          notifications: state.notifications.filter((item) => item.id != action.props.removeNotificationWithId),
        });
      } else if (action.props.newNotification) {
        let newArray: any[] | undefined = undefined;
        if (state.notifications.length >= 2) {
          newArray = [];
          state.notifications.forEach((item, index) => {
            if (index > 0 && newArray) newArray.push(item);
          });
        }
        newState = Object.assign({}, state, {
          notifications: newArray
            ? newArray
            : [
                ...state.notifications,
                {
                  id: uuidv4_8(),
                  title: action.props.newNotification.title,
                  subTitle: action.props.newNotification.subTitle,
                  topic: action.props.newNotification.topic,
                  color: action.props.newNotification.color,
                  type: action.props.newNotification.type,
                },
              ],
        });
      }
      return newState;

      break;

    default:
      return state;
  }
};

interface userReduxAction_Props {
  user?: UNIVERSALS.GLOBALS.USER_t;
  log?: logger;
}
interface appCtxReduxAction_Props {
  data: appCTXReducerState_Prop;
  log?: logger;
}
export const _actions = {
  userRedux: _getBaseAction<userReduxAction_Props>(_reduxConstant.USER_REDUX),
  appCTXRedux: _getBaseAction<appCtxReduxAction_Props>(_reduxConstant.APPCTX_REDUX),
  quickActionsRedux: _getBaseAction<{ data: quickIcons_i } & { log?: logger }>(_reduxConstant.APPCTX_QUICK_ACTIONS_REDUX),
  notificationsRedux: _getBaseAction<{ notifications?: notification_props[]; removeNotificationWithId?: String; newNotification?: Omit<notification_props, 'id'> }>(
    _reduxConstant.APPCTX_NOTIFICATIONS
  ),
};

export type _actionReturnTypes =
  | (__baseAction_Props<userReduxAction_Props> & {
      type: _reduxConstant.USER_REDUX;
    })
  | (__baseAction_Props<appCtxReduxAction_Props> & {
      type: _reduxConstant.APPCTX_REDUX;
    })
  | (__baseAction_Props<{ data: quickIcons_i } & { log?: logger }> & {
      type: _reduxConstant.APPCTX_QUICK_ACTIONS_REDUX;
    })
  | (__baseAction_Props<{ notifications?: notification_props[]; removeNotificationWithId?: String; newNotification?: Omit<notification_props, 'id'> }> & {
      type: _reduxConstant.APPCTX_NOTIFICATIONS;
    });
