import { all } from "redux-saga/effects";
import { watchBGServiceAction } from "./bgServiceSaga";

export default function* _saga() {
    yield all([
        watchBGServiceAction()
    ]);
}
