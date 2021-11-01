import Axios from 'axios';
import reduxStore from '../..';
import { API } from '../../../../sternet/helpers/api';
import api from '../../../@api';
import { serverURL } from '../../../@api/baseAxios';
import { logger } from '../../../@logger';
import UNIVERSALS from '../../../@universals';
import { appOperator } from '../../../app.operator';
import { _reduxConstant } from '../../ReduxConstant';
import { _getWorker } from '../../sagas/sagaBaseWorkers';

interface backendSyncSagaAction_porps {
  iteration: number;
  log?: logger;
}
export const [backendSyncWatcher, backendSyncSagaAction] = _getWorker<backendSyncSagaAction_porps>({
  type: _reduxConstant.BACKEND_SYNC_SAGA,
  shouldTakeLatest: true,
  callable: async ({ iteration, log }) => {
    try {
      //console.log('\n\n\n\n\n\n\n\nthis is backend Sync saga worker. iteration : ' + (iteration ? iteration / 3 : 0));
      let localDeviceList: DEVICE_t[] = reduxStore.store.getState().deviceReducer.deviceList;
      let localUserState = reduxStore.store.getState().appCTXReducer.user;
      /// perform user data sync with backend
      if (localUserState?.id) {
        const userRes = await api.cloudAPI.user.userQuery.v1({
          id: localUserState.id,
          log: log ? new logger('userQueryAPI', log) : undefined,
        });
        //console.log('localState' + JSON.stringify(reduxStore.store.getState().deviceReducer.deviceList, null, 2));
        ///console.log('userQueryRes ' + JSON.stringify(userRes, null, 2));
        ///handle userObject if present
        if (userRes?.RES?.id) {
          appOperator.userStoreUpdateFunction({
            user: UNIVERSALS.GLOBALS.convert_user_backendToLocal({ user: userRes.RES }),
          });
          /// handle user devices if present
          let requireDeviceReduxUpdate = false;
          let deviceToBeUpdatedLocally: DEVICE_t[] = [];
          let deviceToBeUpdatedOnCloud: Device_t[] = [];
          let newDeviceToBeCreatedCloudList: DEVICE_t[] = [];
          let devicesToBeDeletedLocally: DEVICE_t[] = [];
          let newDeviceList = localDeviceList.map((localDeviceState, localDeviceIndex) => {
            //console.log('\n\ncurrent device : ' + localDeviceState.Mac);
            let _cloudDevice = userRes.RES?.devices?.find((item) => item.Mac == localDeviceState.Mac);
            /// device present in cloudState
            if (_cloudDevice) {
              let cloudDevice = UNIVERSALS.GLOBALS.convert_Device_backendToLocal({
                device: _cloudDevice,
                localDeviceState,
              });
              //console.log('device found in cloud state');
              //console.log('localTS : ' + localDeviceState.localTimeStamp + ', serverTS : ' + cloudDevice.localTimeStamp);
              /// compare timestamp
              if (localDeviceState.localTimeStamp != cloudDevice.ts) {
                //console.log('timestamp are not same');
                /// cloud state outdated
                if (localDeviceState.localTimeStamp > cloudDevice.localTimeStamp) {
                  //console.log('cloudTimeStamp outdated, adding to `deviceToBeUpdatedOnCloud`');
                  /// add the device to cloudUpdateList
                  deviceToBeUpdatedOnCloud.push(
                    UNIVERSALS.GLOBALS.convert_Device_LocalToBackend({
                      device: { id: cloudDevice.id, ...localDeviceState },
                    })
                  );
                  return localDeviceState;
                } /// local state outdated
                else {
                  //console.log('localTimeStamp outdated, adding to `deviceToBeUpdatedLocally`');
                  /// add the device to localUpdateList
                  deviceToBeUpdatedLocally.push(cloudDevice);
                  //console.log('returning `cloudDevice`');
                  return cloudDevice;
                }
              } /// timeStamp are same
              else {
                //console.log('timestamps are same');
                return localDeviceState;
              }
            }
            /// device not present in cloudState
            else {
              //console.log('device not present in cloudState');
              if (localDeviceState.id) {
                //console.log('device is set to be deleted');
                devicesToBeDeletedLocally.push(localDeviceState);
                return undefined;
              } else {
                //console.log('its new device, adding to `newDeviceToBeCreatedCloudList`');
                newDeviceToBeCreatedCloudList.push(localDeviceState);
                return localDeviceState;
              }
            }
            return undefined;
          });
          //console.log('\n\n\n\ncheck for any new devices in cloudState');
          let newDeviceFromCloudList = userRes.RES.devices?.filter((item) => {
            let deviceFromLocalState = localDeviceList.find((it) => it.Mac == item.Mac);
            if (deviceFromLocalState) {
              //console.log('device already present in local state');
              return false;
            }
            //console.log('device not present in local state, adding to `newDeviceFromCloud`');
            return true;
          });
          if (deviceToBeUpdatedLocally.length || devicesToBeDeletedLocally.length || newDeviceFromCloudList?.length) {
            //console.log('\ndevices in `deviceToBeUpdatedLocally` ' + JSON.stringify(deviceToBeUpdatedLocally));
            //console.log('\ndevices in `devicesToBeDeletedLocally` ' + JSON.stringify(devicesToBeDeletedLocally));
            //console.log('\ndevices in `newDeviceFromCloudList` ' + JSON.stringify(newDeviceFromCloudList));
            // - [ ] handle [`...deviceToBeUpdatedLocally`, `...newDeviceList`, `...newDeviceFromCloudList`]
            newDeviceFromCloudList?.forEach((element) => {
              newDeviceList.push(
                UNIVERSALS.GLOBALS.convert_Device_backendToLocal({
                  device: element,
                })
              );
            });
            reduxStore.store.dispatch(
              reduxStore.actions.deviceList.deviceListSaga({
                //@ts-ignore ignored the undefied object error as we have already filtered for null/undefined objects
                deviceList: newDeviceList.filter((item) => item != undefined),
                //log: props.log ? new logger('devicelist saga', props.log) : undefined,
              })
            );
          }
          if (deviceToBeUpdatedOnCloud.length) {
            //console.log('\n\n\n\ndevices in `deviceToBeUpdatedOnCloud` ' + JSON.stringify(deviceToBeUpdatedOnCloud));
            let gql = API.gql.device.getUpdateDevicesDynamicQuery(deviceToBeUpdatedOnCloud);
            //console.log('\n\nnew gql string is ' + gql);
            // - [ ] make this a apiComponent request so as to inherit same settings as API component
            let res = Axios.post(`${serverURL}/admin/api`, { query: gql }, { timeout: 5000 })
              .then((res) => {
                //console.log('response = ' + JSON.stringify(res?.data?.data, null, 2));
              })
              .catch((err) => {
                //console.log('error = ' + JSON.stringify(err));
              });
          }
          if (newDeviceToBeCreatedCloudList.length) {
            //console.log('\n\n\n\ndevices in `newDeviceToBeCreatedCloudList` ' + JSON.stringify(newDeviceToBeCreatedCloudList, null, 2));
            Promise.all(
              newDeviceToBeCreatedCloudList.map(async (newDevice, newDeviceIndex) => {
                await registerNewDevice({
                  device: newDevice,
                  //@ts-ignore - as we have already null-checked for userRes.RES.id
                  user: userRes.RES,
                });
                return newDevice;
              })
            );
            // - [ ] handle newDeviceToBeCreatedCloudList
          }
        }
      }
    } catch (error) {
      log?.print('backendSyncWatcher try-catch error');
      log?.print(error);
    }
  },
});

