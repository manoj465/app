import { HUE_User_fields_no_devices } from "../user/gql"



export const HUE_Device_fields_compactUserWithNoDevices = `id
Hostname
deviceName
Mac
IP
ssid
hsv
groupName
lastState
timers{
    id
}
user{
    ${HUE_User_fields_no_devices}
}`