import UNIVERSALS from "../../../@universals"
import { logger } from "../../../@logger"
import { axiosBaseErrors_e, baseError } from "../../baseErrors"
import { defaultRequest } from "../../baseRequest"

export enum pairApiErrors_e {
    PAIR_API_UNHANDLED = "PAIR_API_UNHANDLED"
}


export type pairApiErrors_i = UNIVERSALS.GLOBALS.deviceApi._DEVICE_WIFI_API_ERRORS_e

export interface pairApiRes_i {
    Mac: string
    WIFI_STATE: UNIVERSALS.GLOBALS.deviceApi._DEVICE_WIFI_STATE_e
    IP?: string
    ssid?: string
}

export interface pairApiReturnType {
    RES?: pairApiRes_i
    ERR?: baseError<pairApiErrors_i, pairApiErrors_e | axiosBaseErrors_e>
}

/**
 * @description
 */
interface pairApiProps_i {
    IP: string
    ssid: string
    pass: string
    log?: logger
}
type fun_t = (props: pairApiProps_i) => Promise<pairApiReturnType>

export const v1: fun_t =
    async ({
        IP,
        ssid,
        pass,
        log,
        ...props
    }: pairApiProps_i) => {
        const _params = new URLSearchParams()
        _params.append("config", "wifi_connect")
        _params.append("ssid", ssid)
        _params.append("pass", pass)
        log?.print("params " + _params)
        var queryResponse = await defaultRequest<pairApiRes_i, pairApiErrors_i, pairApiReturnType>({
            method: "post",
            address: 'http://' + IP,
            path: "/config",
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            body: _params,
            config: {
                timeout: 5000
            },
            resolveData: ({ RES, ERR }) => {
                if (ERR) {
                    log?.print("ERR - resolve Data" + JSON.stringify(ERR, null, 2))
                }
                if (RES && RES.Mac) {
                    log?.print("RES - resolve Data" + JSON.stringify(RES, null, 2))
                    return { RES }
                }
                return { ERR: { errCode: pairApiErrors_e.PAIR_API_UNHANDLED } }
            },
            log: log ? new logger("base request", log) : undefined
        }).then(res => res).catch(err => err)
        return queryResponse
    }



/* (async () => {
    const log = new logger("test function")
    const res = await v1({ IP: "192.168.4.1", ssid: "Homelink", pass: "Ioplmkjnb@1", log })
    if (res.RES)
        log.print("RES ****----- " + JSON.stringify(res.RES, null, 2))
    else
        log.print("ERR ****----- " + JSON.stringify(res.ERR, null, 2))
})() */