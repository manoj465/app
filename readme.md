## API Class

#### description

API class provides convineant and easy way to call API and than check for baseErrors and perform further response transformation before returning data.
`baseError` is the common error object that is expected from in case any failure

#### changelog

- data validation in now handled via appOperator - userOperator, deviceOperator
- `baseError` now serves as universal error type for All API and validation method returns
- `API folder` and `API object` import export restructured, v1 container/wrapper to whole v1 folder is removed
- container API removed
- `resolveData` an optional method added to `baseRequet` & `baseApolloRequest` with props and return type specified for transforming/resolving response or specifying error type
- `serverURL` added as global variable in `baseAxios.ts`. it had to be seprate file to avoid import cycle

#### @dependencies

- [x] axios
- [ ] logger
- [ ] appolo client

#### Working

provides a wrapper around axios and base error filtering machanism

## SubModules @v1

- [x] default http axios Request
- [x] appolo client base request for query/mutation

- #### `deviceAPI` - for interacting with HUElite Controller
  - [x] authAPI
  - [x] scanAPI
  - [x] statusAPI
  - [x] pairAPI
  - [x] saveConfigAPI - optional restart param
  - [x] modesAPI
  - [ ] setTimerAPI
  - [ ] modifyTimerAPI
- #### `cloudAPI` - for interacting with HUElite backend

  - [x] loginAPI
  - [ ] fbLoginAPI
  - [x] signupAPI
  - ###### `user`
    - [x] create
    - [ ] modify
    - [ ] delete
  - ###### `device`
    - [ ] create
    - [ ] modify
    - [ ] delete
  - ###### `timer`
    - [ ] create
    - [ ] modify
    - [ ] delete

- #### BaseErrorHandling

  - [x] Network error
  - [x] timeout error
  - [ ] 404 route doesNot exists
  - [ ] Incorrect Parameters

- [ ] move this class to `@types/huelite/api`
