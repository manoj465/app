import UNIVERSALS from "../../../../@universals"
import { logger } from "../../../../@logger"
import { axiosBaseErrors_e, baseError } from "../../../baseErrors"
import makeHttpQuery, { apolloErrors_e } from "../httpApolloQuery"


enum createdeviceMutationApiErrors_e {
    CREATE_DEVICE_MUTATION_API__UNHANDLED = "CREATE_DEVICE_API : UNHANDLED",
    CREATE_DEVICE_MUTATION_API_DUPLICATE_MAC_ERROR = "CREATE_DEVICE_API : DUPLICATE MAC",
}

interface response_i {
    createHueDevice?: UNIVERSALS.GLOBALS.Device_t
}

interface error_i {
    /**
    * @imp errors to be checked in listing order based on priority top`max` to bottom`min`
    */
    message?: "E11000 duplicate key error collection: huelite.hue_devices index: Mac_1 dup key:"
    extensions?: {
        code?: string
    }
}

interface _createDeviceMutationAPi_returnType {
    RES?: UNIVERSALS.GLOBALS.Device_t
    ERR?: baseError<error_i, createdeviceMutationApiErrors_e | apolloErrors_e | axiosBaseErrors_e>
}

interface fun_t {
    device: UNIVERSALS.GLOBALS.DEVICE_t
    userID: string
    log?: logger
}
export const v1: (props: fun_t) => Promise<_createDeviceMutationAPi_returnType> = async ({ device, userID, log }: fun_t) => {

    interface variables_i extends UNIVERSALS.GLOBALS.Device_t { userID: string }
    var res = await makeHttpQuery<response_i, error_i, variables_i, _createDeviceMutationAPi_returnType>({
        query: UNIVERSALS.GLOBALS.createNewDevice_mutation,
        variables: { ...UNIVERSALS.GLOBALS.convert_Device_LocalToBackend({ device }), userID },
        resolveData: (props) => {
            //log?.print("resolve DATA" + JSON.stringify(props, null, 2))
            if (props.ERR?.error) {
                log?.print("ERR - createDevice " + JSON.stringify(props.ERR.error, null, 2))
                if (props.ERR.error.message == "E11000 duplicate key error collection: huelite.hue_devices index: Mac_1 dup key:") {
                    return { ERR: { errCode: createdeviceMutationApiErrors_e.CREATE_DEVICE_MUTATION_API_DUPLICATE_MAC_ERROR, errMsg: props.ERR.error.message } }
                }
            }
            else if (props.RES?.createHueDevice) {
                log?.print("RES - createDevice  " + JSON.stringify(props.RES, null, 2))
                return { RES: props.RES.createHueDevice }
            }
            return { ERR: { errCode: createdeviceMutationApiErrors_e.CREATE_DEVICE_MUTATION_API__UNHANDLED } }
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