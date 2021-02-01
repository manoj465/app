import UNIVERSALS from "../../../../@universals"
import { logger } from "../../../../@logger"
import { axiosBaseErrors_e, baseError } from "../../../baseErrors"
import makeHttpQuery, { apolloErrors_e } from "../httpApolloQuery"


enum signupApiErrors_e {
    SIGNUP_API_EMAIL_ALREADY_REGISTERED = "SIGNUP_API_ALREADY_REGISTERED",
    SIGNUP_API_PASSWORD_TOO_SHORT = "SIGNUP_API_PASSWORD_TOO_SHORT",
    SIGNUP_API_PASSWORD_NOT_STRONG = "SIGNUP_API_PASSWORD_NOT_STRONG",
    SIGNUP_API_INVALID_EMAIL = "SIGNUP_API_INVALID_EMAIL",
    SIGNUP_API_UNHANDLED = "SIGNUP_API_UNHANDLED"
}

interface response_i {
    createUser?: UNIVERSALS.GLOBALS.User_t
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

export interface _signupAPi_returnType {
    RES?: UNIVERSALS.GLOBALS.User_t
    ERR?: baseError<error_i, signupApiErrors_e | apolloErrors_e | axiosBaseErrors_e>
}

interface fun_t {
    userName: string
    email: string
    password: string
    log?: logger
}
export const v1: (props: fun_t) => Promise<_signupAPi_returnType> = async ({ email, password, userName, log }: fun_t) => {

    interface variables_i {
        userName: string
        email: string
        password: string
    }
    var res = await makeHttpQuery<response_i, error_i, variables_i, _signupAPi_returnType>({
        query: UNIVERSALS.GLOBALS.HUE_User_createMutation_,
        variables: {
            email,
            password,
            userName,
        },
        resolveData: (props) => {
            //log?.print("resolve DATA" + JSON.stringify(props, null, 2))
            if (props.ERR?.error) {
                log?.print("ERR - resolve DATA error object " + JSON.stringify(props.ERR.error, null, 2))
                if (props.ERR.error.message) {
                    if (props.ERR.error.message == "[password:minLength:user:password] Value must be at least 8 characters long.") {
                        return { ERR: { errCode: signupApiErrors_e.SIGNUP_API_PASSWORD_TOO_SHORT, errMsg: props.ERR.error.message } }
                    }
                    else if (props.ERR.error.message == "[password:rejectCommon:user:password] Common and frequently-used passwords are not allowed.") {
                        return { ERR: { errCode: signupApiErrors_e.SIGNUP_API_PASSWORD_NOT_STRONG, errMsg: props.ERR.error.message } }
                    }
                    /**
                     * @imp - this section has to checked in last as the filter string could be assosiated with other errors too, especially in case of multiple errors 
                     */
                    else if (props.ERR.error.message?.indexOf("E11000 duplicate key error collection: huelite.users") >= -1) {
                        return { ERR: { errCode: signupApiErrors_e.SIGNUP_API_EMAIL_ALREADY_REGISTERED, errMsg: props.ERR.error.message } }
                    }
                }
            }
            else if (props.RES && props.RES.createUser?.id) {
                log?.print("resolve Data user created successfully" + JSON.stringify(props.RES.createUser, null, 2))
                return { RES: props.RES.createUser }
            }
            return { ERR: { errCode: signupApiErrors_e.SIGNUP_API_UNHANDLED } }
        },
        //log: log ? new logger("base apollo request", log) : undefined
    }).then(res => res).catch(err => err)
    log?.print("response__>>" + JSON.stringify(res, null, 2))
    return res
}



///loginAPITest
/* {
    (async () => {
        const log = new logger("signup test function")
        const _res = await fun({
            email: "ijgjhvhj@gmail.com",
            password: "Ioplmkjnb@1",
            userName: "testUser",
            log: log ? new logger("signupAPI", log) : undefined
        }).then(res => res).catch(err => err)

        log.print("res----" + JSON.stringify(_res, null, 2))
    })()
} */