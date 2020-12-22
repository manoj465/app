import { put, takeEvery, all, call, takeLatest } from "redux-saga/effects";
import { _delay } from "./helper";
import { storeData, saveAppCTX } from "../../services/db/storage";
import { _reduxConstant } from "../ReduxConstant";
import { convertHSVToRgb, _convertRGBToHex } from "../../util/Color";
import { reduxStore } from "../../../App";


function* appCTXUpdateWorker(props) {
  yield call(_delay, 500);
  /* console.log(
    "saving appCTX to memory --> " +
      JSON.stringify(store.getState().appCTXReducer.appCTX)
  ); */
  yield call(saveAppCTX, reduxStore.store.getState().appCTXReducer.appCTX);
}

export function* watchappCTX_Update() {
  yield takeLatest(_reduxConstant.APP_CTX_UPDATE, appCTXUpdateWorker);
}
