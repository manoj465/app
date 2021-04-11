import { logger } from "../../../../@logger"
import { DEVICE_t, Device_t } from "../../globalTypes"
import { converLocalTimerObjectToBackendString, convertTimersStringToObj } from "../../timer"
import { channelState_e, deviceColorChannel_t, deviceType_e, outputChannelTypes_e } from "../types"

type convert_Devices_backendToLocal_t = (props: { devices: Device_t[], socket?: any, log?: logger }) => DEVICE_t[]
//@ts-ignore
export const convert_Devices_backendToLocal: convert_Devices_backendToLocal_t = ({ devices, socket = undefined, log }) => {
    return devices.map((device, d_index) => {
        return convert_Device_backendToLocal({ device })
    })
}

type convert_Device_backendToLocal_t = (props: { device: Device_t, log?: logger }) => DEVICE_t
export const convert_Device_backendToLocal: convert_Device_backendToLocal_t = ({ device, log }) => {
    //let temp_hsv = getHsvFromString({ hsvString: device.hsv })
    let tempChannelObject = getDefaultOutputChannel({ Hostname: device.Hostname })
    if (device.channel)
        tempChannelObject = JSON.parse(device.channel)
    let temp_timers = convertTimersStringToObj({ timersString: device.timers })
    return {
        ...device,
        channel: tempChannelObject,
        timers: temp_timers ? temp_timers : [],
        localTimeStamp: device.ts
    }
}

type convert_Device_LocalToBackend_t = (props: { device: DEVICE_t, log?: logger }) => Device_t
export const convert_Device_LocalToBackend: convert_Device_LocalToBackend_t = ({ device, log }) => {
    const newDevice: Device_t = {
        id: device.id ? device.id : "",
        IP: device.IP,
        Hostname: device.Hostname,
        deviceName: device.deviceName,
        Mac: device.Mac,
        ts: device.localTimeStamp,
        channel: JSON.stringify(device.channel)
    }
    if (device.timers)
        newDevice.timers = converLocalTimerObjectToBackendString({ timers: device.timers })
    return newDevice
}

type convert_Device_LocalToBackend_returnNoId_t = (props: { device: DEVICE_t, log?: logger }) => Omit<Device_t, "id">
/**
 * 
 * @description basically removes id props from device Object
 * 
 * @TODO
 * - [ ] add objectChannel as string to converted copy 
 */
export const convert_Device_LocalToBackend_forUpdateMutation: convert_Device_LocalToBackend_returnNoId_t = ({ device, log }) => {
    //@ts-ignore
    const newDevice: Omit<Device_t, "id"> = {
        IP: device.IP,
        deviceName: device.deviceName,
        ts: device.localTimeStamp,
        channel: JSON.stringify(device.channel)
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
    if (deviceHostnameSplitArray[1] == "SP" /*&& deviceHostnameSplitArray[2].split(":")[1] == "3" */)
        return deviceType_e.deviceType_RGBW

    if (deviceHostnameSplitArray[1] == "NW4" /* && deviceHostnameSplitArray[2].split(":")[1] == "3" */)
        return deviceType_e.deviceType_NW4

    if (deviceHostnameSplitArray[1] == "CL")
        return deviceType_e.deviceType_RGB

    return undefined
}



/**
 * 
 * @param Hostname `getDefaultOutputChannel` uses Hostnaem to define the device outputChannel Initinal state
 * 
 * 
 * @roadmap
 *  - [ ] here we apply the initail object to newDevice channel. this information will be fetched from controller in coming updates
 * 
 * @returns `deviceColorChannel_t`
 * returns initial state for the outputChannel as per deviceTYpe defined by parsing the provided`Hostname` prop
 *  @defaultReturn   /// initial channel object for `unknown` deviceType( single channel Natural White)
 */
export const getDefaultOutputChannel: (props: { Hostname: string }) => deviceColorChannel_t & { state: channelState_e, preState?: channelState_e } = ({ Hostname }) => {
    return getDeviceType({ Hostname }) == deviceType_e.deviceType_NW4
        ? { /** /// initial channel object for `NW4` */
            state: channelState_e.CH_STATE_ALL_ON,
            deviceType: deviceType_e.deviceType_NW4,
            outputChannnel: [{
                type: outputChannelTypes_e.colorChannel_temprature,
                temprature: 3000,
                v: 80
            }, {
                type: outputChannelTypes_e.colorChannel_temprature,
                temprature: 3000,
                v: 80
            }, {
                type: outputChannelTypes_e.colorChannel_temprature,
                temprature: 3000,
                v: 80
            }, {
                type: outputChannelTypes_e.colorChannel_temprature,
                temprature: 3000,
                v: 80
            },],
        }
        : getDeviceType({ Hostname }) == deviceType_e.deviceType_NW
            ? { /** /// initial channel object for `NW` */
                state: channelState_e.CH_STATE_NW,
                deviceType: deviceType_e.deviceType_NW,
                outputChannnel: [{
                    type: outputChannelTypes_e.colorChannel_temprature,
                    temprature: 3000,
                    v: 80
                }]
            }
            : getDeviceType({ Hostname }) == deviceType_e.deviceType_RGB
                ? {/** initial channelObject for `RGB` device */
                    state: channelState_e.CH_STATE_RGB,
                    deviceType: deviceType_e.deviceType_RGB,
                    outputChannnel: [{
                        type: outputChannelTypes_e.colorChannel_hsv,
                        h: 180,
                        s: 100,
                        v: 70
                    }]
                }
                : {  /** /// initial channel object for `unknown` deviceType */
                    state: channelState_e.CH_STATE_1,
                    deviceType: deviceType_e.deviceType_NW,
                    outputChannnel: [
                        {
                            type: outputChannelTypes_e.colorChannel_temprature,
                            temprature: 3000,
                            v: 80
                        }
                    ]
                }
}