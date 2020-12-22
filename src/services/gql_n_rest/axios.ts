import axios from "axios";
import { Alert } from "react-native";
import { logFun_t } from "../../util/logger";


export const myAxios = axios.create({
    //baseURL: "http://192.168.43.63:4000/backend",
    baseURL: "https://www.huelite.in/backend",
    //baseURL: "https://www.huelite.in/backend",
    //baseURL: "http://192.168.1.6:4000/backend",
    //baseURL: "http://localhost:4000/backend",
    headers: {
        "Accept": "application/ json",
        "Content- Type": "application / json"
    },
    withCredentials: true,
    timeout: 5000
})


//TODO
type makeHttpQuery_t = <T>(props: { query: string, variables: object, headers?: object }, _log?: logFun_t) => Promise<T>
export const makeHttpQuery: makeHttpQuery_t = async ({ query, variables, headers }, _log) => new Promise(async (resolve, reject) => {
    const log: logFun_t = (s) => { _log && console.log("|executing Query| " + s) }
    if (_log)
        log(">>>>>>>>>>>>....")
    await myAxios.post("/admin/api", {
        query,
        variables,
        headers
    }).then(({ data }) => {
        log('[query_success] ' + JSON.stringify(data))
        resolve(data)
    }).catch((error) => {
        log('[query_failed] ' + JSON.stringify(error))
        reject(error)
    })
})


export const processAxiosError = (errData: any, _log?: logFun_t) => {
    const log: logFun_t = (s) => { _log && _log("<processAxiosError> " + s) }
    try {
        if (errData.message == "Network Error") {
            Alert.alert("Network Error", "Check your network, make sure you have internet connectivity on this device")
        } else if (!errData.success && errData.error.indexOf("passwordAuth:secret:mismatch") > -1) {
            Alert.alert("Incorrrect Password", errData?.errMsg)
        }
        else if (!errData.success && errData.error.indexOf("passwordAuth:identity:notFound") > -1) {
            Alert.alert("Incorrrect Email address", errData.errMsg ? errData.errMsg : "No user found with provided emailID ")
        }

    } catch (error) {
        const log2: logFun_t = (s) => { log("|catch| " + s) }
        log2(error)
    }
}