## feature-request

- [x] convert color hex range from 1-255 to 1-100
- [x] [user_functionality](https://app.clickup.com/t/1ve5nj)
- [x] configure PairingScreen and pairing functionality with new appOperatorObject
- [x] remove `types` dependency from redux folder
- [x] remove `types` dependency from apiClass
- [x] remove `types` dependency from appOperator
- [x] remove `types` dependency from
- [x] delete @types folder after removing its dependency from app
- [x] detach deletedDeviceList device from user cloudState upon background service sideEffect and remove them from redux state upon successfull detach
- [x] colorPicker Optmization for PWA
- [x] optimize pairing screen for PWA
- [x] optimize deviceNavigator screens for web
- [x] covert colorSaga to consume hexCode
- [x] colorSaga also handles the hex conversion for perticular devices if sent colorChannel objects
- [x] customize device dataType to support multiple channel type output with custom hexconversion methods
- [ ] customize deviceCard according to deviceType
- [ ] customize colorPickerScreen according to deviceType
- [ ] getProductType function
- [ ] custom color picker screen for each product type

## bugs/fixes

- [ ] facebook login not working
- [ ] `deviceListOperation` not working in deviceSettingScreen

---

## changelog

- appOperator is now the main tunnel to redux store for user and device objects
- deviceOperator handles timestamp comparision of local state and coming device for every device
- userOperator handles user upadstes with state comparision

---

### terminology and custom regex

- `abc.ts` => `xyz.ts` - `abc` has been renamed to `xyz`
- `abc.ts` - **here major changes of `abc`**
  - more minor changes in `abc`
  - more minor changes in `abc`
- `abc`>`xyz` - state that `xyz` is in the next heirarchy level `abc`. usually subtask/folder/list/object
- [abc ::**xyz**]() - state `xyz` is the taskID of that perticular task. in this case abc

## expo build/publish checklist

- [ ] check if clean localStorage is provoded on new update first start
- [ ] check icons for android and ios
- [ ] confirm release channel
- [ ] check server address
