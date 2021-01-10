## universals

contains venderr specific constans

## @types

decleration of types, interface, enum and js helperFunctions

- #### user

  - added `ts:number` to backend and client side dataset
  - user gql's distributed in tqo different files `gql.ts` & `userGqlFieldsWithNoDevices.ts` to avoid import cycle

- #### container

  - added `ts:number` to backend and client side dataset
  - removed container from types

- #### Device

  - added `ts:number` to backend and client side dataset

- #### Timer and LDB

  - added `ts:number` to backend and client side dataset

- #### gqlsStrings

- [x] move gql to specific folders

## @changelogs

- added universal for vender specfic constants over project
- modified `universals` module structure
- refactor - rename=>@universals/types-@universals/globals
- removed HUE prefix from global folder types
