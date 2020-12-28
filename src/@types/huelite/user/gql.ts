import { HUE_Device_fields_compactUserWithNoDevices } from "../device/gql"

export const HUE_User_fields = `id
userName
email
ts
devices{
  ${HUE_Device_fields_compactUserWithNoDevices}
}`

export const HUE_User_fields_no_devices = `id
userName
email
ts`


/**
 * @param userName 
 * @param email `isUnique` `isRequired`
 * @param password `min length 8` `isRequired` for user providing email. not available for temp User
 * 
 * @description mutation query for adding new user
 * 
 * @returns USER` object WithDeviceList if found else empty array
 */
export const HUE_User_create_mutationString = (`mutation(
  $userName:String,
  $email:String!,
  $password:String
){
  createUser(data:{
    userName:$userName,
    email:$email,
    password:$password
  }){
    ${HUE_User_fields}
  }
}`)

/** 
 * @param email email id to filter user
 * 
 * @description find first user matching email
 * 
 * @returns USER` object WithDeviceList if found else empty array
 */
export const HUE_User_queryString_withEmail = (`query(
$email:String!
){
allUsers(where:{email:$email}, first:1){
  ${HUE_User_fields}
}
}`)