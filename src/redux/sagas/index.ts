import { all } from 'redux-saga/effects';
import { saga as deviceReducerSaga } from '../deviceListReducer';
import { saga as bgServiceSaga } from '../helperSideEffect';

export default function* rootSaga() {
  yield all([deviceReducerSaga(), bgServiceSaga()]);
}
