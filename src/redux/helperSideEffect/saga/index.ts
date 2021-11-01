import { all } from 'redux-saga/effects';
import { bgServiceWatcher } from './bgServiceSaga';
import { appCtxDBWatcher, appCtxSagaWatcher, userSagaWatcher } from './appCTXSagas';
import { backendSyncWatcher } from './backend-sync.saga';

export default function* _saga() {
  yield all([appCtxSagaWatcher(), appCtxDBWatcher(), userSagaWatcher(), bgServiceWatcher(), backendSyncWatcher()]);
}
