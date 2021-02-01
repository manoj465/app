import UNIVERSALS from "../@universals";
import reduxStore from "../redux";
import API from "../@api";
import { logger } from "../@logger";
import deviceOperator from "./device.operator"
import * as Facebook from 'expo-facebook';
import Alert from "../components/common/Alert"


/*
'##::::::::'#######:::'######::::'#######::'##::::'##:'########::::'########:'##::::'##:'##::: ##::'######::'########:'####::'#######::'##::: ##:
 ##:::::::'##.... ##:'##... ##::'##.... ##: ##:::: ##:... ##..::::: ##.....:: ##:::: ##: ###:: ##:'##... ##:... ##..::. ##::'##.... ##: ###:: ##:
 ##::::::: ##:::: ##: ##:::..::: ##:::: ##: ##:::: ##:::: ##::::::: ##::::::: ##:::: ##: ####: ##: ##:::..::::: ##::::: ##:: ##:::: ##: ####: ##:
 ##::::::: ##:::: ##: ##::'####: ##:::: ##: ##:::: ##:::: ##::::::: ######::: ##:::: ##: ## ## ##: ##:::::::::: ##::::: ##:: ##:::: ##: ## ## ##:
 ##::::::: ##:::: ##: ##::: ##:: ##:::: ##: ##:::: ##:::: ##::::::: ##...:::: ##:::: ##: ##. ####: ##:::::::::: ##::::: ##:: ##:::: ##: ##. ####:
 ##::::::: ##:::: ##: ##::: ##:: ##:::: ##: ##:::: ##:::: ##::::::: ##::::::: ##:::: ##: ##:. ###: ##::: ##:::: ##::::: ##:: ##:::: ##: ##:. ###:
 ########:. #######::. ######:::. #######::. #######::::: ##::::::: ##:::::::. #######:: ##::. ##:. ######::::: ##::::'####:. #######:: ##::. ##:
........:::.......::::......:::::.......::::.......::::::..::::::::..:::::::::.......:::..::::..:::......::::::..:::::....:::.......:::..::::..::
*/

interface logoutFunction_props {
    cmd: "LOGOUT"
    onLogout?: () => void
}
/**
 * 
 * ## featureAddition
 * - [x] clear deviceList and reduxState upon logout
 */
const logoutFunction = ({ onLogout }: logoutFunction_props) => {
    reduxStore.store.dispatch(reduxStore.actions.appCTX.userSagaAction({ user: undefined, saveToDB: true }))
    reduxStore.store.dispatch(reduxStore.actions.deviceList.deviceListSaga({ deviceList: [], saveToDB: true }))
    reduxStore.store.dispatch(reduxStore.actions.HBReducer.HBSocketClear({}))
    if (onLogout)
        onLogout()
    return {}
}

/*
'##::::::::'#######:::'######:::'####:'##::: ##::::'########:'##::::'##:'##::: ##::'######::'########:'####::'#######::'##::: ##:
 ##:::::::'##.... ##:'##... ##::. ##:: ###:: ##:::: ##.....:: ##:::: ##: ###:: ##:'##... ##:... ##..::. ##::'##.... ##: ###:: ##:
 ##::::::: ##:::: ##: ##:::..:::: ##:: ####: ##:::: ##::::::: ##:::: ##: ####: ##: ##:::..::::: ##::::: ##:: ##:::: ##: ####: ##:
 ##::::::: ##:::: ##: ##::'####:: ##:: ## ## ##:::: ######::: ##:::: ##: ## ## ##: ##:::::::::: ##::::: ##:: ##:::: ##: ## ## ##:
 ##::::::: ##:::: ##: ##::: ##::: ##:: ##. ####:::: ##...:::: ##:::: ##: ##. ####: ##:::::::::: ##::::: ##:: ##:::: ##: ##. ####:
 ##::::::: ##:::: ##: ##::: ##::: ##:: ##:. ###:::: ##::::::: ##:::: ##: ##:. ###: ##::: ##:::: ##::::: ##:: ##:::: ##: ##:. ###:
 ########:. #######::. ######:::'####: ##::. ##:::: ##:::::::. #######:: ##::. ##:. ######::::: ##::::'####:. #######:: ##::. ##:
........:::.......::::......::::....::..::::..:::::..:::::::::.......:::..::::..:::......::::::..:::::....:::.......:::..::::..::
*/

