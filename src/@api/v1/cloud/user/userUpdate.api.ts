import UNIVERSALS from "../../../../@universals"
import { logger } from "../../../../@logger"
import { axiosBaseErrors_e, baseError } from "../../../baseErrors"
import makeHttpQuery, { apolloErrors_e } from "../httpApolloQuery"


enum userUpdateApiErrors_e {
    USER_UPDATE_API_PASSWORD_TOO_SHORT = "USER_UPDATE_API_PASSWORD_TOO_SHORT",
    USER_UPDATE_API_PASSWORD_EASY = "USER_UPDATE_API_PASSWORD_EASY",
    USER_UPDATE_API_EMAIL_ALREADY_REGISTERED = "USER_UPDATE_API_PASSWORD_EASY",
    USER_UPDATE_API_ID_INCORRECT_OR_NOT_PROVIDED = "USER_UPDATE_API_ID_INCORRECT_OR_NOT_PROVIDED",
    USER_UPDATE_API_UNHANDLED = "USER_UPDATE_API_UNHANDLED",
}

interface response_i {
    updateUser: Omit<UNIVERSALS.GLOBALS.User_t, "devices">
}

interface error_i {
    message?: "Variable \"$id\" of required type \"ID!\" was not provided."
    | "Argument passed in must be a single String of 12 bytes or a string of 24 hex characters"
    | "[password:rejectCommon:user:password] Common and frequently-used passwords are not allowed."
    | "[password:minLength:user:password] Value must be at least 8 characters long."
    extensions: {
        code: "INTERNAL_SERVER_ERROR",
    }
}

export interface _userUpdate_returnType {
    RES?: UNIVERSALS.GLOBALS.User_t
    ERR?: baseError<error_i, userUpdateApiErrors_e | apolloErrors_e | axiosBaseErrors_e>
}

interface fun_t {
    id: string
    userName?: string
    password?: string
    log?: logger
}
export const v1: (props: fun_t) => Promise<_userUpdate_returnType> = async ({ id, userName, password, log }: fun_t) => {

    interface variables_i {
        id: string
        userName?: string
        password?: string
    }
    let _var: variables_i = { id: id }
    if (password)
        _var = { ..._var, password }
    if (userName)
        _var = { ..._var, userName }
    var res = await makeHttpQuery<response_i, error_i, variables_i, _userUpdate_returnType>({
        query: UNIVERSALS.GLOBALS.HUE_User_updateMutation_,
        variables: _var,
        resolveData: (props) => {
            log?.print("resolve data" + JSON.stringify(props, null, 2))
            if (props.ERR) {
                log?.print("resolve data Error exists " + JSON.stringify(props.ERR, null, 2))
                if (props.ERR.error?.message == "[password:rejectCommon:user:password] Common and frequently-used passwords are not allowed.") {
                    return { ERR: { errCode: userUpdateApiErrors_e.USER_UPDATE_API_PASSWORD_EASY, errMsg: props.ERR.error.message } }
                }
                if (props.ERR.error?.message == "[password:minLength:user:password] Value must be at least 8 characters long.") {
                    return { ERR: { errCode: userUpdateApiErrors_e.USER_UPDATE_API_PASSWORD_TOO_SHORT, errMsg: props.ERR.error.message } }
                }
                if (props.ERR.error?.message == "Variable \"$id\" of required type \"ID!\" was not provided." || props.ERR.error?.message == "Argument passed in must be a single String of 12 bytes or a string of 24 hex characters") {
                    return { ERR: { errCode: userUpdateApiErrors_e.USER_UPDATE_API_ID_INCORRECT_OR_NOT_PROVIDED, errMsg: props.ERR.error.message } }
                }
            }
            else if (props.RES?.updateUser?.id) {
                log?.print("resolve data user update successfully " + JSON.stringify(props.RES.updateUser, null, 2))
                return { RES: props.RES.updateUser }
            }
            return { ERR: { errCode: userUpdateApiErrors_e.USER_UPDATE_API_UNHANDLED } }
        },
        //log: log ? new logger("base apollo request", log) : undefined
    }).then(res => res).catch(err => err)
    log?.print("response__>>" + JSON.stringify(res, null, 2))
    return res
}



///update API test
/* {
    (async () => {
        const log = new logger("update test function")
        const _res = await fun({
            id: "5fea01e45760e019bcf516db",
            //id: "",
            password: "password",
            userName: "testUser temp",
            log: log ? new logger("updateAPI", log) : undefined
        }).then(res => res).catch(err => err)

        log.print("res----" + JSON.stringify(_res, null, 2))
    })()
} */