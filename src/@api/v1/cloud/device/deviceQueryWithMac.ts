import UNIVERSALS from "../../../../@universals"
import { logger } from "../../../../@logger"
import { axiosBaseErrors_e, baseError } from "../../../baseErrors"
import makeHttpQuery, { apolloErrors_e } from "../httpApolloQuery"


export enum deviceQueryWithMacApiErrors_e {
    DEVICE_QUERY_API_INVALID_ID = "DEVICE_QUERY_API : INVALID_ID",
    DEVICE_QUERY_API_UNHANDLED = "DEVICE_QUERY_API : UNHANDLED",
    DEVICE_QUERY_NO_DEVICES_FOUND = "DEVICE_QUERY_API : NO_DEVICE_FOUND",
}

interface response_i {
    allHueDevices?: UNIVERSALS.GLOBALS.Device_t[]
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

interface _deviceQueryAPi_returnType {
    RES?: UNIVERSALS.GLOBALS.Device_t
    ERR?: baseError<error_i, deviceQueryWithMacApiErrors_e | apolloErrors_e | axiosBaseErrors_e>
}

interface fun_t {
    device: UNIVERSALS.GLOBALS.DEVICE_t
    log?: logger
}
export const v1: (props: fun_t) => Promise<_deviceQueryAPi_returnType> = async ({ device, log }: fun_t) => {

    interface variables_i {
        Mac: string
    }
    var res = await makeHttpQuery<response_i, error_i, variables_i, _deviceQueryAPi_returnType>({
        query: UNIVERSALS.GLOBALS.getDeviceWithMac_query,
        variables: {
            Mac: device.Mac
        },
        resolveData: (props) => {
            //log?.print("resolve DATA" + JSON.stringify(props, null, 2))
            if (props.ERR?.error) {
                log?.print("ERR - deviceTimerQuery " + JSON.stringify(props.ERR.error, null, 2))
                if (props.ERR.error.message) {

                }
            }
            else if (props.RES?.allHueDevices?.length) {
                log?.print("RES - deviceTimerQuery  " + JSON.stringify(props.RES.allHueDevices[0], null, 2))
                return { RES: props.RES.allHueDevices[0] }
            }
            else if (props.RES?.allHueDevices?.length == 0) {
                log?.print("ERR - NO_DEVICE_FOUND response received but no deices are found")
                return { ERR: { errCode: deviceQueryWithMacApiErrors_e.DEVICE_QUERY_NO_DEVICES_FOUND } }
            }
            return { ERR: { errCode: deviceQueryWithMacApiErrors_e.DEVICE_QUERY_API_UNHANDLED } }
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