enum loginValidationError_e {
    LOGIN_VALIDATION_EMAIL_REQUIRED = "LOGIN_VALIDATION : EMAIL REQUIRED",
    LOGIN_VALIDATION_EMAIL_INVALID = "LOGIN_VALIDATION : EMAIL INVALID",
    LOGIN_VALIDATION_PASSWORD_REQUIRED = "LOGIN_VALIDATION : PASSWORD REQUIRED",
    LOGIN_VALIDATION_PASSWORD_TOO_SHORT = "LOGIN_VALIDATION : PASSWORD TOO SHORT",
}
interface loginFunction_props {
    cmd: "LOGIN"
    email: string
    password: string
    onLoginSuccess?: (user: UNIVERSALS.GLOBALS.USER_t) => void
    onValidateDataFailed?: (props: API.baseError<any, loginValidationError_e>) => void
    onLoginFailed?: (props: Pick<API.cloudAPI.user.loginAPI._loginAPi_returnType, "ERR"> | { ERR?: API.baseError<any, loginValidationError_e> }) => void
    log?: logger
}
type loginFunction_t = (props: loginFunction_props) => Promise<API.cloudAPI.user.loginAPI._loginAPi_returnType>
/**
 * @description
 * - validates the input and return appropriate errors
 * - hit loginAPI
 * - update redux userState in case successfull response
 * - else return eoors as response
 */
const loginFunction: loginFunction_t = async ({
    email,
    password,
    onLoginFailed,
    onValidateDataFailed,
    onLoginSuccess,
    log
}) => {
    if (!email || !UNIVERSALS.util.ValidateEmail({ email })) {
        log?.print("validation : email: " + email + ", pass: " + password)
        const tempError = { errCode: loginValidationError_e.LOGIN_VALIDATION_EMAIL_REQUIRED, errMsg: "Kindly, provide a valid email address" }
        onValidateDataFailed ? onValidateDataFailed(tempError) : {}
        onLoginFailed ? onLoginFailed({ ERR: tempError }) : {}
        return {}
    } if (password && password.length < 8) {
        log?.print("validation => username: " + email + ", pass: " + password)
        const tempError = { errCode: loginValidationError_e.LOGIN_VALIDATION_PASSWORD_REQUIRED, errMsg: "Kindly, provide a valid password" }
        onValidateDataFailed ? onValidateDataFailed(tempError) : {}
        onLoginFailed ? onLoginFailed({ ERR: tempError }) : {}
        return {}
    }
    const res = await API.cloudAPI.user.loginAPI.v1({
        email,
        password,
        //log: log ? new logger("login API", log) : undefined
    })
    if (res.RES?.id) {
        log?.print("user found >>>> " + JSON.stringify(res.RES, null, 2))
        userStoreUpdateFunction({ user: UNIVERSALS.GLOBALS.convert_user_backendToLocal({ user: res.RES }) })
        log?.print("device from cloud" + JSON.stringify(res.RES.devices, null, 2))
        log?.print("device converted to local" + JSON.stringify(UNIVERSALS.GLOBALS.convert_Devices_backendToLocal({ devices: res.RES.devices ? res.RES.devices : [] }), null, 2))
        deviceOperator({
            cmd: "ADD_UPDATE_DEVICES",
            newDevices: res.RES.devices ? UNIVERSALS.GLOBALS.convert_Devices_backendToLocal({ devices: res.RES.devices }) : [],
            log: log ? new logger("device-operator add_update_devices", log) : undefined
        })
        onLoginSuccess ? onLoginSuccess(UNIVERSALS.GLOBALS.convert_user_backendToLocal({ user: res.RES })) : {}
        return res
    }
    else {
        log?.print("ERR no user found >>>>-- " + JSON.stringify(res, null, 2))
        onLoginFailed ? onLoginFailed(res) : {}
    }
    return res
}


