import { all } from "redux-saga/effects";
import { bgServiceWatcher } from "./bgServiceSaga";
import { appCtxDBWatcher, appCtxSagaWatcher, userSagaWatcher } from "./appCTXSagas"

export default function* _saga() {
    yield all([
        appCtxSagaWatcher(),
        appCtxDBWatcher(),
        userSagaWatcher(),
        bgServiceWatcher()
    ]);
}
