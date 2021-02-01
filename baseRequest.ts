import Axios from "axios";
import { logger } from "../@logger";
import { axiosBaseErrors_e, baseError, checkForHttpErrors } from "./baseErrors";


interface baseResponse_t<res, err> {
    RES?: res,
    ERR?: baseError<err, axiosBaseErrors_e>
}
/**
 * Default request t
 * @template res 
 * @template err 
 */
export interface defaultRequest_t<res, err, resolveReturn_t> {
    address: string,
    path: string,
    method: "get" | "post" | "delete" | "put"
    body?: any,
    config?: {
        timeout?: number,
    },
    headers?: {},
    params?: any,
    resolveData?: (s: baseResponse_t<res, err>) => resolveReturn_t
    log?: logger
}

/**
 * ## templates
 * @template res response type expected from base request
 * @template err possible error returns from base request if no base errors are found
 * @template resolveReturn_t return type of the `resolveData` function
 * 
 * ## parameters
 * @param address 
 * @param path
 * @param method: "get" | "post" | "delete" | "put"
 * @param body?: any,
 * @param config?: { timeout?: number },
 * @param headers?: {},
 * @param params?: Object,
 * @param resolveData?: (s: baseResponse_t<res, err>) => resolveReturn_t `default` `(s) => { return s }`,
 * @param log?: logger
 * } 
 */
export const defaultRequest = <res, err, resolveReturn_t>({
    resolveData = (s: any) => { return s },
    log,
    ...props
}: defaultRequest_t<res, err, resolveReturn_t>) => new Promise<baseResponse_t<res, err>>(async (resolve, reject) => {
    await Axios.request<res>({
        method: props.method,
        url: props.address + props.path,
        data: props.body,
        headers: props.headers,
        params: props.params,
        timeout: props?.config?.timeout ? props.config.timeout : 5000,
    }).then(({ data, status }) => {
        if (data || status == 200) {
            log?.print("[][] response data : " + JSON.stringify(data, null, 2))
            return resolve(resolveData({ RES: data }))
        }
        return reject({ ERR: { errCode: axiosBaseErrors_e.NO_DATA, data } })
    }).catch((error) => {
        log?.print("[][] error : " + error)
        let tempError = checkForHttpErrors<err, axiosBaseErrors_e>(error, log ? new logger("base http error checker", log) : undefined)
        if (tempError.errCode)
            reject({ ERR: tempError })
        return reject(resolveData({ ERR: { errCode: axiosBaseErrors_e.REQUEST_FAILED, error: error } }))
    });
})
