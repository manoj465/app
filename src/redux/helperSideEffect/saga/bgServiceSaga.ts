import { select } from 'redux-saga/effects';
import reduxStore from '../..';
import api from '../../../@api';
import { logger } from '../../../@logger';
import UNIVERSALS from '../../../@universals';
import { appOperator } from '../../../app.operator';
import { deviceSocketHBResponse, getWebSocket } from '../../../services/backGroundServices/webSocket';
import { getCurrentTimeStampInSeconds } from '../../../util/DateTimeUtil';
import { _reduxConstant } from '../../ReduxConstant';
import { _appState } from '../../rootReducer';
import { _getWorker } from '../../sagas/sagaBaseWorkers';
import { HBSocketList_t, _actions } from '../reducers/HBReducer';

interface bgServiceSagaAction_porps {
  iteration: number;
  log?: logger;
}
export const [bgServiceWatcher, bgServiceSagaAction] = _getWorker<bgServiceSagaAction_porps>({
  type: _reduxConstant.BG_SERVICE_SAGA,
  shouldTakeLatest: true,
  callable: function* containersWorker({ iteration, log }) {
    try {
      let _deviceList: UNIVERSALS.GLOBALS.DEVICE_t[] = yield select((state: _appState) => state.deviceReducer.deviceList);
      log?.print(iteration + ' - bgService : : >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> : devicelist length - ' + _deviceList.length);
      performSideEffects({
        user: reduxStore.store.getState().appCTXReducer.user,
        iteration,
        log: log ? new logger('performSideEffect', log) : undefined,
      });
      let socketContainer: HBSocketList_t[] = yield select((state: _appState) => state.HBReducer.HBSocketList);
      if (_deviceList.length) {
        _deviceList.forEach(async (device) => {
          syncDeviceWithBackend({
            device,
            iteration,
            user: reduxStore.store.getState().appCTXReducer.user,
            log: log ? new logger('handle_device_in_loop', log) : undefined,
          });
          const localSocketContainer = socketContainer.find((item) => item.Mac == device.Mac);
          if (localSocketContainer?.socket) {
            log?.print('device : ' + device.Mac + ' has socket');
          } else {
            let socket = null;
            let res = await api.deviceAPI.authAPI.v1({
              IP: device.IP,
              //log: log ? new logger("authAPI", log) : undefined
            });
            //log?.print("authAPI from device : " + device.Mac + " >> " + JSON.stringify(res))
            if (res.RES?.Mac == device.Mac) {
              log?.print(device.ts + 'getting socket for device : ' + device.Mac);
              try {
                socket = await getWebSocket({
                  ipAddr: device.IP,
                  onOpen: () => {
                    //log("WS Connected for Devie >> " + device.Mac);
                  },
                  onMsg: (msg) => {
                    try {
                      const data: deviceSocketHBResponse | null = msg ? JSON.parse(msg) : null;
                      reduxStore.store.dispatch(_actions.HBSocket({ item: { Mac: device.Mac, lastMsgRecTs: getCurrentTimeStampInSeconds() } }));
                      //log("SOCKET MSG >> " + JSON.stringify(data))
                    } catch (error) {
                      log?.print(error);
                    }
                  },
                  onErr: (e) => {
                    log?.print('Ws Error - ' + JSON.stringify(e));
                    reduxStore.store.dispatch(_actions.HBSocket({ item: { Mac: device.Mac, socket: undefined } }));
                  },
                  onClose: () => {
                    reduxStore.store.dispatch(_actions.HBSocket({ item: { Mac: device.Mac, socket: undefined } }));
                  },
                });
                if (socket) {
                  log?.print('updating HBsocket list for device : ' + device.Mac);
                  reduxStore.store.dispatch(
                    _actions.HBSocket({
                      item: { Mac: device.Mac, socket, lastMsgRecTs: getCurrentTimeStampInSeconds() },
                    })
                  );
                } else {
                  log?.print('no socket : ' + device.Mac);
                }
              } catch (error) {
                log?.print('get socket error');
              }
            } else {
              //log?.print("no response from Auth api")
            }
          }
        });
      }
    } catch (error) {
      log?.print('try-catch error');
      log?.print(error);
    }
  },
});

