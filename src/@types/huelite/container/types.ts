import { timestamp_i } from "../base.types";
import { HUE_Device_t, HUE_DEVICE_t } from "../device/types";
import { HUE_TIMER_group_t } from "../timer/types";
import { HUE_User_t } from "../user/types";

export enum HUE_CONTAINER_TYPE_e {
    SINGLETON = 1,
    MULTIPLE = 0,
}

export enum HUE_CONTAINER_CATEGORIES_e {
    STRIP_OW = 0,
    STRIP_CW = 1,
    STRIP_RGB = 2,
    STRIP_RGBW = 3,
    STRIP_NEO = 4,
}


/** @description >- Client side Local representation of container Object */
export interface HUE_CONTAINER_t extends timestamp_i {
    id?: string,
    conName: string;
    conUUID: string;
    conAdmin?: string;
    activeMode?: string;
    conType: HUE_CONTAINER_TYPE_e;
    conCategory?: HUE_CONTAINER_CATEGORIES_e;
    timers?: HUE_TIMER_group_t[];
    devices: HUE_DEVICE_t[];
};

/** @description >- backend representation of conatiner Object */
export interface HUE_Container_t extends timestamp_i {
    id: string,
    conName: string;
    conUUID: string;
    conAdmin?: string;
    activeMode?: string;
    conType: HUE_CONTAINER_TYPE_e;
    conCategory: HUE_CONTAINER_CATEGORIES_e;
    timers?: HUE_TIMER_group_t[];
    devices: HUE_Device_t[];
    user?: HUE_User_t
};