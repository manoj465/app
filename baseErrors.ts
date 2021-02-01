import { logger } from "../@logger"

export const errMsgSuffix = "We are constantly working on improvements and bugfixes in our products. You can report the issue on HUElite website for faster moving of things"

export enum axiosBaseErrors_e {
    BASE_ERROR_UNHANDLED = "BASE_ERROR_UNHANDLED",
    REQUEST_FAILED = "REQUEST_FAILED",
    UNKNOWN_ROUTE = "UNKNOWN_ROUTE",
    TIMEOUT = "NETWORK TIMEOUT",
    NETWORK_ERR = "NETWORK_ERR",
    NO_DATA = "NO_DATA",
    MISSING_PARAM = "MISSING_PARAM",
    PAIR_RESPONSE_WIFI_BUSY = "PAIR_RESPONSE_WIFI_BUSY",
    SAVE_WIFI_CONFIG_API_RESPONSE_COULD_NOT_SAVE = "SAVE_WIFI_CONFIG_API_RESPONSE_COULD_NOT_SAVE",
}

export interface baseError<ERR_TYPE, ERR_CODE> {
    errCode: ERR_CODE
    error?: ERR_TYPE
    errMsg?: string
    status?: number
    data?: any
}

const timeoutError: baseError<any, axiosBaseErrors_e> = {
    errCode: axiosBaseErrors_e.TIMEOUT
}

export const networkError: baseError<any, axiosBaseErrors_e> = {
    errCode: axiosBaseErrors_e.NETWORK_ERR
}

export const unknownRouteError: baseError<any, axiosBaseErrors_e> = {
    errCode: axiosBaseErrors_e.UNKNOWN_ROUTE
}

//export type baseError = timeoutError_i | unknownError_i | networkError_i



export const checkForHttpErrors: <T, R>(err: any, log?: logger) => baseError<T, R> = (err, log) => {
    log?.print("base error check" + JSON.stringify(err, null, 2))
    if (err?.message.indexOf("timeout") > -1)
        return { ...timeoutError, errMsg: err?.message }
    else if (err?.message.indexOf("Network Error") > -1)
        return { ...networkError, errMsg: err?.message }
    else if (err?.message.indexOf("ECONNREFUSED") > -1)
        return { ...networkError, errMsg: err?.message }
    else if (err?.response?.status == 404)
        return { ...unknownRouteError, /* data: err?.response?.data, */ status: err?.response?.status }
    else if (err?.response)/* measure for graphql query base errors */
        return { errCode: axiosBaseErrors_e.REQUEST_FAILED, error: err?.response?.data, status: err?.response?.status }
    return err
}