import { HUE_User_t } from "../globalTypes";

export interface API_USER_SIGNIN_rs_t {
    success: boolean
    error?: string
    data?: HUE_User_t
}