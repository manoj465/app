import UNIVERSALS from "../../../../@universals"
import { logger } from "../../../../@logger"
import { axiosBaseErrors_e, baseError } from "../../../baseErrors"
import makeHttpQuery, { apolloErrors_e } from "../httpApolloQuery"


export enum userQueryApiErrors_e {
    USER_FETCH_API_UNKNOWN_EMAIL = "USER_FETCH_API_UNKNOWN_EMAIL",
    USER_FETCH_API_INCORRECT_PASSWORD = "USER_FETCH_API_INCORRECT_PASSWORD",
    USER_FETCH_API_UNHANDLED = "USER_FETCH_API_UNHANDLED",
}

interface response_i {
    User: UNIVERSALS.GLOBALS.User_t
}

export interface error_i {
    /**
     * @imp errors to be checked in listing order based on priority top`max` to bottom`min`
     */
    extensions?: "INTERNAL_SERVER_ERROR"
    message?: string
}

export interface _userQueryAPi_returnType {
    RES?: UNIVERSALS.GLOBALS.User_t
    ERR?: baseError<error_i, userQueryApiErrors_e | apolloErrors_e | axiosBaseErrors_e>
}

interface v1_props {
    id: string
    log?: logger
}
export const v1: (props: v1_props) => Promise<_userQueryAPi_returnType> = async ({
    id,
    log }: v1_props) => {

    interface variables_i {
        id: string
    }
    var response = await makeHttpQuery<response_i, error_i, variables_i, _userQueryAPi_returnType>({
        query: UNIVERSALS.GLOBALS.User_queryWithId,
        variables: { id },
        resolveData: (props) => {
            log?.print("userQueryAPI resolve DATA " + JSON.stringify(props, null, 2))
            if (props.RES?.User.id) {
                return { RES: props.RES.User }
            }
            return { ERR: { errCode: userQueryApiErrors_e.USER_FETCH_API_UNHANDLED } }
        },
        //log: log ? new logger("base apollo request", log) : undefined
    }).then(res => res).catch(err => err)
    log?.print("response__>>" + JSON.stringify(response, null, 2))
    return response
}


///userQueryAPITest
/* {
    (async () => {
        const log = new logger("login test function")
        const _res = await fun({
            email: "iamlive24@gmail.com",
            password: "Ioplmkjnb@1",
            log: log ? new logger("loginAPI", log) : undefined
        }).then(res => res).catch(err => err)
        log.print("res----" + JSON.stringify(_res, null, 2))
    })()
} */
