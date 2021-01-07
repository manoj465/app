import types from "../../@types/huelite";
import { convert_hueDevice_backendToLocal } from "../../@types/huelite/user";
import { reduxStore } from "../../redux";
import API from "../../services/api";
import { logger } from "../logger";

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
 * - [ ] clear deviceList and reduxState upon logout
 */
const logoutFunction = ({ onLogout }: logoutFunction_props) => {
    reduxStore.store.dispatch(reduxStore.actions.appCTX.userRedux({ user: undefined }))
    // - [ ] reduxStore.store.dispatch(reduxStore.actions.deviceList.deviceListSaga({deviceList:[]}))
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
    onLoginSuccess?: (user: types.HUE_USER_t) => void
    onValidateDataFailed?: (props: API.baseError<any, loginValidationError_e>) => void
    onLoginFailed?: (props: Pick<API.cloudAPI.loginAPI._loginAPi_returnType, "ERR"> | { ERR?: API.baseError<any, loginValidationError_e> }) => void
    log?: logger
}
type loginFunction_t = (props: loginFunction_props) => Promise<API.cloudAPI.loginAPI._loginAPi_returnType>
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
    if (!email || !password || password.length < 8 || email.length < 6) {
        log?.print("validation : email: " + email + ", pass: " + password)
        const tempError = { errCode: loginValidationError_e.LOGIN_VALIDATION_EMAIL_REQUIRED }
        onValidateDataFailed ? onValidateDataFailed(tempError) : {}
        onLoginFailed ? onLoginFailed({ ERR: tempError }) : {}
        return {}
    }
    const res = await API.cloudAPI.loginAPI.v1({
        email,
        password,
        log: log ? new logger("login API", log) : undefined
    })
    log?.print("res >>>> " + JSON.stringify(res, null, 2))
    if (res.RES?.id) {
        log?.print("user >>>> " + JSON.stringify(res.RES, null, 2))
        // REMOVE reduxStore.store.dispatch(reduxStore.actions.appCTX.userRedux({ user: res.RES }))
        if (res.RES.devices?.length) {
            log?.print("device from cloud" + JSON.stringify(res.RES.devices, null, 2))
            log?.print("device converted to local" + JSON.stringify(convert_hueDevice_backendToLocal({ devices: res.RES.devices }), null, 2))
        }
        onLoginSuccess ? onLoginSuccess(res.RES) : {}
        return res
    }
    else {
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
    re_password: string
    userName: string
    onSignupSuccess?: (user: types.HUE_USER_t) => void
    onValidateDataFailed?: (props: API.baseError<any, signupValidationError_e>) => void
    onSignupFailed?: (props: Pick<API.cloudAPI.signupAPI._signupAPi_returnType, "ERR"> | { ERR?: API.baseError<any, signupValidationError_e> }) => void
    log?: logger
}
type signupFunction_t = (props: signupFunction_props) => Promise<API.cloudAPI.signupAPI._signupAPi_returnType>
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
    re_password,
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
    else if (re_password != password) {
        log?.print("validation : email: " + email + ", pass: " + password)
        const tempError = { errCode: signupValidationError_e.SIGNUP_VALIDATION_PASSWORD_MISMATCH }
        onValidateDataFailed ? onValidateDataFailed(tempError) : {}
        onSignupFailed ? onSignupFailed({ ERR: tempError }) : {}
        return {}
    }
    const res = await API.cloudAPI.signupAPI.v1({
        userName,
        email,
        password,
        log: log ? new logger("signup API", log) : undefined
    })
    log?.print("res >>>> " + JSON.stringify(res, null, 2))
    if (res.RES?.id) {
        log?.print("user >>>> " + JSON.stringify(res.RES, null, 2))
        reduxStore.store.dispatch(reduxStore.actions.appCTX.userRedux({ user: res.RES }))
        onSignupSuccess ? onSignupSuccess(res.RES) : {}
        return res
    }
    else {
        onSignupFailed ? onSignupFailed(res) : {}
    }
    return res
}



