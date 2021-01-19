import { HUE_User_fields_no_devices } from "../user/userGqlFieldsWithNoDevices"



export const Device_fields_compactUserWithNoDevices = `id
Hostname
deviceName
Mac
IP
ssid
hsv
groupName
lastState
timers
ts
user{
    ${HUE_User_fields_no_devices}
}`



export const Device_fields_noUser = `id
Hostname
deviceName
Mac
IP
ssid
hsv
groupName
lastState
timers
ts`


export const getDeviceTimer_query = `query($id:ID!){
    HueDevice(where:{id:$id}){
      id
      timers
      ts
    }
  }`

export const getDeviceWithMac_query = `query($Mac: String!) {
    allHueDevices(where: { Mac: $Mac }, first: 1) {
    ${Device_fields_noUser}
    }
  }`

export const createNewDevice_mutation = `mutation(
    $userID:ID!
    $Mac:String!,
    $deviceName:String,
    $Hostname:String,
    $IP:String
    $ssid:String
    $hsv:String
    $groupName:String
    $lastState:String
    $timers:String
  ){
    createHueDevice(data:{
      Mac:$Mac,
      deviceName:$deviceName,
      Hostname:$Hostname,
      IP:$IP
      ssid:$ssid
      hsv:$hsv
      groupName:$groupName
      lastState:$lastState
      timers:$timers
      user:{connect:{id:$userID}}
    }){
    ${Device_fields_noUser}
    }
  }`


export const updateDevice_mutation = `mutation(
  $id:ID!,
  $deviceName:String,
	$IP:String
	$ssid:String
	$hsv:String
	$groupName:String
	$lastState:String
	$timers:String
  $ts:Int
){
  updateHueDevice(
    id:$id,
    data:{
    deviceName:$deviceName,
		IP:$IP
		ssid:$ssid
		hsv:$hsv
		groupName:$groupName
		lastState:$lastState
		timers:$timers
    ts:$ts
  }){
   ${Device_fields_noUser}
  }
}`