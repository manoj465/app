import { all } from "redux-saga/effects";
import { _deviceListSaga_watcher, _deviceSaga_watcher, _deviceListDB_watcher, _deviceListSaga_action, _deviceSaga_action } from "./deviceList";
import { _colorSaga_action, _colorSaga_watcher/* , _brSaga_action, _brSaga_watcher */ } from "./color.saga"

export default function* _saga() {
    yield all([
        _deviceListSaga_watcher(),
        _deviceSaga_watcher(),
        _deviceListDB_watcher(),
        _colorSaga_watcher(),
        /*  _brSaga_watcher(), */
    ]);
}

//export const _actions = { _containerSaga_action, _containerSagaDb_action }

export const _actions = { deviceListSaga: _deviceListSaga_action, deviceSaga: _deviceSaga_action, colorSaga: _colorSaga_action/* , brSaga: _brSaga_action  */ } 