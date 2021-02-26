import { timestamp_i, optional_timestamp_i } from "../base.types"
import { TIMER_t } from "../timer/types"
import { User_t } from "../user/types"




/** @description >- Client side Local representation of device Object */
export interface DEVICE_t extends Omit<Omit<Omit<Omit<Omit<Device_t, "id">, "hsv">, "IP">, "timers">, "ts">, optional_timestamp_i {
    id?: string,
    IP: string,
    hsv: { h: number, s: number, v: number }/** whole numbers [360, 100, 100] */
    timers: TIMER_t[]
    localTimeStamp: number
}
/** @description >- backend representation of device Object */
export interface Device_t extends timestamp_i {
    id: string,
    Hostname: string,
    deviceName: string,
    Mac: string,
    IP: string,
    ssid?: string,
    hsv?: string,
    channel: deviceColorChannel_t
    groupName?: string,
    lastState?: string,
    timers?: string
    user?: User_t
    //add timers to data type timers
}

interface deviceColorChannel_deviceType_wDownlight_C4_i {
    deviceType: deviceType_e.deviceType_wDownlight_C4
    outputChannnel: [outputChannel_tempratureValue_i, outputChannel_tempratureValue_i, outputChannel_tempratureValue_i, outputChannel_tempratureValue_i]
}
interface deviceColorChannel_deviceType_wDownlight_C1_i {
    deviceType: deviceType_e.deviceType_wDownlight_C1
    outputChannnel: [outputChannel_tempratureValue_i]
}
interface deviceColorChannel_inknown_i {
    deviceType: deviceType_e.deviceType_unknown
    outputChannnel: []
}

export type deviceColorChannel_t = deviceColorChannel_deviceType_wDownlight_C1_i
    | deviceColorChannel_deviceType_wDownlight_C4_i
    | deviceColorChannel_inknown_i


export enum deviceType_e {
    deviceType_unknown,
    deviceType_rgbStrip,
    deviceType_rgbwStrip,
    deviceType_rgbwDownlight,
    deviceType_wDownlight_C4,
    deviceType_wDownlight_C1,
}
/** 
 * @description colorChannel object types 
 *              outputChannel pair address [ 0 , 1, 2 ]
 *              Ex: #aabbcc (`aa` first pair) (`bb` second pair) (`cc` third pair)
 */
export enum outputChannelTypes_e {
    colorChannel_hsv,
    colorChannel_temprature,
}
export interface outputChannel_hue_i {
    type: outputChannelTypes_e.colorChannel_hsv
    h: number,
    s: number,
    v: number,
}
/**
 * @description single value_i for
 */
export interface outputChannel_tempratureValue_i {
    type: outputChannelTypes_e.colorChannel_temprature
    temprature: number
    v: number
}