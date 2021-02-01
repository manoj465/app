//import { URLSearchParams } from "url"
import { logger } from "../../../@logger"
import { axiosBaseErrors_e, baseError } from "../../baseErrors"
import { defaultRequest } from "../../baseRequest"

export enum ScanApiErrors_e {
    SCAN_API_WAIT_UNTIL_SCANNING = "SCANAPI : CURRENTLY SCANNING",
    SCAN_API_NO_NETWORK_FOUND = "SCANAPI : NO NETWORK FOUND",
    SCAN_API_UNHANDLED = "ScanAPI_UNHANDLED"
}


export interface ScanApiErrors_i {
    testError?: any
}
interface network_i {
    rssi: any,
    ssid: string,
    bssid: string,
    channel: any,
    secure: any,
    hidden: boolean
}
interface ScanApiRes_i {
    status: number // - [ ] make an enum for scanAPi status codes
    networks?: network_i[]
}

export interface ScanApiReturnType {
    RES?: ScanApiRes_i
    ERR?: baseError<ScanApiErrors_i, ScanApiErrors_e | axiosBaseErrors_e>
}

/**
 * @description
 */
interface ScanApiProps_i {
    IP: string
    log?: logger
    /** resolve  */
}
type fun_t = (props: ScanApiProps_i) => Promise<ScanApiReturnType>

export const v1: fun_t =
    async ({
        IP,
        log,
        ...props
    }: ScanApiProps_i) => {
        const _params = new URLSearchParams()
        _params.append("config", "wifi_scan")
        log?.print("params " + _params)
        var queryResponse = await defaultRequest<ScanApiRes_i, ScanApiErrors_i, ScanApiReturnType>({
            method: "post",
            address: 'http://' + IP,
            path: "/config",
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            body: _params,
            resolveData: ({ RES, ERR }) => {
                if (ERR) {
                    log?.print("ERR - resolve Data" + JSON.stringify(ERR, null, 2))
                }
                if (RES) {
                    log?.print("RES - resolve Data" + JSON.stringify(RES, null, 2))
                    return { RES }
                }
                return { ERR: { errCode: ScanApiErrors_e.SCAN_API_UNHANDLED } }
            },
            log: log ? new logger("base request", log) : undefined
        }).then(res => res).catch(err => err)
        return queryResponse
    }


/* (
    async () => {
        const log = new logger("test function")
        log.print("test function for device api")
        const res = await fun({
            IP: "192.168.1.72",
            log: new logger("scan api", log)
        })
        log.print("response --> " + JSON.stringify(res, null, 2))
    }
)() */

