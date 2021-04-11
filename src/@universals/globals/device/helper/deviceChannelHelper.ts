import { channelState_e, DEVICE_t, deviceType_e, outputChannelTypes_e } from "../types"
import { helper as colorHelper } from "../../../helper/color"

interface getHex_i {
    channelBrightnessObject?: {
        /** `value` - brightness value for active channels */
        value: number
        /** `activeChannel` array of boolean representing the actie channels at respectives index flagged as true */
        activeChannel: boolean[]
    },
    stateObject?: {
        state: channelState_e
        hsv?: {
            h?: number
            s?: number
            v?: number
        }
    },
    device: DEVICE_t
}
/** 
 * - [x] consume & handle `channelBrightnessObject` variable
 * 
 * - ### handle `channelBrightnessObject` for *handle for perticular device according to respective `outputChannelTypes_e`*
 * - [x] `outputChannelTypes_e.colorChannel_temprature`
 * - [ ] `outputChannelTypes_e.colorChannel_hsv`
 * - [x] send newState hex code upon processing and updateing channelObject
 * - [ ] make activeChannel optional in which case if activeChannel props is missing than apply the value to all channel
 * 
 * - BUG #cleared hex code not generated properly in case of channelType `UNIVERSALS.GLOBALS.outputChannelTypes_e.colorChannel_temprature`
 * - BUG for deviceType NW4 hex should be 4 pair which is currently 5 pair --resolution remove new pair addition code to newState from `line 149-150`
 */
export const getHex: (props: getHex_i) => [string | undefined, DEVICE_t] = ({ channelBrightnessObject, stateObject, ...props }) => {
    let newDevice = Object.assign({}, props.device)
    newDevice.localTimeStamp = Math.round(Date.now() / 1000)
    if (channelBrightnessObject) {
        //console.log("active channels are " + JSON.stringify(channelBrightnessObject.activeChannel))
        if (channelBrightnessObject.value < 10) {
            if (newDevice.channel.preState != channelState_e.CH_STATE_OFF)
                newDevice.channel.preState = newDevice.channel.state
            newDevice.channel.state = channelState_e.CH_STATE_OFF
        } else if (newDevice.channel.preState != undefined && newDevice.channel.preState != channelState_e.CH_STATE_OFF) {
            newDevice.channel.state = newDevice.channel.preState
        } else {
            newDevice.channel.state = channelState_e.CH_STATE_ALL_ON
        }
        let newState = "#"
        newDevice.channel.outputChannnel.forEach((channel, index) => {
            if (channel.type == outputChannelTypes_e.colorChannel_temprature) {
                /// update the brightness value to newDevice
                if (channelBrightnessObject.activeChannel[index])
                    newDevice.channel.outputChannnel[index].v = channelBrightnessObject.value < 10 ? 0 : channelBrightnessObject.value
                /// append newState with hex for this perticular channel
                if (newDevice.channel.outputChannnel[index].v <= 15)
                    newState += "0" + newDevice.channel.outputChannnel[index].v.toString(16)
                else if (newDevice.channel.outputChannnel[index].v < 5)
                    newState += "00" + newDevice.channel.outputChannnel[index].v.toString(16)
                else
                    newState += newDevice.channel.outputChannnel[index].v.toString(16)

            }
            else if (channel.type == outputChannelTypes_e.colorChannel_hsv) {
                /// update the brightness value to newDevice
                if (channelBrightnessObject.activeChannel[index])
                    newDevice.channel.outputChannnel[index].v = channelBrightnessObject.value < 10 ? 0 : channelBrightnessObject.value

                /// append newState with hex for this perticular channel
                newState += colorHelper.hsv2hex_shortRange({ hsv: [channel.h, channel.s, channelBrightnessObject.value] }).substring(1)
            }
        })
        if (newDevice.channel.outputChannnel.length == 4) // REMOVE to be removed --description additional pair addition for firmware dependency of 5 pair decoding technique/algo
            newState = newState + "00"
        return [newState, newDevice]
    }
    /**
     * @description handles colorchange in case `stateObject` is present
     */
    else if (stateObject) {
        console.log("--------state to device  " + stateObject.state)
        // Handles `CH_STATE_OFF` stateObject for all device types
        if (stateObject.state == channelState_e.CH_STATE_OFF) {
            console.log("preState  " + newDevice.channel.state)
            newDevice.channel.preState = newDevice.channel.state
            newDevice.channel.state = channelState_e.CH_STATE_OFF
            console.log("newstate to device  " + newDevice.channel.state)
            return ["#0000000000", newDevice]
        }
        // Handles `CH_STATE_RGB` stateObject for RGB device channel
        else if (stateObject.state == channelState_e.CH_STATE_RGB && newDevice.channel.deviceType == deviceType_e.deviceType_RGB) {
            if (stateObject?.hsv?.h)
                newDevice.channel.outputChannnel[0].h = stateObject?.hsv?.h
            if (stateObject?.hsv?.s)
                newDevice.channel.outputChannnel[0].s = stateObject?.hsv?.s
            if (stateObject?.hsv?.v)
                newDevice.channel.outputChannnel[0].v = stateObject?.hsv?.v
            newDevice.channel.preState = stateObject.state
            newDevice.channel.state = stateObject.state
            let newHex = colorHelper.hsv2hex_shortRange({ hsv: [newDevice.channel.outputChannnel[0].h, newDevice.channel.outputChannnel[0].s, newDevice.channel.outputChannnel[0].v] })
            return [newHex, newDevice]
        }
        // Handles `CH_STATE_ALL_ON` stateObject for NW4 device channel
        else if (stateObject.state == channelState_e.CH_STATE_ALL_ON && newDevice.channel.deviceType == deviceType_e.deviceType_NW4) {
            /**
            * - [ ] get previous brightness from each channel and if brightness is above 10(or minimum limit) than use previous brightness else user preset 80% or anything
            */
            newDevice.channel.preState = stateObject.state
            newDevice.channel.state = stateObject.state
            let newHex = "#5050505000"
            return [newHex, newDevice]
        }
    }
    return [undefined, newDevice]
}
