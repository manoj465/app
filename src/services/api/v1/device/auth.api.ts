import { baseError } from "../../baseErrors"
import { baseResponse_t, defaultRequestGet } from "../../baseRequest"


interface t_res {
    Mac: string,
    Hostname: string
}

type t_ress = (string)

interface t_err extends baseError {
    testErr: number
}


const fun: (address?: string) => Promise<baseResponse_t<t_res, t_err>> = async (address: string = "192.168.4.1") => {
    const authAPIres = await defaultRequestGet<t_res, t_err>({ address: address, path: "/auth" }).then(res => res).catch(err => err)
    //console.log("AUTH API " + JSON.stringify(authAPIres))
    return authAPIres
}


export default fun