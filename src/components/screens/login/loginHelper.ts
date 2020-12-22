
import { Alert } from "react-native"
import { err_i, HUE_User_t, HUE_USER_t } from "../../../@types/huelite/globalTypes"
import { processAxiosError } from "../../../services/gql_n_rest/axios"
import { API_CREATE_USER, API_CREATE_USER_rt, API_FBLOGINnSIGNUP_Helper, API_FBLOGIN_rt, API_USER_SIGNIN } from "../../../services/gql_n_rest/user/userRest"
import { logFun_t } from "../../../util/logger"
import * as Facebook from 'expo-facebook';
import { reduxStore } from "../../../redux"
import { GetStartedNavigationProp } from "."
import { convert_hueContainer_backendToLocal } from "../../../@types/huelite/user/helper"

const authServiceUrl = encodeURIComponent("/backend/auth/google/"); // we encode this, because it will be send as a query parameter
//@ts-ignore
const authServiceUrlParameter = `authServiceUrl=${authServiceUrl}`;
//@ts-ignore
const authUrl = `https://www.huelite.in/backend/auth/google/proxy?${authServiceUrlParameter}`;


export const facebookLogIn = async (navigation: GetStartedNavigationProp, _log?: logFun_t,) => {
    const log: logFun_t = (s) => { _log && _log("[FB LOGIN] " + s) }
    try {
        /*  const {
           type,
           token,
           expires,
           permissions,
           declinedPermissions,
         } = await Facebook.logInWithReadPermissionsAsync('897285013968583', {
           permissions: ['public_profile'],
         });
         if (type === 'success') {
           // Get the user's name using Facebook's Graph API
           fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,picture.height(500)`)
             .then(response => response.json())
             .then(data => {
               setLoggedinStatus(true);
               setUserData(data);
             })
             .catch(e => console.log(e))
         } else {
           // type === 'cancel'
         } */
        await Facebook.initializeAsync("366634227889659");
        log("initialized");
        const {
            type,
            token,
            /*expirationDate,
            permissions,
            declinedPermissions, */
        } = await Facebook.logInWithReadPermissionsAsync({
            permissions: ["public_profile", "email"],
        });
        if (type === 'success') {
            // Get the user's name using Facebook's Graph API
            const response = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${token}`);
            //log('response >>> ' + JSON.stringify(response));
            login({ fbId: (await response.json()).email, navigation }, log)
        } else {
            // type === 'cancel'
            //Alert.alert("Facebook Login Error:", "");
        }
    } catch ({ message }) {
        Alert.alert("Facebook Login Error:", message);
    }
}

export async function googleLogin() {

}


type login_t = (obj: { email?: string, password?: string, fbId?: string, navigation: GetStartedNavigationProp }, _log?: logFun_t) => Promise<{}>
export const login: login_t = async ({ email, password, fbId, navigation }, _log) => {
    if (email && password) {
        const log: logFun_t = (s) => { _log && _log("[login with email & pass] " + s) }
        log("email: " + email + ", pass: " + password)
        await API_USER_SIGNIN({ email, password }, log).then(async (response) => {
            //log("|success| " + JSON.stringify(response))
            if (response.success && response.data && response.data.id) {
                await processLoginData({ user: response.data, navigation }, log)
            }
        }).catch((errData) => {
            log("|error| " + JSON.stringify(errData))
            processAxiosError(errData)

        })
    } else if (fbId) {
        const log: logFun_t = (s) => { _log && _log("[loginWithFbId] " + s) }
        log("fbId :" + fbId)
        await API_FBLOGINnSIGNUP_Helper({ fbId }, log).then(async (data) => {
            if (data.success && data?.user) {
                //log("<<found User with fbId>> " + JSON.stringify(data.user))
                await processLoginData({ user: data.user, navigation }, log)
            }
            else if (data.success && data.newUser) {
                //log("<User created >> : " + JSON.stringify(data.newUser))
                await processLoginData({ user: data.newUser, navigation }, log)
            }
            else {
                log("<<Error unknown>>")
            }
        }).catch((err: API_FBLOGIN_rt) => {
            //log("<<FB LOGIN FAILED>> " + JSON.stringify(err))
            if (err?.err?.errCode == "USER_CREATION_FAILED") {
                log("user creation failed >> " + JSON.stringify(err.err.error))
            }
            Alert.alert('FB login Error!', 'you can try again or can continue by creating HUElite ID');
        })
    }
    return {}
}

type signUp_t = (props: { email: string, password: string, navigation: GetStartedNavigationProp }, log: logFun_t) => Promise<{}>
export const signUp: signUp_t = ({ email, password, navigation }, _log) => new Promise(async (resolve, reject) => {
    const log: logFun_t = (s) => { _log && _log("[SIGNUP] " + s) }
    await API_CREATE_USER({ email, password, id: "", ts: 0/* //TODO */ }).then(async (data) => {
        log("|signup success| " + JSON.stringify(data))
        if (data.newUser?.id) {
            await processLoginData({ user: data.newUser, navigation }, log)
        }
        else {

        }
    }).catch((error: API_CREATE_USER_rt | any) => {
        log("|signup error| " + JSON.stringify(error))
        if (error.err?.errCode == "DUPLICATE_EMAIL") {
            Alert.alert("User already registered!", error.err?.errMsg)
        } else if (error.err?.errCode == "PASSWORD_MIN_LENGTH") {
            Alert.alert("Minimum 8 character required for password", error.err?.errMsg)
        } else {
            log("UNKNOW ERROR")
            Alert.alert("UNKNOWN ERROR", "this could be because of network connectivity, you can try again, if the issue still persists, than try skipping the step for now. you will be able to setup your accound from User Profile Page inside the app stack")
        }
        //reject(rt)
    })
})


type processLoginData_t = (props: { user: HUE_User_t, navigation: GetStartedNavigationProp }, _log?: logFun_t) => void
export const processLoginData: processLoginData_t = async ({ user, navigation }, _log) => {
    const log: logFun_t = (s) => { _log && _log("[processLoginData] " + s) }
    log(JSON.stringify(user))
    await reduxStore.store.dispatch(reduxStore.actions.appCTX.userRedux({ user: { ...user, containers: [] }, log }))
    await reduxStore.store.dispatch(reduxStore.actions.deviceList.container.saga({ containers: convert_hueContainer_backendToLocal({ containers: user.containers }), _log: log }))
    if (user?.containers?.length) {
        log('user has devices stored in SERVER navigating to dashboard')
        navigation.replace("dashboard")
    }
    else {
        navigation.replace("pairing")
    }
}
