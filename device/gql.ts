import { HUE_User_fields_no_devices } from "../user/userGqlFieldsWithNoDevices"



export const HUE_Device_fields_compactUserWithNoDevices = `id
Hostname
deviceName
Mac
IP
ssid
hsv
groupName
lastState
timers
user{
    ${HUE_User_fields_no_devices}
}`



export const HUE_Device_fields_noUser = `id
Hostname
deviceName
Mac
IP
ssid
hsv
groupName
lastState
timers`