import { timestamp_i } from "../base.types";
import { HUE_Container_t, HUE_CONTAINER_t } from "../container/types"

/** @description >- Client side Local representation of user Object */
export interface HUE_USER_t extends timestamp_i {
    id?: string,
    userName?: string,
    email: string,
    fbId?: string,
    googleId?: string
    containers?: HUE_CONTAINER_t[]
}

/** @description >- backend representation of user Object */
export interface HUE_User_t extends timestamp_i {
    id: string,
    userName?: string,
    email: string,
    fbId?: string,
    googleId?: string
    containers: HUE_Container_t[]
}