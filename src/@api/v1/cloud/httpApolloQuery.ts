import { logger } from "../../../@logger"
import { axiosBaseErrors_e, baseError, errMsgSuffix } from "../../baseErrors"
import { defaultRequest, defaultRequest_t } from "../../baseRequest"
import { serverURL } from "../../baseAxios"

export enum apolloErrors_e {
    /** response came but no data was received */
    APOLLO_QUERY_FAILED = "APOLLO_QUERY_FAILED",
    /** incorrect query string */
    APOLLO_BAD_QUERY = "APOLLO_BAD_QUERY",
    APOLLO_UNHANDLED = "APOLLO_UNHANDLED",

}


export interface baseApolloErrors_i {
    /**  only exists if query failed and response has be received */
    errors?: [{
        message?: string
        extensions?: {
            code?: "GRAPHQL_PARSE_FAILED" | "INTERNAL_SERVER_ERROR"
        }
    }]
}

interface baseApolloRes_i<res, err> extends baseApolloErrors_i {
    /** successfull query response can be found in `data` object */
    data?: res
}

export interface baseApolloQuery_returnType<res, err> {
    RES?: res
    ERR?: baseError<err, apolloErrors_e | axiosBaseErrors_e>
}

/**
 * @description fiew fields are omitted as they are set to default in the baseApolloRequest 
 *              and thus control to modify the values is not passed to lower level methods
 *      - `path` & `address` as path & address both are default in case apollo query post request
 */
interface baseApolloQuery_i<res, err, queryVariables, resolveReturn_t> extends Omit<Omit<Omit<Omit<defaultRequest_t<"", "", "">, "path">, "address">, "method">, "resolveData"> {
    query: string
    variables: queryVariables
    log?: logger
    /** resolve  */
    resolveData?: (s: baseApolloQuery_returnType<res, err>) => resolveReturn_t
}
type fun_t = <res, err, queryVariables, resolveReturn_t>
    (props: baseApolloQuery_i<res, err, queryVariables, resolveReturn_t>)
    => Promise<baseApolloQuery_returnType<res, err>>

const fun: fun_t =
    async <res, err, queryVariables, resolveReturn_t>({
        resolveData = (s: any) => { return s },
        log,
        ...props
    }: baseApolloQuery_i<res, err, queryVariables, resolveReturn_t>) => {
        var queryResponse = await defaultRequest<res & baseApolloRes_i<res, err>, err & baseApolloErrors_i, baseApolloQuery_returnType<baseApolloRes_i<res, err>, baseApolloErrors_i>>({
            method: "post",
            address: serverURL,
            path: "/admin/api",
            body: {
                query: props.query,
                variables: props.variables,
            },
            config: props.config,
            /**
             * @param 
             * - `RES` with data, `ERR` with error
             * - `possible error entries` - RES.errors[0] || ERR.error.errors[0]
             * @dataManuplation 
             * - `ERR.error ==> ERR.error.errors[0]`<br>
             *   - `ERR.error.errors[0]` : [ { message :string, extensions:string } ]
             *   - `ERR.error`{ message :string, extensions:string }`
             */
            resolveData: ({ RES, ERR }) => {

                /**
                 * @description
                 *      checks for specific errors
                 * @errorHandled
                 * - `BAD_QUERY` - apollo query string syntax not correct
                 * 
                 * @returns
                 * to end the resolveData callback chain return resolved error object other than undefined
                 * - `undefined` continue to the next resolveData call
                 * - `errors : any` return errors[0] 
                 * 
                 */
                const processErrors = (error: baseApolloErrors_i) => {
                    log?.print("checking Local errors")
                    if (error && error.errors) {
                        if (error.errors[0].extensions?.code == "GRAPHQL_PARSE_FAILED") {
                            log?.print("BAD query error found")
                            return { ERR: { errCode: apolloErrors_e.APOLLO_BAD_QUERY } }
                        }
                    }
                    return undefined
                }

                if (RES) {
                    log?.print("RES - resolve Data" + JSON.stringify(RES))
                    if (RES?.errors instanceof Array) {
                        log?.print("RES - errors object exists in 'RES' object" + JSON.stringify(RES, null, 2))
                        let tempErr = processErrors(RES)
                        if (tempErr != undefined) {
                            log?.print("RES - error found breaking chain" + JSON.stringify(RES.errors, null, 2))
                            return tempErr
                        } else {
                            log?.print("RES - sending data to next function in chain to be resolved")
                            //@ts-ignore
                            return resolveData({ ERR: { errCode: apolloErrors_e.QUERY_FAILED, error: RES.errors[0] } })
                        }
                    }
                    if (RES?.data)
                        return resolveData({ RES: RES.data })
                }
                if (ERR) {
                    log?.print("ERR - resolve Data" + JSON.stringify(ERR))
                    if (ERR?.error?.errors instanceof Array) {
                        log?.print("ERR - errors object in ERR exists" + JSON.stringify(ERR, null, 2))
                        let tempErr = processErrors(ERR.error)
                        if (tempErr != undefined) {
                            log?.print("ERR - BadQuery error found breaking resolveData change" + JSON.stringify(ERR.error.errors, null, 2))
                            return tempErr
                        } else {
                            log?.print("ERR - No error found at this level. sendind data to be resolved to next function in chain with failed query error")
                            //@ts-ignore
                            return resolveData({ ERR: { errCode: apolloErrors_e.QUERY_FAILED, error: ERR.error.errors[0] } })
                        }
                    }
                    log?.print("ERR - sending error to next level")
                    return resolveData({ ERR })
                }
                return { ERR: { errCode: apolloErrors_e.APOLLO_UNHANDLED } }
            },
            log: log ? new logger("base request", log) : undefined
        }).then(res => res).catch(err => err)
        return queryResponse
    }


export default fun
