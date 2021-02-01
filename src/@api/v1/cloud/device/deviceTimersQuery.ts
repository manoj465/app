import UNIVERSALS from "../../../../@universals"
import { logger } from "../../../../@logger"
import { axiosBaseErrors_e, baseError } from "../../../baseErrors"
import makeHttpQuery, { apolloErrors_e } from "../httpApolloQuery"


enum deviceQueryApiErrors_e {
    DEVICE_QUERY_API_INVALID_ID = "DEVICE_QUERY_API : INVALID_ID",
    DEVICE_QUERY_API_UNHANDLED = "DEVICE_QUERY_API : UNHANDLED",
}

interface response_i {
    HueDevice?: {
        id: string,
        timers?: string
    }
}

interface error_i {
    /**
    * @imp errors to be checked in listing order based on priority top`max` to bottom`min`
    */
    message?: string
    extensions?: {
        code?: string
    }
}

export interface _deviceTimerQueryAPi_returnType {
    RES?: {
        id: string
        timers?: string
        ts?: number
    }
    ERR?: baseError<error_i, deviceQueryApiErrors_e | apolloErrors_e | axiosBaseErrors_e>
}

interface fun_t {
    id: string
    log?: logger
}
export const v1: (props: fun_t) => Promise<_deviceTimerQueryAPi_returnType> = async ({ id, log }: fun_t) => {

    interface variables_i {
        id: string
    }
    var res = await makeHttpQuery<response_i, error_i, variables_i, _deviceTimerQueryAPi_returnType>({
        query: UNIVERSALS.GLOBALS.getDeviceTimer_query,
        variables: {
            id
        },
        resolveData: (props) => {
            //log?.print("resolve DATA" + JSON.stringify(props, null, 2))
            if (props.ERR?.error) {
                log?.print("ERR - deviceTimerQuery " + JSON.stringify(props.ERR.error, null, 2))
                if (props.ERR.error.message) {

                }
            }
            else if (props.RES && props.RES.HueDevice?.id) {
                log?.print("RES - deviceTimerQuery  " + JSON.stringify(props.RES.HueDevice, null, 2))
                return { RES: props.RES.HueDevice }
            }
            return { ERR: { errCode: deviceQueryApiErrors_e.DEVICE_QUERY_API_UNHANDLED } }
        },
        //log: log ? new logger("base apollo request", log) : undefined
    }).then(res => res).catch(err => err)
    log?.print("response__>>" + JSON.stringify(res, null, 2))
    return res
}



///device query test
/* const test = async () => {
    const log = new logger("TEST FUNCTION")
    log.print("---------")
    const _res = await v1({
        id: "5fef7e9162933b1ec4176861",
        log: log ? new logger("deviceTimersQuerypAPI", log) : undefined
    }).then((res: any) => res).catch((err: any) => err)

    log.print("res----" + JSON.stringify(_res, null, 2))
} */