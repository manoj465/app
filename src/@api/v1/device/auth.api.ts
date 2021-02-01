import Axios from "axios"
import { logger } from "../../../@logger"
import { serverURL } from "../../baseAxios"
import { axiosBaseErrors_e, baseError } from "../../baseErrors"
import { defaultRequest } from "../../baseRequest"

export enum authApiErrors_e {
    AUTH_API_UNHANDLED = "AUTH_API_UNHANDLED"
}


export interface authApiErrors_i {
    testError?: any
}

interface authApiRes_i {
    Mac: string
    Hostname: string
}

export interface authApiReturnType {
    RES?: authApiRes_i
    ERR?: baseError<authApiErrors_i, authApiErrors_e | axiosBaseErrors_e>
}

/**
 * @description
 */
interface authApiProps_i {
    IP: string
    log?: logger
}
type fun_t = (props: authApiProps_i) => Promise<authApiReturnType>

export const v1: fun_t =
    async ({
        IP,
        log,
        ...props
    }: authApiProps_i) => {
        var queryResponse = await defaultRequest<authApiRes_i, authApiErrors_i, authApiReturnType>({
            method: "get",
            address: 'http://' + IP,
            path: "/auth",
            resolveData: ({ RES, ERR }) => {
                if (ERR) {
                    log?.print("ERR - resolve Data" + JSON.stringify(ERR, null, 2))
                }
                if (RES?.Mac && RES.Hostname) {
                    log?.print("RES - resolve Data " + IP + " " + JSON.stringify(RES, null, 2))
                    return { RES }
                }
                return { ERR: { errCode: authApiErrors_e.AUTH_API_UNHANDLED } }
            },
            log: log ? new logger("base request", log) : undefined
        }).then(res => res).catch(err => err)
        return queryResponse
    }

