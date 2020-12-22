import { put, takeEvery, all, call, takeLatest } from "redux-saga/effects";
import { _saga as deviceReducerSaga } from "../deviceListReducer";
import { _saga as bgServiceSaga } from "../helperSideEffect";


export default function* rootSaga() {
  yield all([
    deviceReducerSaga(),
    bgServiceSaga()
  ]);
}
