import { HUE_User_t } from "../../../../@types/huelite/globalTypes"
import { baseError } from "../../baseErrors"
import { baseResponse_t, defaultRequestGet, defaultRequestPost } from "../../baseRequest"



export interface apollo_query_err extends baseError {
    apolloErr?: string
}

interface fun_i {
    address?: string
    query: string
    variables: Object
    config?: {
        timeout?: number
    }
}
type fun_t = <R, E extends apollo_query_err>(props: fun_i) => Promise<baseResponse_t<R, E>>
const fun: fun_t = async <R, E extends apollo_query_err>({ address = "http://www.huelite.in/backend", ...props }: fun_i) => {
    var authAPIres = await defaultRequestPost<R, E>({ address: address, path: "/admin/api", params: { query: props.query, variables: props.variables, }, config: props.config }).then(res => res).catch(err => err)
    //console.log(authAPIres)
    return authAPIres
}


export default fun
