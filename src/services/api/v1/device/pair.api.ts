import { api_v1_errCode, baseError } from "../../baseErrors"
import { baseResponse_t, defaultRequestPost } from "../../baseRequest"




interface t_res {
    MAC: string,
}

interface t_err extends baseError {
    data?: "ERR-052" | "ERR-043"
}

const checkExtendedErrors = (s: baseResponse_t<t_res, t_err>) => {
    if (s.ERR?.data == "ERR-052") {
        s.ERR.errCode = api_v1_errCode.MISSING_PARAM
    }
    else if (s.ERR?.data == "ERR-043") {
        s.ERR.errCode = api_v1_errCode.PAIR_RESPONSE_WIFI_BUSY
    }
    return s
}


const fun: (ssid: string, pass: string, address?: string) => Promise<baseResponse_t<t_res, t_err>> = async (ssid, pass, address: string = "192.168.4.1") => {
    var res = await defaultRequestPost<t_res, t_err>({ checkCutomErrors: checkExtendedErrors, address: address, path: "/config", urlParams: `config=wifi_connect&ssid=${ssid}&pass=${pass}` }).then(res => res).catch(err => err)
    //console.log(authAPIres)
    return res
}


export default fun