import { logFun_t } from "../../util/logger"

export enum api_v1_errCode {
    NULL,
    UNKNOWN_ERR,
    UNKNOWN_ROUTE,
    TIMEOUT,
    NETWORK_ERR,
    NO_DATA,
    MISSING_PARAM,
    PAIR_RESPONSE_WIFI_BUSY,
    SAVE_WIFI_CONFIG_API_RESPONSE_COULD_NOT_SAVE
}

export interface baseError {
    errCode: api_v1_errCode
    errMsg?: string
    err?: any
    status?: number
    data?: string
}

const timeoutError: baseError = {
    errCode: api_v1_errCode.TIMEOUT
}

export const unknownError: baseError = {
    errCode: api_v1_errCode.UNKNOWN_ERR
}

export const networkError: baseError = {
    errCode: api_v1_errCode.NETWORK_ERR
}

export const unknownRouteError: baseError = {
    errCode: api_v1_errCode.UNKNOWN_ROUTE
}

//export type baseError = timeoutError_i | unknownError_i | networkError_i



export const checkBaseErrors: (err: any, _log?: logFun_t) => baseError = (err, _log) => {
    const log: logFun_t = (s) => { _log && _log("|checkBaseErrors| " + s) }
    log(JSON.stringify(err.response))
    if (err?.message.indexOf("timeout") > -1)
        return { ...timeoutError, errMsg: err?.message }
    else if (err?.message.indexOf("Network Error") > -1)
        return { ...networkError, errMsg: err?.message }
    else if (err?.response?.status == 404)
        return { ...unknownRouteError, data: err?.response?.data, status: err?.response?.status }
    else if (err?.response?.status == 400)
        return { errCode: api_v1_errCode.NULL, data: err?.response?.data, status: err?.response?.status }
    else if (err?.response)
        return { data: err.response }
    return { ...err, errCode: api_v1_errCode.NULL }
}