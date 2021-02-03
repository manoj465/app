import React, { useState } from "react"
import UNIVERSALS from "../../../../@universals"
import { logger } from "../../../../@logger"
import { axiosBaseErrors_e, baseError } from "../../../baseErrors"
import makeHttpQuery, { apolloErrors_e } from "../httpApolloQuery"
import { StyleProp, ViewStyle, View } from "react-native"
import { useEffect } from "react"


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



enum loginValidationError_e {
    LOGIN_VALIDATION_EMAIL_REQUIRED = "LOGIN_VALIDATION : EMAIL REQUIRED",
    LOGIN_VALIDATION_EMAIL_INVALID = "LOGIN_VALIDATION : EMAIL INVALID",
    LOGIN_VALIDATION_PASSWORD_REQUIRED = "LOGIN_VALIDATION : PASSWORD REQUIRED",
    LOGIN_VALIDATION_PASSWORD_TOO_SHORT = "LOGIN_VALIDATION : PASSWORD TOO SHORT",
}
type useLogin_t = (
    props: {
        email: string,
        password: string,
        onData?: (props: {
            /** #### request response response */
            data: any
        }) => void
        onLoginSuccess?: (props: { user: UNIVERSALS.GLOBALS.USER_t, devices: UNIVERSALS.GLOBALS.DEVICE_t[] }) => void
        onValidateDataFailed?: (props: baseError<any, loginValidationError_e>) => void
        onLoginFailed?: (props: Pick<_loginAPi_returnType, "ERR"> | { ERR?: baseError<any, loginValidationError_e> }) => void
        log?: logger
    }) => void

/**
 * 
 * # useLogin
 * ```
 * type useLogin_t = (
 *  props: {
 *      email: string,
 *      password: string,
 *      onLoginSuccess?: (props: { user: UNIVERSALS.GLOBALS.USER_t, devices: UNIVERSALS.GLOBALS.DEVICE_t[] }) => void
 *      onValidateDataFailed?: (props: baseError<any, loginValidationError_e>) => void
 *      onLoginFailed?: (props: Pick<_loginAPi_returnType, "ERR"> | { ERR?: baseError<any, loginValidationError_e> }) => void
 *      log?: logger
 *  }) => void
 * ```
 * 
 */
export const useLogin: useLogin_t = async ({ email, password, ...props }) => {

    if (!email || !UNIVERSALS.util.ValidateEmail({ email })) {
        props.log?.print("validation : email: " + email + ", pass: " + password)
        const tempError = { errCode: loginValidationError_e.LOGIN_VALIDATION_EMAIL_REQUIRED, errMsg: "Kindly, provide a valid email address" }
        props.onValidateDataFailed ? props.onValidateDataFailed(tempError) : {}
        props.onLoginFailed ? props.onLoginFailed({ ERR: tempError }) : {}
        return
    } if (password && password.length < 8) {
        props.log?.print("validation => username: " + email + ", pass: " + password)
        const tempError = { errCode: loginValidationError_e.LOGIN_VALIDATION_PASSWORD_REQUIRED, errMsg: "Kindly, provide a valid password" }
        props.onValidateDataFailed ? props.onValidateDataFailed(tempError) : {}
        props.onLoginFailed ? props.onLoginFailed({ ERR: tempError }) : {}
        return
    }
    const res = await v1({
        email,
        password,
        //log: log ? new logger("login API", log) : undefined
    })
    if (res.RES?.id) {
        props.log?.print("user found >>>> " + JSON.stringify(res.RES, null, 2))
        props.log?.print("device from cloud" + JSON.stringify(res.RES.devices, null, 2))
        const __t1_user = UNIVERSALS.GLOBALS.convert_user_backendToLocal({ user: res.RES })
        const __t1_devices = UNIVERSALS.GLOBALS.convert_Devices_backendToLocal({ devices: res.RES.devices })
        props.log?.print("device converted to local" + JSON.stringify(__t1_devices, null, 2))
        props.onLoginSuccess ? props.onLoginSuccess({
            user: __t1_user,
            devices: __t1_devices
        }) : {}
        return
    }
    else {
        props.log?.print("ERR no user found >>>>-- " + JSON.stringify(res, null, 2))
        props.onLoginFailed ? props.onLoginFailed(res) : {}
    }
}
