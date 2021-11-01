import _saga from './saga';
import { _actions as appCTX_actions } from './reducers/AppCTXReducer';
import { _actions as HBReducer_actions } from './reducers/HBReducer';
import { bgServiceSagaAction } from './saga/bgServiceSaga';
import { appCtxDBAction, appCtxSagaAction, userSagaAction } from './saga/appCTXSagas';
import { backendSyncSagaAction } from './saga/backend-sync.saga';

export { _saga as saga };

export const _actions = {
  appCTX: { ...appCTX_actions, appCtxDBAction, appCtxSagaAction, userSagaAction },
  HBReducer: {
    ...HBReducer_actions,
    bgServiceSagaAction,
    backendSyncSagaAction,
  },
};
