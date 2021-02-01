import UNIVERSALS from "../../../../@universals"
import { logger } from "../../../../@logger"
import { axiosBaseErrors_e, baseError } from "../../../baseErrors"
import makeHttpQuery, { apolloErrors_e } from "../httpApolloQuery"


enum userDevicesUpdateApiErrors_e {
    USER_DEVICES_UPDATE_API_UNHANDLED = "USER_DEVICES_UPDATE_API : UNHANDLED"
}

interface response_i {
    updateUser: {
        id: string
        devices: {
            id: string
            Mac: string
            user: {
                id: string
            }
        }[]
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

interface _userDevicesUpdateAPi_returnType {
    RES?: response_i
    ERR?: baseError<error_i, userDevicesUpdateApiErrors_e | apolloErrors_e | axiosBaseErrors_e>
}

interface fun_t {
    id: string
    deviceID: string
    connect?: boolean
    log?: logger
}
export const v1: (props: fun_t) => Promise<_userDevicesUpdateAPi_returnType> = async ({ id, deviceID, connect, log }: fun_t) => {

    interface variables_i {
        id: string
        deviceID: string
    }
    var res = await makeHttpQuery<response_i, error_i, variables_i, _userDevicesUpdateAPi_returnType>({
        query: UNIVERSALS.GLOBALS.userUpdateDevicesMutationString(connect),
        variables: {
            id,
            deviceID
        },
        resolveData: (props) => {
            //log?.print("resolve DATA" + JSON.stringify(props, null, 2))
            if (props.RES?.updateUser)
                return props
            return { ERR: { errCode: userDevicesUpdateApiErrors_e.USER_DEVICES_UPDATE_API_UNHANDLED } }
        },
        //log: log ? new logger("base apollo request", log) : undefined
    }).then(res => res).catch(err => err)
    log?.print("response__>>" + JSON.stringify(res, null, 2))
    return res
}

