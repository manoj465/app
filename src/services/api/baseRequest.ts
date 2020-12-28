import Axios from "axios";
import { logFun_t } from "../../util/logger";
import { baseError, checkBaseErrors } from "./baseErrors";


export interface baseResponse_t<R, E> {
    RES?: R,
    ERR?: E
}

/** 
 * @param R final response
 * 
 * @param E possible Errors
 */
interface defaultRequest_t<R, E> {
    address: string,
    path: string,
    config?: {
        timeout?: number,
    },
    headers?: {
    },
    body?: string,
    params?: Object,
    urlParams?: any
    checkCutomErrors?: (s: any) => baseResponse_t<R, E>
}
export const defaultRequestGet = <R, E extends baseError>({ checkCutomErrors = (s) => { return s }, ...props }: defaultRequest_t<R, E>) => new Promise<baseResponse_t<R, E>>(async (resolve, reject) => {
    await Axios.get<R>("http://" + (props.address ? props.address : "192.168.4.1") + props.path, {
        timeout: props?.config?.timeout ? props.config.timeout : 5000,
        data: props.body,
        params: props.params,
        ...props.config
    }).then(function (response) {
        //console.log("*********" + JSON.stringify(response))
        if (response?.data)
            return resolve({ RES: response.data })
        return reject({ ERR: { errCode: 1 } })
    }).catch(function (error) {
        //console.log("*********" + JSON.stringify(error))
        return reject(checkCutomErrors({ ERR: checkBaseErrors(error) }))
    });
})



export const defaultRequestPost = <R, E extends baseError>({ checkCutomErrors = (s) => { return s }, ...props }: defaultRequest_t<R, E>) => new Promise<baseResponse_t<R, E>>(async (resolve, reject) => {
    await Axios.post<R>("http://" + (props.address ? props.address : "192.168.4.1") + props.path, props.urlParams, {
        timeout: props?.config?.timeout ? props.config.timeout : 5000,
        data: props.body,
        params: props.params,
    }).then((response) => {
        if (response?.data) {
            return resolve(checkCutomErrors({ RES: response.data }))
        }
        return reject({ ERR: { errCode: 1 } })
    }).catch((error) => {
        return reject(checkCutomErrors({ ERR: checkBaseErrors(error) }))
    });
})


