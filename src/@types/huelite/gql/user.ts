const ldb_fields = `id
TS
DST
DBS`

const timer_fields = `id
HR
MIN
DAYS
DT
ET
ldb{
  ${ldb_fields}
}`

const device_fields_compact = `id
deviceName
Mac
groupName
lastState
IP`

const device_fields_compact_timer = `id
deviceName
Mac
groupName
hsv
lastState
IP
timers{
  ${timer_fields}
}`

const container_fields_compact_devices = `id
groupName
groupUUID
groupAdmin
activeMode
conType
conCategory
timers
devices{
  ${device_fields_compact_timer}
}`

const user_fields_compact = ` id
userName
email
fbId
googleId`

const user_fields = ` id
userName
email
fbId
googleId
containers{
  ${container_fields_compact_devices}
}`



export const gql_getUserWithFbId = (`query(
  $fbId:String!
){
  allUsers(where:{fbId:$fbId}, first:1){
    ${user_fields}
  }
}`)


export const gql_createUser = (`mutation(
  $userName:String,
  $email:String!,
  $fbId:String,
  $googleId:String,
  $password:String
){
  createUser(data:{
    userName:$userName,
    email:$email,
    fbId:$fbId,
    googleId:$googleId,
    password:$password
  }){
    id
    userName
    email
    fbId
    googleId
  }
}`)


export const query_findUserWithEmail = (`query(
$email:String!
){
allUsers(where:{email:$email}, first:1){
  ${user_fields}
}
}`)
