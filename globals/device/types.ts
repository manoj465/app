import { timestamp_i, optional_timestamp_i } from "../base.types"
import { TIMER_t } from "../timer/types"
import { User_t } from "../user/types"




/** @description >- Client side Local representation of device Object */
export interface DEVICE_t extends Omit<Omit<Omit<Omit<Omit<Omit<Device_t, "id">, "hsv">, "IP">, "timers">, "ts">, "channel">, optional_timestamp_i {
    id?: string,
    IP: string,
    channel: deviceColorChannel_t & { state: channelState_e, preState?: channelState_e }
    timers: TIMER_t[]
    localTimeStamp: number
}
/** @description >- backend representation of device Object */
export interface Device_t extends timestamp_i {
    id: string
    Hostname: string
    deviceName: string
    Mac: string
    IP: string
    ssid?: string
    channel: string
    groupName?: string
    lastState?: string
    timers?: string
    user?: User_t
    //add timers to data type timers
}

interface deviceColorChannel_deviceType_NW4_i {
    deviceType: deviceType_e.deviceType_NW4
    outputChannnel: [outputChannel_tempratureValue_i, outputChannel_tempratureValue_i, outputChannel_tempratureValue_i, outputChannel_tempratureValue_i]
}
interface deviceColorChannel_deviceType_NW_i {
    deviceType: deviceType_e.deviceType_NW
    outputChannnel: [outputChannel_tempratureValue_i]
}

interface deviceColorChannel_deviceType_RGB_i {
    deviceType: deviceType_e.deviceType_RGB
    outputChannnel: [outputChannel_hue_i]
}

interface deviceColorChannel_deviceType_RGBW_i {
    deviceType: deviceType_e.deviceType_RGBW
    outputChannnel: [outputChannel_hue_i, outputChannel_tempratureValue_i]
}

export enum channelState_e {
    CH_STATE_OFF,
    CH_STATE_1,
    CH_STATE_2,
    CH_STATE_3,
    CH_STATE_4,
    CH_STATE_5,
    CH_STATE_RGB,
    CH_STATE_CW,
    CH_STATE_WW,
    CH_STATE_NW,
    CH_STATE_ALL_ON,
}

export type deviceColorChannel_t =
    deviceColorChannel_deviceType_NW_i
    | deviceColorChannel_deviceType_NW4_i
    | deviceColorChannel_deviceType_RGB_i
    | deviceColorChannel_deviceType_RGBW_i


export enum deviceType_e {
    deviceType_unknown,
    deviceType_RGB,
    deviceType_RGBW,
    deviceType_NW4,
    deviceType_NW,
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

