import { HUE_User_t } from "../../../../@types/huelite/globalTypes"
import { gql_getUserWithFbId } from "../../../../@types/huelite/gql/user"
import { baseError } from "../../baseErrors"
import { baseResponse_t } from "../../baseRequest"
import makeHttpQuery from "./httpApolloQuery"


interface t_res {
    allUsers: HUE_User_t[]
}

interface t_err extends baseError {
}

interface fun_t {
    fbId: string,
    address?: string
}
const fun: (props: fun_t) => Promise<baseResponse_t<t_res, t_err>> = async (props: fun_t) => {
    var res = await makeHttpQuery<t_res, t_err>({ address: props.address, query: gql_getUserWithFbId, variables: { fbId: props.fbId }, config: { timeout: 2000 } }).then(res => res).catch(err => err)
    //console.log(">>+++++" + JSON.stringify(res))
    return res
}

export default fun
