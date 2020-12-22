import { call, CallEffect, PutEffect, takeEvery, takeLatest } from "redux-saga/effects";
import { types } from "../../@types/huelite";
import { actionReturnTypes, _reduxConstant } from "../ReduxConstant";


export interface __baseAction_Props<R> {
    props: R
}
type _getBaseAction_t<R> = (props: R) => __baseAction_Props<R> & { type: _reduxConstant }
export const _getBaseAction: <R>(type: _reduxConstant) => _getBaseAction_t<R> = (type) => {
    console.log("[get base action]")
    return (props) => {
        //console.log("[base action called]" + JSON.stringify(props))
        return {
            type,
            props,
        } as const;
    }

}

interface _getWorker_t<T> {
    type: _reduxConstant
    callable: (props: T) => any
    shouldTakeLatest?: boolean
}
export const _getWorker: <R>(_props: _getWorker_t<R>) => [any, _getBaseAction_t<R>] = <R>(_props: _getWorker_t<R>) => {
    console.log("[GET WORKER]")

    const baseAction = _getBaseAction<R>(_props.type)

    const worker = function* _baseWorker(props: __baseAction_Props<R>) {
        //console.log("[BASE WORKER] >> " + JSON.stringify(props))
        if (props?.props)
            yield call(_props.callable, props.props)
    }

    let watcher
    if (_props.shouldTakeLatest)
        watcher = function* _baseWatcher() {
            //console.log("[BASE WATCHER] takeLatest")
            yield takeLatest(_props.type, worker);
        }
    else
        watcher = function* _baseWatcher() {
            //console.log("[BASE WORKER] takeEvery")
            yield takeEvery(_props.type, worker);
        }


    return [
        watcher,
        baseAction
    ]
}