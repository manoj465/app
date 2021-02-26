import { DEVICE_t, Device_t } from "../globalTypes"
import { logger } from "../../../@logger"
import { convertTimersStringToObj, converLocalTimerObjectToBackendString } from "../timer"
import { getHsvFromString } from "../../helper/color"
import { deviceType_e, deviceColorChannel_t } from "./types"
import { channel } from "redux-saga"

type convert_Devices_backendToLocal_t = (props: { devices: Device_t[], socket?: any, log?: logger }) => DEVICE_t[]
//@ts-ignore
export const convert_Devices_backendToLocal: convert_Devices_backendToLocal_t = ({ devices, socket = undefined, log }) => {
    return devices.map((device, d_index) => {
        return convert_Device_backendToLocal({ device })
    })
}

type convert_Device_backendToLocal_t = (props: { device: Device_t, log?: logger }) => DEVICE_t
export const convert_Device_backendToLocal: convert_Device_backendToLocal_t = ({ device, log }) => {
    let temp_hsv = getHsvFromString({ hsvString: device.hsv })
    let temp_timers = convertTimersStringToObj({ timersString: device.timers })
    return {
        ...device,
        hsv: temp_hsv ? temp_hsv : { h: 0, s: 100, v: 100 },
        timers: temp_timers ? temp_timers : [],
        localTimeStamp: device.ts
    }
}

type convert_Device_LocalToBackend_t = (props: { device: DEVICE_t, log?: logger }) => Device_t
export const convert_Device_LocalToBackend: convert_Device_LocalToBackend_t = ({ device, log }) => {
    const newDevice: Device_t = {
        id: device.id ? device.id : "",
        hsv: device.hsv.h + "-" + device.hsv.s + "-" + device.hsv.v,
        IP: device.IP,
        Hostname: device.Hostname,
        deviceName: device.deviceName,
        Mac: device.Mac,
        ts: device.localTimeStamp,
        channel: device.channel
    }
    if (device.timers)
        newDevice.timers = converLocalTimerObjectToBackendString({ timers: device.timers })
    return newDevice
}

type convert_Device_LocalToBackend_returnNoId_t = (props: { device: DEVICE_t, log?: logger }) => Omit<Device_t, "id">
export const convert_Device_LocalToBackend_forUpdateMutation: convert_Device_LocalToBackend_returnNoId_t = ({ device, log }) => {
    //@ts-ignore
    const newDevice: Omit<Device_t, "id"> = {
        hsv: device.hsv.h + "-" + device.hsv.s + "-" + device.hsv.v,
        IP: device.IP,
        deviceName: device.deviceName,
        ts: device.localTimeStamp
    }
    if (device.timers)
        newDevice.timers = converLocalTimerObjectToBackendString({ timers: device.timers })
    return newDevice
}


/**
 * deviceType Nomenclature
 * 
 * | - | enum Identifier(fixed) | deviceType | channel specifier(optinal) |
 * | :-- |     :----:      |   :----:   |       :----:      |
 * | description | enum identifier for global naming convention | combination of product colorChannel and category in camelCasing | channel specifier identifies the number of output channels in the perticular product |
 * | defaults: | deviceType | ------- | **c1** - if none persent than its 1 channel * all colorChannel |
 * | ex: |  | **rgbwStrip** | **c1**, **c4** |
 */


interface getDeviceType_t { (props: { Hostname: string }): deviceType_e | undefined }
export const getDeviceType: getDeviceType_t = ({ Hostname }) => {
    let deviceHostnameSplitArray = Hostname.split('_')
    if (deviceHostnameSplitArray[1] == "SP" && deviceHostnameSplitArray[2].split(":")[1] == "3")
        return deviceType_e.deviceType_rgbwDownlight

    if (deviceHostnameSplitArray[1] == "NW4" && deviceHostnameSplitArray[2].split(":")[1] == "3")
        return deviceType_e.deviceType_wDownlight_C4

    return undefined
}

