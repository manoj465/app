import { HUE_DEVICE_t, HUE_Device_t } from "../globalTypes"
import { logFun_t } from "../../../util/logger"



type convert_hueDevice_backendToLocal_t = (props: { devices: HUE_Device_t[], socket?: any }, _log?: logFun_t) => HUE_DEVICE_t[]
//@ts-ignore
export const convert_hueDevice_backendToLocal: convert_hueDevice_backendToLocal_t = ({ devices, socket = undefined }, _log) => {
    const log: logFun_t = (s) => { _log && _log("[convert_hueDevice_backendToLocal_t] " + s) }
    return devices.map((device, d_index) => {
        return {
            ...device,
            socket,
            hsv: { h: 0, s: 75, v: 100 }
        }
    })
}