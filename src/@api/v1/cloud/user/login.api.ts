import UNIVERSALS from "../../../../@universals"
import { logger } from "../../../../@logger"
import { axiosBaseErrors_e, baseError } from "../../../baseErrors"
import makeHttpQuery, { apolloErrors_e } from "../httpApolloQuery"


export enum loginApiErrors_e {
    LOGIN_API_UNKNOWN_EMAIL = "LOGIN_API_UNKNOWN_EMAIL",
    LOGIN_API_INCORRECT_PASSWORD = "LOGIN_API_INCORRECT_PASSWORD",
    LOGIN_API_UNHANDLED = "LOGIN_API_UNHANDLED",
}

interface response_i {
    authenticateUserWithPassword: {
        item: UNIVERSALS.GLOBALS.User_t
    }
}

export interface error_i {
    /**
     * @imp errors to be checked in listing order based on priority top`max` to bottom`min`
     */
    extensions?: "INTERNAL_SERVER_ERROR"
    message?: "[passwordAuth:secret:mismatch] The password provided is incorrect"
    | "[passwordAuth:identity:notFound] The email provided didn't identify any undefined"
}

export interface _loginAPi_returnType {
    RES?: UNIVERSALS.GLOBALS.User_t
    ERR?: baseError<error_i, loginApiErrors_e | apolloErrors_e | axiosBaseErrors_e>
}

interface v1_props {
    email: string
    password: string
    log?: logger
}
export const v1: (props: v1_props) => Promise<_loginAPi_returnType> = async ({
    email,
    password,
    log }: v1_props) => {

    interface variables_i {
        email: string
        password: string
    }
    var response = await makeHttpQuery<response_i, error_i, variables_i, _loginAPi_returnType>({
        query: UNIVERSALS.GLOBALS.HUE_User_authenticateMutation_,
        variables: {
            email,
            password
        },
        resolveData:
            /**
             * # resolveData
             * ### description
             * check if desired dataset exists than send the data to next level resolved else filter for errors. if eror
             * is recognised than send specific error else send curent level unhandled as ERR object
             * 
             * ## changelog
             * 
             * ## featureList
             *  
             * ### responseHandling
             * ##### description
             *      if present then send the data to next resolver else check 
             *      for possible errors else send current level unhandled error
             * 
             * 
             * ### errorHandling
             * - [ ] NO Data/unknown/undefined error
             * - [ ] INTERNAL_SERVER_ERROR
             * - [ ] TODO incorrect password
             * - [ ] incorrect email
             */
            (props) => {
                log?.print("loginAPI resolve DATA " + JSON.stringify(props, null, 2))
                if (props.ERR?.error?.message == "[passwordAuth:secret:mismatch] The password provided is incorrect") {
                    log?.print("Its an password incorrect")
                    return { ERR: { errCode: loginApiErrors_e.LOGIN_API_INCORRECT_PASSWORD, errMsg: props.ERR.error.message } }
                }
                if (props.ERR?.error?.message == "[passwordAuth:identity:notFound] The email provided didn't identify any undefined") {
                    log?.print("Its an incorrect email")
                    return { ERR: { errCode: loginApiErrors_e.LOGIN_API_UNKNOWN_EMAIL, errMsg: props.ERR.error.message + " You can consider signingUp with the provided email" } }
                }
                if (props.RES?.authenticateUserWithPassword?.item?.id) {
                    log?.print("user authinticated successfully")
                    return { RES: props.RES.authenticateUserWithPassword.item }
                }
                return { ERR: { errCode: loginApiErrors_e.LOGIN_API_UNHANDLED } }
            },
        //log: log ? new logger("base apollo request", log) : undefined
    }).then(res => res).catch(err => err)
    log?.print("response__>>" + JSON.stringify(response, null, 2))
    return response
}


///loginAPITest
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
