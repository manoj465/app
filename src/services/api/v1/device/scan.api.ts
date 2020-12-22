import { baseError } from "../../baseErrors"
import { baseResponse_t, defaultRequestPost } from "../../baseRequest"


export interface scan_result_i {
    ssid: string
    bssid: string
}

interface t_res {
    status: number
    networks?: scan_result_i[]
}

interface t_err extends baseError {
    testErr: number
}


const fun: (address?: string) => Promise<baseResponse_t<t_res, t_err>> = async (address: string = "192.168.4.1") => {
    var res = await defaultRequestPost<t_res, t_err>({ address: address, path: "/config", urlParams: "config=wifi_scan" }).then(res => res).catch(err => err)
    console.log("SCAN API >> " + JSON.stringify(res))
    return res
}


export default fun