import { types } from "../../@types/huelite";
import { reduxStore } from "../../redux";
import { getSafeDeviceList } from "../deviceListUtil";

export type logFun_t = (s: string) => void;

export enum printType {
    CONTEXT,
    IMPMSG,
    MSG,
    ERR,
}


export class logger {
    owner: string
    constructor(s: string) {
        this.owner = "[[ " + s + " ]]"
    }

    addStack = (s: string) => {
        this.owner += " | [" + s + "]"
    }

    removeStack = () => {
        this.owner = this.owner.substring(0, this.owner.lastIndexOf('|') - 1)
    }

    print = (s: string, type?: printType) => {
        console.log(this.owner + " >> " + s)
    }

    printDeviceList = (deviceList?: types.HUE_DEVICE_t[],) => {
        if (!deviceList)
            deviceList = reduxStore.store.getState().deviceReducer.deviceList
        console.log(this.owner + " >> " + JSON.stringify(getSafeDeviceList(deviceList), null, 2))
    }
}


export const logFun: (S: string, _log?: logFun_t, initial?: boolean) => logFun_t = (S, _log, initial) => {
    let log: logFun_t
    if (initial)
        log = (s) => { console.log("[" + S.toUpperCase() + "] " + s) }
    else
        log = (s) => { _log && _log("|" + S.toUpperCase() + "| " + s) }
    return log
}