/*
:'######::'####::'######:::'##::: ##:'##::::'##:'########:::::'########:'##::::'##:'##::: ##::'######::'########:'####::'#######::'##::: ##:
'##... ##:. ##::'##... ##:: ###:: ##: ##:::: ##: ##.... ##:::: ##.....:: ##:::: ##: ###:: ##:'##... ##:... ##..::. ##::'##.... ##: ###:: ##:
 ##:::..::: ##:: ##:::..::: ####: ##: ##:::: ##: ##:::: ##:::: ##::::::: ##:::: ##: ####: ##: ##:::..::::: ##::::: ##:: ##:::: ##: ####: ##:
. ######::: ##:: ##::'####: ## ## ##: ##:::: ##: ########::::: ######::: ##:::: ##: ## ## ##: ##:::::::::: ##::::: ##:: ##:::: ##: ## ## ##:
:..... ##:: ##:: ##::: ##:: ##. ####: ##:::: ##: ##.....:::::: ##...:::: ##:::: ##: ##. ####: ##:::::::::: ##::::: ##:: ##:::: ##: ##. ####:
'##::: ##:: ##:: ##::: ##:: ##:. ###: ##:::: ##: ##::::::::::: ##::::::: ##:::: ##: ##:. ###: ##::: ##:::: ##::::: ##:: ##:::: ##: ##:. ###:
. ######::'####:. ######::: ##::. ##:. #######:: ##::::::::::: ##:::::::. #######:: ##::. ##:. ######::::: ##::::'####:. #######:: ##::. ##:
:......:::....:::......::::..::::..:::.......:::..::::::::::::..:::::::::.......:::..::::..:::......::::::..:::::....:::.......:::..::::..::
*/

enum signupValidationError_e {
    SIGNUP_VALIDATION_EMAIL_REQUIRED = "SIGNUP_VALIDATION : EMAIL REQUIRED",
    SIGNUP_VALIDATION_EMAIL_INVALID = "SIGNUP_VALIDATION : EMAIL INVALID",
    SIGNUP_VALIDATION_PASSWORD_MISMATCH = "SIGNUP_VALIDATION : PASSWORD MISMATCH",
    SIGNUP_VALIDATION_PASSWORD_INVALID = "SIGNUP_VALIDATION : PASSWORD INVALID",
    SIGNUP_VALIDATION_PASSWORD_TOO_SHORT = "SIGNUP_VALIDATION : PASSWORD TOO SHORT",
    SIGNUP_VALIDATION_USERNAME_TOO_SHORT = "SIGNUP_VALIDATION : USERNAME_TOO_SHORT",
    SIGNUP_VALIDATION_USERNAME_REQUIRED = "SIGNUP_VALIDATION : USERNAME REQUIRED",
}
interface signupFunction_props {
    cmd: "SIGNUP"
    email: string
    password: string
    userName: string
    onSignupSuccess?: (user: UNIVERSALS.GLOBALS.USER_t) => void
    onValidateDataFailed?: (props: API.baseError<any, signupValidationError_e>) => void
    onSignupFailed?: (props: Pick<API.cloudAPI.user.signupAPI._signupAPi_returnType, "ERR"> | { ERR?: API.baseError<any, signupValidationError_e> }) => void
    log?: logger
}
type signupFunction_t = (props: signupFunction_props) => Promise<API.cloudAPI.user.signupAPI._signupAPi_returnType>
/**
 * @description
 * - validates the input and return appropriate errors
 * - hit signupAPI
 * - update redux userState in case successfull response
 * - else return eoors as response
 */
