import UNIVERSALS from "../../../../@universals"
import { logger } from "../../../../@logger"
import { axiosBaseErrors_e, baseError } from "../../../baseErrors"
import makeHttpQuery, { apolloErrors_e } from "../httpApolloQuery"


enum updateDeviceMutationApiErrors_e {
    UPDATE_DEVICE_MUTATION_API__UNHANDLED = "UPDATE_DEVICE_API : UNHANDLED",
    UPDATE_DEVICE_MUTATION_API_OUTDATED_TIMESTAMP = "UPDATE_DEVICE_API : OUTDATED TIMESTAMP",
}

interface response_i {
    updateHueDevice?: UNIVERSALS.GLOBALS.Device_t
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

interface _updateDeviceMutationAPi_returnType {
    RES?: UNIVERSALS.GLOBALS.Device_t
    ERR?: baseError<error_i, updateDeviceMutationApiErrors_e | apolloErrors_e | axiosBaseErrors_e>
}

interface fun_t {
    device: Omit<UNIVERSALS.GLOBALS.DEVICE_t, "id"> & { id: string }
    log?: logger
}
export const v1: (props: fun_t) => Promise<_updateDeviceMutationAPi_returnType> = async ({ device, log }: fun_t) => {

    interface variables_i {
        id: string
        hsv?: string,
        IP?: string,
        deviceName?: string,
        ts: number
    }
    var res = await makeHttpQuery<response_i, error_i, variables_i, _updateDeviceMutationAPi_returnType>({
        query: UNIVERSALS.GLOBALS.updateDevice_mutation,
        variables: {
            id: device.id,
            ...UNIVERSALS.GLOBALS.convert_Device_LocalToBackend_forUpdateMutation({ device })
        },
        resolveData: (props) => {
            //log?.print("resolve DATA" + JSON.stringify(props, null, 2))
            if (props.ERR?.error) {
                log?.print("ERR - updateDevice " + JSON.stringify(props.ERR.error, null, 2))
            }
            // - [ ] error check for outdated local timestamp
            else if (props.RES?.updateHueDevice) {
                log?.print("RES - updateDevice--  " + JSON.stringify(props.RES, null, 2))
                return { RES: props.RES.updateHueDevice }
            }
            return { ERR: { errCode: updateDeviceMutationApiErrors_e.UPDATE_DEVICE_MUTATION_API__UNHANDLED } }
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