/*
'##::::'##::::'###::::'####:'##::: ##:::::'######::'####:'########::'########::::'########:'########:'########:'########::'######::'########:
 ###::'###:::'## ##:::. ##:: ###:: ##::::'##... ##:. ##:: ##.... ##: ##.....::::: ##.....:: ##.....:: ##.....:: ##.....::'##... ##:... ##..::
 ####'####::'##:. ##::: ##:: ####: ##:::: ##:::..::: ##:: ##:::: ##: ##:::::::::: ##::::::: ##::::::: ##::::::: ##::::::: ##:::..::::: ##::::
 ## ### ##:'##:::. ##:: ##:: ## ## ##::::. ######::: ##:: ##:::: ##: ######:::::: ######::: ######::: ######::: ######::: ##:::::::::: ##::::
 ##. #: ##: #########:: ##:: ##. ####:::::..... ##:: ##:: ##:::: ##: ##...::::::: ##...:::: ##...:::: ##...:::: ##...:::: ##:::::::::: ##::::
 ##:.:: ##: ##.... ##:: ##:: ##:. ###::::'##::: ##:: ##:: ##:::: ##: ##:::::::::: ##::::::: ##::::::: ##::::::: ##::::::: ##::: ##:::: ##::::
 ##:::: ##: ##:::: ##:'####: ##::. ##::::. ######::'####: ########:: ########:::: ########: ##::::::: ##::::::: ########:. ######::::: ##::::
..:::::..::..:::::..::....::..::::..::::::......:::....::........:::........:::::........::..::::::::..::::::::........:::......::::::..:::::
*/

/**
 * @description performs data sideEffects for app and Cloud state sync
 *
 * @responsiblities
 * - [ ] onFirstIteration get cloudState and operate upon data
 *      - [ ] remove deleted devices from user DataSetdevicesList
 */
const performSideEffects = async ({ user, iteration, log = new logger('test function') }: { user?: UNIVERSALS.GLOBALS.USER_t; iteration: number; log?: logger }) => {
  if ((iteration == 0 || iteration % 5 == 0) && user?.id) {
    //log?.print("fetching user")
    const userRes = await api.cloudAPI.user.userQuery.v1({
      id: user.id,
      log: log ? new logger('userQueryAPI', log) : undefined,
    });
    log?.print('userQueryRes ' + JSON.stringify(userRes, null, 2));
    if (userRes.RES?.id) {
      appOperator.userStoreUpdateFunction({
        user: UNIVERSALS.GLOBALS.convert_user_backendToLocal({ user: userRes.RES }),
      });
    }
    if (userRes.RES?.devices) {
      appOperator.device({
        cmd: 'ADD_UPDATE_DEVICES',
        cloudState: true,
        newDevices: userRes.RES.devices
          ? UNIVERSALS.GLOBALS.convert_Devices_backendToLocal({
              devices: userRes.RES.devices,
              localDeviceList: reduxStore.store.getState().deviceReducer.deviceList,
            })
          : [],
        log: log ? new logger('device-operator add_update_devices', log) : undefined,
      });
    }
  } else if (iteration % 2 == 0 && user?.id) {
    const localDeletedDeviceList = reduxStore.store.getState().deviceReducer.deletedDevices;
    log?.print('deleted device list length - ' + localDeletedDeviceList.length + '  >>  ' + JSON.stringify(localDeletedDeviceList));
    if (localDeletedDeviceList.length) {
      let list = await Promise.all(
        localDeletedDeviceList.map(async (device, index) => {
          if (device.id && user.id) {
            const updateUserDevicesRes = await api.cloudAPI.user.userDeviceUpdateMutation.v1({
              id: user.id,
              deviceID: device.id,
            });
            log?.print('updateUserDeviceApiRes >> ' + JSON.stringify(updateUserDevicesRes, null, 2));
            if (updateUserDevicesRes.RES?.updateUser) {
              let deviceInMutationRes = updateUserDevicesRes.RES.updateUser.devices.find((item) => item.id == device.id);
              if (deviceInMutationRes) {
                log?.print('device still present in user DB');
                return device;
              } else {
                log?.print('device removed from user deviceList from cloud');
                return undefined;
              }
            } else {
              log?.print("coudn't get valid response from cloud, keeping device as it si in redux state");
              return device;
            }
          }
          return undefined;
        })
      );
      list = list.filter((item) => item);
      log?.print('list after performing delete operations ' + JSON.stringify(list, null, 2));
      if (localDeletedDeviceList.length != list.length) {
        log?.print('updating deleted device list in redux');
        //@ts-ignore - as newDeletedDeviceList is already filtered for undefined objects
        reduxStore.store.dispatch(reduxStore.actions.deviceList.deletedDeviceListRedux({ deletedDeviceList: list.length ? list : [] }));
      }
    }
  }
};

