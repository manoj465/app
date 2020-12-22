import { string } from "react-native-redash";
import { logFun_t } from "../../../util/logger";
import { myAxios, makeHttpQuery } from "../axios";
import { API_USER_SIGNIN_rs_t } from '../../../@types/huelite/api/user'
import { gql_getUserWithFbId, gql_createUser } from '../../../@types/huelite/gql/user'
import { HUE_User_t, HUE_USER_t } from "../../../@types/huelite/globalTypes";
import { err_i } from "../../../@types/huelite/globalTypes"

type API_USER_SIGNIN_t = (props: { email: string, password: string }, _log?: logFun_t) => Promise<API_USER_SIGNIN_rs_t>
export const API_USER_SIGNIN: API_USER_SIGNIN_t = async ({ email, password }, _log) => new Promise(async (resolve, reject) => {
    const log: logFun_t = (s) => { _log && _log("[ API_USER_SIGNIN ] " + s) }
    await myAxios.post<API_USER_SIGNIN_rs_t>("/auth/hue/signin", {
        email: email.trim().toLowerCase(),
        password: password ? password : undefined
    }).then(async ({ data }) => {
        if (data.success) {
            log('|signin Successfull| ' + JSON.stringify(data.data))
            resolve(data)
        } else {
            log('|signin Failed| ' + JSON.stringify(data))
            reject(data)
        }

    }).catch((err) => {
        log('|signin Error| ' + JSON.stringify(err))
        if (err.errMsg)
            return reject(err)
        return reject(err)
    })
})


/**
 * @description if no user found then new user is created
 */
export interface API_FBLOGIN_rt { success: boolean, user?: HUE_User_t, newUser?: HUE_User_t, err?: err_i }
type API_FBLOGIN_t = (props: { fbId: string }, _log?: logFun_t) => Promise<API_FBLOGIN_rt>
export const API_FBLOGINnSIGNUP_Helper: API_FBLOGIN_t = async ({ fbId }, _log) => new Promise(async (resolve, reject) => {
    const log: logFun_t = (s) => { _log && _log("[API_FB LOGIN] " + s) }
    await makeHttpQuery<{ data: { allUsers: HUE_User_t[] }, }>
        (
            {
                query: gql_getUserWithFbId,
                variables: { fbId }
            },
            _log = log
        ).then(async ({ data }) => {
            console.log('[API FBLOGIN RESULT] ' + JSON.stringify(data))
            if (data.allUsers.length > 0)
                resolve({
                    success: true,
                    user: data.allUsers[0],
                })
            else {
                await makeHttpQuery<{ data: { createUser?: HUE_User_t } }>(
                    {
                        query: gql_createUser,
                        variables: {
                            email: "fb/" + fbId,
                            fbId
                        },
                    },
                    log
                ).then(({ data }) => {
                    console.log("|USER CREATED SUCCESSFULLY| " + JSON.stringify(data))
                    resolve({
                        success: true,
                        newUser: data.createUser
                    })
                }).catch((err) => {
                    if (err.errMsg)
                        return reject(err)
                    log("[USER_CREATION_FAILED]")
                    var rt: API_FBLOGIN_rt = {
                        success: false,
                        err: {
                            errCode: "USER_CREATION_FAILED",
                            errMsg: "User creation failed",
                            error: err
                        }
                    }
                    reject(rt)
                })
            }
        }).catch((err) => {
            if (err.errMsg)
                return reject(err)
            log('[API FBLOGIN ERR] ' + JSON.stringify(err))
            var rt: API_FBLOGIN_rt = {
                success: false,
                err: {
                    errCode: "UNKNOWN_ERR",
                    errMsg: "Unknown error",
                    error: err
                }
            }
            reject(rt)
        })

})




export interface API_CREATE_USER_rt { newUser?: HUE_User_t, err?: err_i }
type API_CREATE_USER_t = (props: HUE_USER_t & { password?: string }, _log?: logFun_t) => Promise<API_CREATE_USER_rt>
export const API_CREATE_USER: API_CREATE_USER_t = ({ email, password, fbId, googleId, userName }, _log) => new Promise(async (resolve, reject) => {
    const log: logFun_t = (s) => { _log && console.log("[API_CREATE_USER] " + s) }
    await makeHttpQuery<{ data: { createUser?: HUE_User_t }, errors?: any }>(
        {
            query: gql_createUser,
            variables: {
                email: email ? email.trim().toLowerCase() : fbId ? "fb/" + fbId : googleId ? "google/" + googleId : undefined,/* TODO generate random emailID for this user. required in case of skip with no email provided. create temp user */
                password,
                fbId,
                googleId,
                userName,
            },
        },
    ).then((data) => {
        log("|USRE CREATED RESPONSE| " + JSON.stringify(data))
        if (data?.data?.createUser) {
            resolve({
                newUser: data.data.createUser
            })
        }
        else if (data?.errors[0]?.message.indexOf("E11000 duplicate key error collection: huelite.users") > -1) {
            var rt: API_CREATE_USER_rt = {
                err: {
                    errCode: "DUPLICATE_EMAIL",
                    errMsg: "Email Id already registered, try logging in with the provided email ID or signup using a different email ID",
                    error: data.errors
                }
            }
            return reject(rt)
        }
        else if (data?.errors[0]?.message.indexOf("password:minLength:user:password") > -1) {
            var rt: API_CREATE_USER_rt = {
                err: {
                    errCode: "PASSWORD_MIN_LENGTH",
                    errMsg: "Password must be atleast 8 characters",
                    error: data.errors
                }
            }
            return reject(rt)
        }
        else {
            var rt: API_CREATE_USER_rt = {
                err: {
                    errCode: "USER_CREATION_FAILED",
                    errMsg: "User creation failed",
                    error: data
                }
            }
            return reject(rt)
        }
    }).catch((err) => {
        if (err.errMsg)
            return reject(err)
        log("[USER_CREATION_FAILED]" + JSON.stringify(err))
        var rt: API_CREATE_USER_rt = {
            err: {
                errCode: "USER_CREATION_FAILED",
                errMsg: "User creation failed",
                error: err
            }
        }
        return reject(rt)
    })
})


