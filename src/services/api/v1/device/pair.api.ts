import { logger } from "../../../../util/logger"
import { axiosBaseErrors_e, baseError } from "../../baseErrors"
import { defaultRequest } from "../../baseRequest"

export enum pairApiErrors_e {
    PAIR_API_UNHANDLED = "PAIR_API_UNHANDLED"
}


export interface pairApiErrors_i {
    testError?: any
}

interface pairApiRes_i {
    testData?: any
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
            params: _params,
            resolveData: ({ RES, ERR }) => {
                if (ERR) {
                    log?.print("ERR - resolve Data" + JSON.stringify(ERR, null, 2))
                }
                if (RES) {
                    log?.print("RES - resolve Data" + JSON.stringify(RES, null, 2))
                }
                return { ERR: { errCode: pairApiErrors_e.PAIR_API_UNHANDLED } }
            },
            log: log ? new logger("base request", log) : undefined
        }).then(res => res).catch(err => err)
        return queryResponse
    }