/*
'##::::'##::'######::'########:'########:::::::::::'##::::'##:'########::'########:::::'###::::'########:'########::::'########:'##::::'##:'##::: ##::'######::'########:'####::'#######::'##::: ##:
 ##:::: ##:'##... ##: ##.....:: ##.... ##:::::::::: ##:::: ##: ##.... ##: ##.... ##:::'## ##:::... ##..:: ##.....::::: ##.....:: ##:::: ##: ###:: ##:'##... ##:... ##..::. ##::'##.... ##: ###:: ##:
 ##:::: ##: ##:::..:: ##::::::: ##:::: ##:::::::::: ##:::: ##: ##:::: ##: ##:::: ##::'##:. ##::::: ##:::: ##:::::::::: ##::::::: ##:::: ##: ####: ##: ##:::..::::: ##::::: ##:: ##:::: ##: ####: ##:
 ##:::: ##:. ######:: ######::: ########::::::::::: ##:::: ##: ########:: ##:::: ##:'##:::. ##:::: ##:::: ######:::::: ######::: ##:::: ##: ## ## ##: ##:::::::::: ##::::: ##:: ##:::: ##: ## ## ##:
 ##:::: ##::..... ##: ##...:::: ##.. ##:::::::::::: ##:::: ##: ##.....::: ##:::: ##: #########:::: ##:::: ##...::::::: ##...:::: ##:::: ##: ##. ####: ##:::::::::: ##::::: ##:: ##:::: ##: ##. ####:
 ##:::: ##:'##::: ##: ##::::::: ##::. ##::::::::::: ##:::: ##: ##:::::::: ##:::: ##: ##.... ##:::: ##:::: ##:::::::::: ##::::::: ##:::: ##: ##:. ###: ##::: ##:::: ##::::: ##:: ##:::: ##: ##:. ###:
. #######::. ######:: ########: ##:::. ##:'#######:. #######:: ##:::::::: ########:: ##:::: ##:::: ##:::: ########:::: ##:::::::. #######:: ##::. ##:. ######::::: ##::::'####:. #######:: ##::. ##:
:.......::::......:::........::..:::::..::.......:::.......:::..:::::::::........:::..:::::..:::::..:::::........:::::..:::::::::.......:::..::::..:::......::::::..:::::....:::.......:::..::::..::
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
    re_password: string
    userName: string
    onUpdateSuccess?: (user: types.HUE_USER_t) => void
    onValidateDataFailed?: (props: API.baseError<any, updateValidationError_e>) => void
    onUpdateFailed?: (props: Pick<API.cloudAPI.userUpdateAPI._userUpdate_returnType, "ERR"> | { ERR?: API.baseError<any, updateValidationError_e> }) => void
    log?: logger
}
type updateFunction_t = (props: updateFunction_props) => Promise<API.cloudAPI.userUpdateAPI._userUpdate_returnType>
const updateFunction: updateFunction_t = async ({
    id,
    password,
    re_password,
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
    else if (re_password != password) {
        log?.print("validation => username: " + userName + ", pass: " + password)
        const tempError = { errCode: updateValidationError_e.UPDATE_VALIDATION_PASSWORD_MISMATCH }
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
    const res = await API.cloudAPI.userUpdateAPI.v1({
        id,
        userName,
        password,
        log: log ? new logger("signup API", log) : undefined
    })
    log?.print("res >>>> " + JSON.stringify(res, null, 2))
    if (res.RES?.id) {
        log?.print("user >>>> " + JSON.stringify(res.RES, null, 2))
        reduxStore.store.dispatch(reduxStore.actions.appCTX.userRedux({ user: res.RES }))
        onUpdateSuccess ? onUpdateSuccess(res.RES) : {}
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

type containerListOperation_t = (props: logoutFunction_props | loginFunction_props | signupFunction_props | updateFunction_props) => Promise<{ RES?: types.HUE_USER_t, ERR?: API.baseError<any, any> }>
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
            break;



        default:
            break;
    }
    return {}
}

export default userOperation