interface deviceObjInupdatedUserDevice_returnType {
  id: string;
  Mac: string;
  user: {
    id: string;
  };
}
const registerNewDevice = async ({ device, user, log }: { device: DEVICE_t; user: User_t; log?: logger }) => {
  log?.print('getting device ID for device ' + device.Mac + ' - ' + device.deviceName);
  const res = await api.cloudAPI.device.deviceQueryWithMac.v1({
    device,
    log: log ? new logger('device_query Api', log) : undefined,
  });
  //console.log('response from deviceQueryWithMac > ' + JSON.stringify(res));
  /// device present on cloud already, only need to connect data to new user
  if (res.RES?.id && device.Mac == res.RES.Mac) {
    //console.log('device already registered on cloud ' + res.RES.Mac);
    const updateUserDevicesRes = await api.cloudAPI.user.userDeviceUpdateMutation.v1({
      id: user.id,
      deviceID: res.RES?.id,
      connect: true,
    });
    //console.log('response from `userDeviceUpdateMutation`' + JSON.stringify(updateUserDevicesRes));
    let newConnectedDevice: deviceObjInupdatedUserDevice_returnType | undefined = undefined;
    if (updateUserDevicesRes?.RES?.updateUser?.devices.length) {
      updateUserDevicesRes.RES.updateUser.devices.forEach((element) => {
        if (element.id == res?.RES?.id) {
          newConnectedDevice = element;
        }
      });
    }
    if (newConnectedDevice) {
      //console.log('device successfully connected to user DB on cloud');
      appOperator.device({
        cmd: 'ADD_UPDATE_DEVICES',
        //@ts-ignore - id feilds null checked already
        newDevices: [{ ...device, id: newConnectedDevice.id }],
      });
      // - [ ] compare both local and api response data and save the latest one to redux store
      // NOTE: update only if cloud timestamp is latest
    }
  } /// device not present in cloud need to register device as new
  else if (
    res.ERR?.errCode ==
    api.cloudAPI.device.deviceQueryWithMac.deviceQueryWithMacApiErrors_e.DEVICE_QUERY_NO_DEVICES_FOUND
  ) {
    //console.log('device not found on cloud,trying to register');
    const createDeviceApiRes = await api.cloudAPI.device.createDeviceMutation.v1({
      device,
      userID: user.id,
      log: log ? new logger('device_create_mutation Api', log) : undefined,
    });
    //console.log('response from `createDeviceMutation` > ' + JSON.stringify(createDeviceApiRes));
    if (createDeviceApiRes.RES) {
      //console.logs('device successfully registered on cloud and connected to user');
      // - [ ] compare both local and api response data and save the latest one to redux store
      // NOTE: update only if cloud timestamp is latest
      /* appOperator.device({
        cmd: 'ADD_UPDATE_DEVICES',
        newDevices: [
          {
            ...UNIVERSALS.GLOBALS.convert_Device_backendToLocal({ device: createDeviceApiRes.RES }),
            localTimeStamp: device.localTimeStamp,
          },
        ],
        log: log ? new logger('device-operator add/update devices', log) : undefined,
      });  */
    }
  }
};
