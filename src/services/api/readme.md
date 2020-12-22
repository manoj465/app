## API Class

#### @dependencies

- [x] axios
- [ ] appolo client

#### Working

provides a wrapper around axios and base error filtering machanism

## SubModules @v1

- #### `deviceAPI` - for interacting with HUElite Controller
  - [x] authAPI
  - [x] scanAPI
  - [ ] statusAPI
  - [ ] pairAPI
  - [ ] saveConfigAPI - optional restart param
  - [ ] modesAPI
  - [ ] setTimerAPI
  - [ ] modifyTimerAPI
- #### `cloudAPI` - for interacting with HUElite backend

  - [x] loginAPI
  - [ ] fbLoginAPI
  - [ ] signupAPI
  - ###### `user`
    - [ ] create
    - [ ] modify
    - [ ] delete
  - ###### `container`
    - [ ] create
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
