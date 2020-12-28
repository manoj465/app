import { timestamp_i } from "../base.types";
import { HUE_Device_t, HUE_DEVICE_t } from "../device";

/** @description >- Client side Local representation of user Object */
export interface HUE_USER_t extends timestamp_i {
    id?: string,    /* if user is temp(skipped login/signup) than id is yo be undefined*/
    userName?: string,
    email: string,
    fbId?: string,
    googleId?: string
    devices?: HUE_DEVICE_t[]
}

/** @description >- backend representation of user Object */
export interface HUE_User_t extends timestamp_i {
    id: string,
    userName?: string,
    email: string,
    fbId?: string,
    googleId?: string
    devices?: HUE_Device_t[]
}