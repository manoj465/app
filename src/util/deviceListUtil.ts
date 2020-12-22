import { types } from "../@types/huelite";
import { reduxStore } from "../redux";

export const getSafeDeviceList = (deviceList?: types.HUE_DEVICE_t[]) => {
    if (!deviceList)
        deviceList = reduxStore.store.getState().deviceReducer.deviceList
    return deviceList.map(device => {
        return {
            ...device,
            socket: null
        }
    })
}