const signupFunction: signupFunction_t = async ({
    email,
    password,
    userName,
    onSignupFailed,
    onValidateDataFailed,
    onSignupSuccess,
    log
}) => {
    if (!email || email.length < 6) {
        log?.print("validation : email: " + email + ", pass: " + password)
        const tempError = { errCode: signupValidationError_e.SIGNUP_VALIDATION_EMAIL_INVALID }
        onValidateDataFailed ? onValidateDataFailed(tempError) : {}
        onSignupFailed ? onSignupFailed({ ERR: tempError }) : {}
        return {}
    } else if (!userName) {
        log?.print("validation : email: " + email + ", pass: " + password)
        const tempError = { errCode: signupValidationError_e.SIGNUP_VALIDATION_USERNAME_REQUIRED }
        onValidateDataFailed ? onValidateDataFailed(tempError) : {}
        onSignupFailed ? onSignupFailed({ ERR: tempError }) : {}
        return {}
    } else if (userName.length < 6) {
        log?.print("validation : email: " + email + ", pass: " + password)
        const tempError = { errCode: signupValidationError_e.SIGNUP_VALIDATION_USERNAME_TOO_SHORT }
        onValidateDataFailed ? onValidateDataFailed(tempError) : {}
        onSignupFailed ? onSignupFailed({ ERR: tempError }) : {}
        return {}
    }
    else if (!password || password.length < 8) {
        log?.print("validation : email: " + email + ", pass: " + password)
        const tempError = { errCode: signupValidationError_e.SIGNUP_VALIDATION_PASSWORD_INVALID }
        onValidateDataFailed ? onValidateDataFailed(tempError) : {}
        onSignupFailed ? onSignupFailed({ ERR: tempError }) : {}
        return {}
    }
    const res = await API.cloudAPI.user.signupAPI.v1({
        userName,
        email,
        password,
        log: log ? new logger("signup API", log) : undefined
    })
    log?.print("res >>>> " + JSON.stringify(res, null, 2))
    if (res.RES?.id) {
        log?.print("user >>>> " + JSON.stringify(res.RES, null, 2))
        userStoreUpdateFunction({ user: UNIVERSALS.GLOBALS.convert_user_backendToLocal({ user: res.RES }) })
        onSignupSuccess ? onSignupSuccess(UNIVERSALS.GLOBALS.convert_user_backendToLocal({ user: res.RES })) : {}
        return res
    }
    else {
        onSignupFailed ? onSignupFailed(res) : {}
    }
    return res
}



/*
'########::::'###:::::'######::'########:'########:::'#######:::'#######::'##:::'##::::'##::::::::'#######:::'######:::'####:'##::: ##:
 ##.....::::'## ##:::'##... ##: ##.....:: ##.... ##:'##.... ##:'##.... ##: ##::'##::::: ##:::::::'##.... ##:'##... ##::. ##:: ###:: ##:
 ##::::::::'##:. ##:: ##:::..:: ##::::::: ##:::: ##: ##:::: ##: ##:::: ##: ##:'##:::::: ##::::::: ##:::: ##: ##:::..:::: ##:: ####: ##:
 ######:::'##:::. ##: ##::::::: ######::: ########:: ##:::: ##: ##:::: ##: #####::::::: ##::::::: ##:::: ##: ##::'####:: ##:: ## ## ##:
 ##...:::: #########: ##::::::: ##...:::: ##.... ##: ##:::: ##: ##:::: ##: ##. ##:::::: ##::::::: ##:::: ##: ##::: ##::: ##:: ##. ####:
 ##::::::: ##.... ##: ##::: ##: ##::::::: ##:::: ##: ##:::: ##: ##:::: ##: ##:. ##::::: ##::::::: ##:::: ##: ##::: ##::: ##:: ##:. ###:
 ##::::::: ##:::: ##:. ######:: ########: ########::. #######::. #######:: ##::. ##:::: ########:. #######::. ######:::'####: ##::. ##:
..::::::::..:::::..:::......:::........::........::::.......::::.......:::..::::..:::::........:::.......::::......::::....::..::::..::
*/


