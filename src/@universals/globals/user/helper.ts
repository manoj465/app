import UNIVERSALS from "../..";

type convert_user_backendToLocal_t = (props: { user: UNIVERSALS.GLOBALS.User_t }) => UNIVERSALS.GLOBALS.USER_t
export const convert_user_backendToLocal: convert_user_backendToLocal_t = ({ user }) => {
    return {
        ...user,
        localTimeStamp: user.ts
    }
}



type convert_user_localToBackend_t = (props: { user: UNIVERSALS.GLOBALS.USER_t }) => UNIVERSALS.GLOBALS.User_t
export const convert_user_localToBackend: convert_user_localToBackend_t = ({ user }) => {
    return {
        ...user,
        id: user.id ? user.id : "",
        ts: user.localTimeStamp
    }
}