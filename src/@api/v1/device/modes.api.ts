import { logger } from "../../../@logger"
import { axiosBaseErrors_e, baseError } from "../../baseErrors"
import { defaultRequest } from "../../baseRequest"

enum modesApiErrors_e {
    MODE_API_NO_NETWORK_FOUND = "MODE_API : NO NETWORK FOUND",
    MODE_API_UNHANDLED = "MODE_API_UNHANDLED"
}
interface modesApiErrors_i {
    modeApiError?: any
}

type modesApiRes_i = any

interface modesApiReturnType {
    RES?: modesApiRes_i
    ERR?: baseError<modesApiErrors_i, modesApiErrors_e | axiosBaseErrors_e>
}

/**
 * @description
 */
interface modesApiProps_i {
    IP: string,
    modeData: string
    log?: logger
    /** resolve  */
}
type fun_t = (props: modesApiProps_i) => Promise<modesApiReturnType>

export const v1: fun_t =
    async ({
        IP,
        modeData,
        log,
    }: modesApiProps_i) => {
        const _params = new URLSearchParams()
        _params.append("config", "jsontest")
        _params.append("json", modeData)
        log?.print("params " + _params)
        var queryResponse = await defaultRequest<modesApiRes_i, modesApiErrors_i, modesApiReturnType>({
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
                return { ERR: { errCode: modesApiErrors_e.MODE_API_UNHANDLED } }
            },
            log: log ? new logger("base request", log) : undefined
        }).then(res => res).catch(err => err)
        return queryResponse
    }

