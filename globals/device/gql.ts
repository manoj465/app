import { HUE_User_fields_no_devices } from "../user/userGqlFieldsWithNoDevices"



export const Device_fields_compactUserWithNoDevices = `id
Hostname
deviceName
Mac
IP
ssid
channel
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
channel
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


/**
 * @description connect/disconnect devices from userDB
 * 
 * @param connect boolean describing weather to add the given device to userDB or to remove it
 * 
 */
export const userUpdateDevicesMutationString = (connect?: boolean) => `mutation(
  $id:ID!
  $deviceID:ID!
){
  updateUser(
    id:$id
    data:{
      devices:{${connect ? "connect" : "disconnect"}:{id:$deviceID}}
    }
  ){
    id
    devices{
      id
      Mac
      channel
      user{
        id
      }
    }
  }
}`

export const createNewDevice_mutation = `mutation(
    $userID:ID!
    $Mac:String!
    $deviceName:String
    $Hostname:String
    $channel:String
    $IP:String
    $ssid:String
    $groupName:String
    $lastState:String
  ){
    createHueDevice(data:{
      Mac:$Mac
      deviceName:$deviceName
      Hostname:$Hostname
      IP:$IP
      ssid:$ssid
      channel:$channel
      groupName:$groupName
      lastState:$lastState
      user:{connect:{id:$userID}}
    }){
    ${Device_fields_noUser}
    }
  }`


export const updateDevice_mutation = `mutation(
  $id:ID!,
  $deviceName:String,
	$IP:String!
  $ssid:String
  $channel:String!
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
    channel:$channel
    groupName:$groupName
		lastState:$lastState
		timers:$timers
    ts:$ts
  }){
   ${Device_fields_noUser}
  }
}`

/**
 * @description get all devices for provided user
 * 
 * @queryParameters id - user UUID in DB
 */
export const getDeviceForUser_queryString = `query($id:ID!){
  allHueDevices(where:{user_some:{id:$id}}){
    ${Device_fields_noUser}
  }
}`

