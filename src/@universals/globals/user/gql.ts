import { Device_fields_noUser } from "../device/gql"
import { HUE_User_fields_no_devices } from "./userGqlFieldsWithNoDevices"

export const HUE_User_fields = `id
userName
email
ts
devices{
  ${Device_fields_noUser}
}`

/** 
 * @param email email id to filter user
 * 
 * @description find first user matching email
 * 
 * @returns USER` object WithDeviceList if found else empty array
 */
export const HUE_User_queryWithEmail_ = (`query(
$email:String!
){
allUsers(where:{email:$email}, first:1){
  ${HUE_User_fields}
}
}`)

/**
 * @param userName 
 * @param email `isUnique` `isRequired`
 * @param password `min length 8` `isRequired` for user providing email. not available for temp User
 * 
 * @description mutation query for adding new user
 * 
 * @returns USER` object WithDeviceList if found else empty array
 */
export const HUE_User_createMutation_ = (`mutation(
  $userName:String,
  $email:String!,
  $password:String
){
  createUser(data:{
    userName:$userName,
    email:$email,
    password:$password
  }){
    ${HUE_User_fields_no_devices}
  }
}`)


/**
 * @param email
 * @param password
 * 
 * @returns `HUE_User_t` with devices
 */
export const HUE_User_authenticateMutation_ = (`mutation(
  $email:String!,
  $password:String!
){
  authenticateUserWithPassword(email:$email, password:$password){
    item{
      ${HUE_User_fields}
    }
  }
}`)

export const HUE_User_updateMutation_ = (`mutation($id:ID!, $password:String, $userName:String){
  updateUser(id:$id, data:{
    password:$password,
    userName:$userName
  }){
    ${HUE_User_fields}
  }
}`)