/*
'########::'########:'##::::'##:'####::'######::'########:::::'######::'####:'########::'########::::'########:'########:'########:'########::'######::'########:
 ##.... ##: ##.....:: ##:::: ##:. ##::'##... ##: ##.....:::::'##... ##:. ##:: ##.... ##: ##.....::::: ##.....:: ##.....:: ##.....:: ##.....::'##... ##:... ##..::
 ##:::: ##: ##::::::: ##:::: ##:: ##:: ##:::..:: ##:::::::::: ##:::..::: ##:: ##:::: ##: ##:::::::::: ##::::::: ##::::::: ##::::::: ##::::::: ##:::..::::: ##::::
 ##:::: ##: ######::: ##:::: ##:: ##:: ##::::::: ######::::::. ######::: ##:: ##:::: ##: ######:::::: ######::: ######::: ######::: ######::: ##:::::::::: ##::::
 ##:::: ##: ##...::::. ##:: ##::: ##:: ##::::::: ##...::::::::..... ##:: ##:: ##:::: ##: ##...::::::: ##...:::: ##...:::: ##...:::: ##...:::: ##:::::::::: ##::::
 ##:::: ##: ##::::::::. ## ##:::: ##:: ##::: ##: ##::::::::::'##::: ##:: ##:: ##:::: ##: ##:::::::::: ##::::::: ##::::::: ##::::::: ##::::::: ##::: ##:::: ##::::
 ########:: ########:::. ###::::'####:. ######:: ########::::. ######::'####: ########:: ########:::: ########: ##::::::: ##::::::: ########:. ######::::: ##::::
........:::........:::::...:::::....:::......:::........::::::......:::....::........:::........:::::........::..::::::::..::::::::........:::......::::::..:::::
*/

const syncDeviceWithBackend = async ({
  device,
  user,
  iteration,
  log,
}: {
  device: UNIVERSALS.GLOBALS.DEVICE_t;
  user?: UNIVERSALS.GLOBALS.USER_t;
  iteration: number;
  log?: logger;
}) => {
  log?.print('device is ' + device.Mac + ' device ID is ' + device.id);
  if (user?.id) {
    /// create new device to cloud if not found on cloud
    if (!device.id) {
      (async () => {
        log?.print('getting device ID for device ' + device.Mac + ' - ' + device.deviceName);
        const res = await api.cloudAPI.device.deviceQueryWithMac.v1({
          device,
          log: log ? new logger('device_query Api', log) : undefined,
        });
        if (res.RES?.id && device.Mac == res.RES.Mac) {
          //@ts-ignore - as we have already checked for `user.id` field
          const updateUserDevicesRes = await api.cloudAPI.user.userDeviceUpdateMutation.v1({
            id: user.id,
            deviceID: res.RES?.id,
            connect: true,
          });
          let containsDevice = false;
          if (updateUserDevicesRes.RES?.updateUser.devices.length) {
            updateUserDevicesRes.RES?.updateUser.devices.forEach((element) => {
              if (element.id == res.RES?.id) containsDevice = true;
            });
          }
          // - [ ] compare both local and api response data and save the latest one to redux store
          if (containsDevice) {
            // - [ ] update only if timestamp is latest
            /* appOperator.device({
                                cmd: "ADD_UPDATE_DEVICES",
                                newDevices: [{ ...UNIVERSALS.GLOBALS.convert_Device_backendToLocal({ device: res.RES }), localTimeStamp: device.localTimeStamp }],
                                log: log ? new logger("device-operator add/update devices", log) : undefined
                            }) */
          }
        } else if (res.ERR?.errCode == api.cloudAPI.device.deviceQueryWithMac.deviceQueryWithMacApiErrors_e.DEVICE_QUERY_NO_DEVICES_FOUND) {
          //@ts-ignore - [error]=> due to user.id(could be undefined) field. [resolution]=> but we have already check for user.id field at the begning of the method
          const createDeviceApiRes = await api.cloudAPI.device.createDeviceMutation.v1({
            device,
            userID: user.id,
            log: log ? new logger('device_create_mutation Api', log) : undefined,
          });
          if (createDeviceApiRes.RES)
            appOperator.device({
              cmd: 'ADD_UPDATE_DEVICES',
              newDevices: [
                {
                  ...UNIVERSALS.GLOBALS.convert_Device_backendToLocal({ device: createDeviceApiRes.RES }),
                  localTimeStamp: device.localTimeStamp,
                },
              ],
              log: log ? new logger('device-operator add/update devices', log) : undefined,
            });
        }
      })();
    } else if (!device.ts || (device.ts && device.localTimeStamp > device.ts))
      /** sync local state with cloud */
      (async () => {
        log?.print(device.deviceName + ' time to sync, localTimeStamp : ' + device.localTimeStamp + ', serverTimestamp : ' + device.ts);
        if (device.id) {
          let updateApiRes = await api.cloudAPI.device.updateDeviceMutation.v1({
            device: { ...device, id: device.id },
            log: log ? new logger('update device api', log) : undefined,
          });
          if (updateApiRes.RES) {
            log?.print('updated device serverts : ' + updateApiRes.RES.ts);
            // - [ ] only update upon timestamp check
            /* appOperator.device({
                            cmd: "ADD_UPDATE_DEVICES",
                            newDevices: [{ ...UNIVERSALS.GLOBALS.convert_Device_backendToLocal({ device: updateApiRes.RES }), localTimeStamp: device.localTimeStamp }],
                            log: log ? new logger("update device saga", log) : undefined
                        }) */
          }
        }
      })();
  }
};
