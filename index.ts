import UNIVERSALS from "../@universals";
import { getSafeDeviceList } from "../util/deviceListUtil";

/** @deprecated */
export type logFun_t = (s: string) => void;

export enum printType {
    CONTEXT,
    IMPMSG,
    MSG,
    ERR,
}


export class logger {
    prefix: string
    printAll = false
    printable = [
        //"MAIN ACTIVITY", /* App.ts */
        //"BG SERVICE",
        //"DEVICE MODES SCREEN", /* device modes screen in device page */
        //"DEVICE COLOR PICKER",/* DEVICE COLOR PICKER PAGE */
        //"DASHBOARD",/* DAHSBOARD SCREEN */
        //"LOGIN/SIGNUP", /* LOGIN/SIGNUP screen */
        //"TEST FUNCTION", /* testfunction prints */
        //"USER PROFILE",
        //"APP SETTING",
        //"PAIRING_SCREEN",
        //"SOCKET TEST",
        "SERVER",
    ]
    /**
     * 
     * @param prefix Class Prefix
     */
    constructor(prefix?: string, _log?: logger) {
        let temp = (_log ? _log?.getPrefix() : "")
        this.prefix = temp + " [[ " + prefix?.toUpperCase() + " ]]"
    }

    /** @deprecated */
    addStack = (s: string) => {
        this.prefix += " | [" + s + "]"
    }
    /** @deprecated */
    removeStack = () => {
        this.prefix = this.prefix.substring(0, this.prefix.lastIndexOf('|') - 1)
    }

    /** return class prefix --without bracket */
    getPrefix = () => {
        return this.prefix ? this.prefix : ""
    }

    /**
     * @description print without prefix
     */
    _print = (s: string, type?: printType) => {
        if (this.canPrint())
            console.log(" " + s + " ")
        return this
    }

    print = (s: string, type?: printType) => {
        if (this.canPrint())
            console.log(" " + this.prefix + " >> " + s + " ")
        return this
    }

    printPretty = (s: string) => {
        if (this.canPrint())
            this.print(JSON.stringify(s, null, 2))
        return this
    }

    /**
     * @description print without prefix
     */
    _printPretty = (s: object | undefined) => {
        if (this.canPrint() && s)
            console.log(" " + JSON.stringify(s, null, 2) + " ")
        return this
    }

    /** @deprecated */
    printDeviceList = (deviceList?: UNIVERSALS.GLOBALS.DEVICE_t[],) => {
        /*   if (!deviceList)
              deviceList = reduxStore.store.getState().deviceReducer.deviceList
          console.log(this.owner + " >> " + JSON.stringify(getSafeDeviceList(deviceList), null, 2)) */
    }

    canPrint = () => {
        if (this.printAll)
            return true
        let cprint = false
        this.printable.forEach(item => {
            if (this.prefix.includes(item.toUpperCase()))
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