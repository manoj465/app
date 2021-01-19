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
    hsv: string,
    groupName?: string,
    lastState?: string,
    timers?: string
    user?: User_t
    //add timers to data type timers
}