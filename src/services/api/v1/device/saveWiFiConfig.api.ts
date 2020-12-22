import { api_v1_errCode, baseError } from "../../baseErrors"
import { baseResponse_t, defaultRequestPost } from "../../baseRequest"




type t_res = ("RES-551")

interface t_err extends baseError {
    data?: "ERR-048"
}

const checkExtendedErrors = (s: baseResponse_t<t_res, t_err>) => {
    if (s.ERR?.data == "ERR-048") {
        s.ERR.errCode = api_v1_errCode.SAVE_WIFI_CONFIG_API_RESPONSE_COULD_NOT_SAVE
    }
    return s
}


const fun: ( address?: string) => Promise<baseResponse_t<t_res, t_err>> = async (address: string = "192.168.4.1") => {
    var res = await defaultRequestPost<t_res, t_err>({ checkCutomErrors: checkExtendedErrors, address: address, path: "/config", urlParams: "config=save_wifi_cnf" }).then(res => res).catch(err => err)
    //console.log(res)
    return res
}


export default fun