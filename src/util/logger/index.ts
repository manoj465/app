import { types } from "../../@types/huelite";
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
    printable = [
        "DEVICE COLOR PICKER",/* DEVICE COLOR PICKER PAGE */
        "DASHBOARD",/* DAHSBOARD SCREEN */
    ]
    /**
     * 
     * @param prefix Class Prefix
     */
    constructor(prefix?: string, _log?: logger) {
        let temp = (_log ? _log?.getPrefix() : "")
        this.owner = temp + " [[ " + prefix?.toUpperCase() + " ]]"
    }

    /** @deprecated */
    addStack = (s: string) => {
        this.owner += " | [" + s + "]"
    }
    /** @deprecated */
    removeStack = () => {
        this.owner = this.owner.substring(0, this.owner.lastIndexOf('|') - 1)
    }

    /** return class prefix --without bracket */
    getPrefix = () => {
        return this.owner ? this.owner : ""
    }

    print = (s: string, type?: printType) => {
        if (this.canPrint())
            console.log(this.owner + " >> " + s)
        else {
            console.log("connaot print")
        }
    }

    printDeviceList = (deviceList?: types.HUE_DEVICE_t[],) => {
        /*   if (!deviceList)
              deviceList = reduxStore.store.getState().deviceReducer.deviceList
          console.log(this.owner + " >> " + JSON.stringify(getSafeDeviceList(deviceList), null, 2)) */
    }

    canPrint = () => {
        let cprint = false
        this.printable.forEach(item => {
            if (this.owner.includes(item.toUpperCase()))
                cprint = true
        });
        return cprint
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