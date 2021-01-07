#### componeents/screens/login

- [ ] `ios` test functionality with server over https
- [x] `android` test functionality with server over https

#### changelog

- user screen is now accountable for loggingIN/sighningUP/updateUserInfo
- ##### added appOperater to handle general userOperations and userAPIs
- added validation functionality for UserApi
- API error handling accepts `baseError` Type

#### featureAddition

- [ ] navigate to dashboard upon successfull signup

- ###### [app:: user_functionality](https://app.clickup.com/t/1ve5nj)

  - [ ] skip login/signup functionality
  - [x] route user as per user state between, update/login/signup
  - [x] logout functtionality
  - [ ] clear redux state and deviceList upon logout

  - ###### [login/signup](https://app.clickup.com/t/1vf7hj)

    - [x] create user api
    - [x] create user API response validator
    - [x] authenticate user api
    - [x] login error handling
    - [x] signup error handling

  - ###### [user password/info update](https://app.clickup.com/t/1vf7hu)

    - [x] userUpdateForm
    - [x] userUpdateAPi
    - [x] userUpdateAPI response handling
    - [x] userUpdateAPI error handling

  - ###### [user devices backup restore](https://app.clickup.com/t/1vf7hf)

    - [ ] save device from cloud to localDB after backentToFromEnd type transformation
    - [ ] send newUpdated deviceList to server upon change

  - ###### socialMedia Login
    - [ ] facebook login
    - [ ] google login

#### issues/bugs

- BUG remove userPage navigation button from dashboard screen[ top left button at dashboard]
- RESOLVED skip login Button not working
- RESOLVED skip button not updating redux userState for temp user
