import { logger } from "../../../@logger"
import { axiosBaseErrors_e, baseError } from "../../baseErrors"
import { defaultRequest } from "../../baseRequest"

export enum saveWifiConfigApiErrors_e {
    SAVE_WIFI_CONFIG_API_UNHANDLED = "SAVE_WIFI_CONFIG_API_UNHANDLED"
}


export type saveWifiConfigApiErrors_i = "ERR-048"

type saveWifiConfigApiRes_i = "RES-551"

export interface saveWifiConfigApiReturnType {
    RES?: saveWifiConfigApiRes_i
    ERR?: baseError<saveWifiConfigApiErrors_i, saveWifiConfigApiErrors_e | axiosBaseErrors_e>
}

/**
 * @description
 */
interface saveWifiConfigApiProps_i {
    IP: string
    log?: logger
}
type fun_t =
    (props: saveWifiConfigApiProps_i)
        => Promise<saveWifiConfigApiReturnType>

export const v1: fun_t =
    async ({
        IP,
        log,
        ...props
    }: saveWifiConfigApiProps_i) => {
        const _params = new URLSearchParams()
        _params.append("config", "save_wifi_cnf")
        log?.print("params " + _params)
        var queryResponse = await defaultRequest<saveWifiConfigApiRes_i, saveWifiConfigApiErrors_i, saveWifiConfigApiReturnType>({
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
                if (RES) {
                    log?.print("RES - resolve Data" + JSON.stringify(RES, null, 2))
                    return { RES }
                }
                return { ERR: { errCode: saveWifiConfigApiErrors_e.SAVE_WIFI_CONFIG_API_UNHANDLED } }
            },
            log: log ? new logger("base request", log) : undefined
        }).then(res => res).catch(err => err)
        return queryResponse
    }