enum FBLoginValidationError_e {
    FB_LOGIN_VALIDATION_EMAIL_INVALID = "FB_VALIDATION : EMAIL INVALID",
    FB_LOGIN_VALIDATION_USERNAME_INVALID = "FB_VALIDATION : USERNAME INVALID",
}
interface fbLogin_props {
    cmd: "FB_LOGIN"
    onFbLoginSuccess?: (user: UNIVERSALS.GLOBALS.USER_t) => void
    onValidateDataFailed?: (props: API.baseError<any, FBLoginValidationError_e>) => void
    onFbLoginFailed?: (props: Pick<API.cloudAPI.user.signupAPI._signupAPi_returnType | API.cloudAPI.user.loginAPI._loginAPi_returnType, "ERR"> | { ERR?: API.baseError<any, FBLoginValidationError_e> }) => void
    log?: logger
}
type fbLoginFunction_t = (props: fbLogin_props) => Promise<API.cloudAPI.user.loginAPI._loginAPi_returnType | API.cloudAPI.user.signupAPI._signupAPi_returnType>
const fbLoginFunction: fbLoginFunction_t = async ({ log, ...props }) => {
    try {
        await Facebook.initializeAsync({ appId: "366634227889659" });
        log?.print("facebook login initialized");
        const fbProps = await Facebook.logInWithReadPermissionsAsync({
            permissions: ["public_profile", "email"],
        });
        if (fbProps.type === "success") {
            // Get the user's name using Facebook's Graph API
            const response = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${fbProps.token}`);
            log?.print('fb-auth response <<< ' + JSON.stringify(response));
            let fbRes = await response.json()
            let fbEmail = fbRes.email
            let fbName = fbRes.name
            if (fbEmail && fbName) {
                log?.print("found email and username >> ")._print(fbEmail)._print(fbName)
                loginFunction({
                    cmd: "LOGIN",
                    email: "fb-" + fbEmail,
                    password: "tempFbLoginPass@1",
                    onLoginFailed: ({ ERR }) => {
                        log?.print("login failed at fbLoginFunction ")._printPretty(ERR)
                        if (ERR?.errCode == API.cloudAPI.user.loginAPI.loginApiErrors_e.LOGIN_API_UNKNOWN_EMAIL) {
                            signupFunction({
                                cmd: "SIGNUP",
                                email: "fb-" + fbEmail,
                                password: "tempFbLoginPass@1",
                                userName: fbName,
                                onSignupSuccess: (res) => {
                                    log?.print("signUp success at fbLogin")._printPretty(res)
                                    props.onFbLoginSuccess ? props.onFbLoginSuccess(res) : {}
                                },
                                onSignupFailed: (res) => {
                                    log?.print("signUp failed at fbLogin")._printPretty(res)
                                    throw new Error("signup failed");
                                }
                            })
                        }
                        else {
                            throw new Error("loginFailed");
                        }
                    },
                    onLoginSuccess: (res) => {
                        log?.print("loginSuccess at fbLogin")._printPretty(res)
                        props.onFbLoginSuccess ? props.onFbLoginSuccess(res) : {}
                    }
                })
            } else {
                log?.print("email and username not found")
                throw new Error("");
            }
        } else {
            log?.print('fb-auth initialize error >>> ');
            throw new Error("fb-auth initialize error >>> ");
        }
    } catch ({ message }) {
        log?.print('fb-auth error >>> ' + JSON.stringify(message));
        Alert.alert("Facebook Login Error:", "you can try logging in with " + (UNIVERSALS.venderConf.venderPrefix == "HUE" ? "HUElite" : UNIVERSALS.venderConf.venderPrefix) + " ID");
    }
    return {}
}


/*
'##::::'##::'######::'########:'########::::::'######::'########::'#######::'########::'########::::'##::::'##:'########::'########:::::'###::::'########:'########:
 ##:::: ##:'##... ##: ##.....:: ##.... ##::::'##... ##:... ##..::'##.... ##: ##.... ##: ##.....::::: ##:::: ##: ##.... ##: ##.... ##:::'## ##:::... ##..:: ##.....::
 ##:::: ##: ##:::..:: ##::::::: ##:::: ##:::: ##:::..::::: ##:::: ##:::: ##: ##:::: ##: ##:::::::::: ##:::: ##: ##:::: ##: ##:::: ##::'##:. ##::::: ##:::: ##:::::::
 ##:::: ##:. ######:: ######::: ########:::::. ######::::: ##:::: ##:::: ##: ########:: ######:::::: ##:::: ##: ########:: ##:::: ##:'##:::. ##:::: ##:::: ######:::
 ##:::: ##::..... ##: ##...:::: ##.. ##:::::::..... ##:::: ##:::: ##:::: ##: ##.. ##::: ##...::::::: ##:::: ##: ##.....::: ##:::: ##: #########:::: ##:::: ##...::::
 ##:::: ##:'##::: ##: ##::::::: ##::. ##:::::'##::: ##:::: ##:::: ##:::: ##: ##::. ##:: ##:::::::::: ##:::: ##: ##:::::::: ##:::: ##: ##.... ##:::: ##:::: ##:::::::
. #######::. ######:: ########: ##:::. ##::::. ######::::: ##::::. #######:: ##:::. ##: ########::::. #######:: ##:::::::: ########:: ##:::: ##:::: ##:::: ########:
:.......::::......:::........::..:::::..::::::......::::::..::::::.......:::..:::::..::........::::::.......:::..:::::::::........:::..:::::..:::::..:::::........::
*/




interface userStoreUpdareFunction_props {
    user: UNIVERSALS.GLOBALS.USER_t
    log?: logger
}
type userStoreUpdateFunction_t = (props: userStoreUpdareFunction_props) => void
export const userStoreUpdateFunction: userStoreUpdateFunction_t = async ({ user, log }) => {
    const localUserState = reduxStore.store.getState().appCTXReducer.user
    let latestUserState = user
    if (localUserState && user.ts) {
        if (localUserState.localTimeStamp > user.ts) {
            latestUserState = localUserState
            latestUserState.ts = user.ts
        }
        else if (user.ts > localUserState.localTimeStamp) {
            latestUserState = user
        }
    }
    if (latestUserState.localTimeStamp != localUserState?.localTimeStamp && latestUserState.ts != localUserState?.ts) {
        reduxStore.store.dispatch(reduxStore.actions.appCTX.userSagaAction({ user: latestUserState, saveToDB: true }))
    }
}



/*
'##::::'##:'########::'########:::::'###::::'########:'########:::::::'###::::'########::'####:
 ##:::: ##: ##.... ##: ##.... ##:::'## ##:::... ##..:: ##.....:::::::'## ##::: ##.... ##:. ##::
 ##:::: ##: ##:::: ##: ##:::: ##::'##:. ##::::: ##:::: ##:::::::::::'##:. ##:: ##:::: ##:: ##::
 ##:::: ##: ########:: ##:::: ##:'##:::. ##:::: ##:::: ######::::::'##:::. ##: ########::: ##::
 ##:::: ##: ##.....::: ##:::: ##: #########:::: ##:::: ##...::::::: #########: ##.....:::: ##::
 ##:::: ##: ##:::::::: ##:::: ##: ##.... ##:::: ##:::: ##:::::::::: ##.... ##: ##::::::::: ##::
. #######:: ##:::::::: ########:: ##:::: ##:::: ##:::: ########:::: ##:::: ##: ##::::::::'####:
:.......:::..:::::::::........:::..:::::..:::::..:::::........:::::..:::::..::..:::::::::....::
*/



enum updateValidationError_e {
    UPDATE_VALIDATION_USERNAME_INVALID = "UPDATE_VALIDATION : USERNAME INVALID/TOO SHORT",
    UPDATE_VALIDATION_PASSWORD_MISMATCH = "UPDATE_VALIDATION : NEW PASSWORD & RE-TYPE PASSWORD MISMATCH",
    UPDATE_VALIDATION_NEW_PASSWORD_TOO_SHORT = "UPDATE_VALIDATION : NEW PASSWORD TOO SHORT",
    UPDATE_VALIDATION_ID_REQUIRED = "UPDATE_VALIDATION : USERID IS REQUIRED",
    UPDATE_VALIDATION_NOTHING_TO_UPDATE = "UPDATE_VALIDATION : NOTHING TO UPDATE",
}
interface updateFunction_props {
    cmd: "UPDATE"
    id: string
    password: string
    userName: string
    onUpdateSuccess?: (user: UNIVERSALS.GLOBALS.USER_t) => void
    onValidateDataFailed?: (props: API.baseError<any, updateValidationError_e>) => void
    onUpdateFailed?: (props: Pick<API.cloudAPI.user.userUpdateAPI._userUpdate_returnType, "ERR"> | { ERR?: API.baseError<any, updateValidationError_e> }) => void
    log?: logger
}
type updateFunction_t = (props: updateFunction_props) => Promise<API.cloudAPI.user.userUpdateAPI._userUpdate_returnType>
const updateFunction: updateFunction_t = async ({
    id,
    password,
    userName,
    onUpdateFailed,
    onValidateDataFailed,
    onUpdateSuccess,
    log
}) => {
    if (!id || id.length < 10) {
        log?.print("validation => username: " + userName + ", pass: " + password)
        const tempError = { errCode: updateValidationError_e.UPDATE_VALIDATION_ID_REQUIRED }
        onValidateDataFailed ? onValidateDataFailed(tempError) : {}
        onUpdateFailed ? onUpdateFailed({ ERR: tempError }) : {}
        return {}
    } else if (userName && userName.length < 6) {
        log?.print("validation => username: " + userName + ", pass: " + password)
        const tempError = { errCode: updateValidationError_e.UPDATE_VALIDATION_USERNAME_INVALID }
        onValidateDataFailed ? onValidateDataFailed(tempError) : {}
        onUpdateFailed ? onUpdateFailed({ ERR: tempError }) : {}
        return {}
    } else if (password && password.length < 8) {
        log?.print("validation => username: " + userName + ", pass: " + password)
        const tempError = { errCode: updateValidationError_e.UPDATE_VALIDATION_NEW_PASSWORD_TOO_SHORT }
        onValidateDataFailed ? onValidateDataFailed(tempError) : {}
        onUpdateFailed ? onUpdateFailed({ ERR: tempError }) : {}
        return {}
    }
    else if (!password && !userName) {
        log?.print("validation => username: " + userName + ", pass: " + password)
        const tempError = { errCode: updateValidationError_e.UPDATE_VALIDATION_NOTHING_TO_UPDATE }
        onValidateDataFailed ? onValidateDataFailed(tempError) : {}
        onUpdateFailed ? onUpdateFailed({ ERR: tempError }) : {}
        return {}
    }
    const res = await API.cloudAPI.user.userUpdateAPI.v1({
        id,
        userName,
        password,
        log: log ? new logger("signup API", log) : undefined
    })
    log?.print("res >>>> " + JSON.stringify(res, null, 2))
    if (res.RES?.id) {
        log?.print("user >>>> " + JSON.stringify(res.RES, null, 2))
        userStoreUpdateFunction({ user: UNIVERSALS.GLOBALS.convert_user_backendToLocal({ user: res.RES }) })
        onUpdateSuccess ? onUpdateSuccess(UNIVERSALS.GLOBALS.convert_user_backendToLocal({ user: res.RES })) : {}
        return res
    }
    else {
        onUpdateFailed ? onUpdateFailed(res) : {}
    }
    return res
}







/*
'##::::'##::'######::'########:'########::::::'#######::'########::'########:'########:::::'###::::'########:'####::'#######::'##::: ##:
 ##:::: ##:'##... ##: ##.....:: ##.... ##::::'##.... ##: ##.... ##: ##.....:: ##.... ##:::'## ##:::... ##..::. ##::'##.... ##: ###:: ##:
 ##:::: ##: ##:::..:: ##::::::: ##:::: ##:::: ##:::: ##: ##:::: ##: ##::::::: ##:::: ##::'##:. ##::::: ##::::: ##:: ##:::: ##: ####: ##:
 ##:::: ##:. ######:: ######::: ########::::: ##:::: ##: ########:: ######::: ########::'##:::. ##:::: ##::::: ##:: ##:::: ##: ## ## ##:
 ##:::: ##::..... ##: ##...:::: ##.. ##:::::: ##:::: ##: ##.....::: ##...:::: ##.. ##::: #########:::: ##::::: ##:: ##:::: ##: ##. ####:
 ##:::: ##:'##::: ##: ##::::::: ##::. ##::::: ##:::: ##: ##:::::::: ##::::::: ##::. ##:: ##.... ##:::: ##::::: ##:: ##:::: ##: ##:. ###:
. #######::. ######:: ########: ##:::. ##::::. #######:: ##:::::::: ########: ##:::. ##: ##:::: ##:::: ##::::'####:. #######:: ##::. ##:
:.......::::......:::........::..:::::..::::::.......:::..:::::::::........::..:::::..::..:::::..:::::..:::::....:::.......:::..::::..::
*/

type containerListOperation_t = (props: logoutFunction_props | loginFunction_props | signupFunction_props | updateFunction_props | fbLogin_props) => Promise<{ RES?: UNIVERSALS.GLOBALS.USER_t, ERR?: API.baseError<any, any> }>
const userOperation: containerListOperation_t = async (props) => {
    switch (props.cmd) {
        case "LOGOUT":
            let logoutRes = logoutFunction(props)
            return logoutRes
            break;

        case "LOGIN":
            let loginRes = await loginFunction(props)
            return loginRes
            break;

        case "SIGNUP":
            let signupRes = await signupFunction(props)
            return signupRes
            break;

        case "UPDATE":
            let updateRes = await updateFunction(props)
            return updateRes
            break

        case "FB_LOGIN":
            let fbLoginRes = await fbLoginFunction(props)
            return fbLoginRes
            break

        default:
            break;
    }
    return {}
}

export default userOperation