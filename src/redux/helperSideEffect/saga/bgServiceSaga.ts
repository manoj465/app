import { select } from 'redux-saga/effects';
import reduxStore from '../..';
import api from '../../../@api';
import { logger } from '../../../@logger';
import UNIVERSALS from '../../../@universals';
import { getWebSocket } from '../../../services/backGroundServices/webSocket';
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
      let _deviceList: DEVICE_t[] = yield select((state: _appState) => state.deviceReducer.deviceList);
      log?.print(
        iteration +
          ' - bgService : : >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> : devicelist length - ' +
          _deviceList.length
      );
      /* @-#todo_active - move to different function 
        performSideEffects({
        user: reduxStore.store.getState().appCTXReducer.user,
        iteration,
        log: log ? new logger('performSideEffect', log) : undefined,
      }); */
      let socketContainer: HBSocketList_t[] = yield select((state: _appState) => state.HBReducer.HBSocketList);
      if (_deviceList.length) {
        _deviceList.forEach(async (device) => {
          /*  @-#todo_active - move to different function 
            syncDeviceWithBackend({
            device,
            iteration,
            user: reduxStore.store.getState().appCTXReducer.user,
            log: log ? new logger('handle_device_in_loop', log) : undefined,
          }); */
          const localSocketContainer = socketContainer.find((item) => item.Mac == device.Mac);
          if (localSocketContainer?.socket) {
            log?.print('device : ' + device.Mac + ' has socket');
            // @-#todo check socket ping interval
            if (localSocketContainer.lastMsgRecTs) {
              let timeDiff = getCurrentTimeStampInSeconds() - localSocketContainer.lastMsgRecTs;
              log?.print('socket time diff : ' + timeDiff);
              if (timeDiff >= 4 && timeDiff < 15) {
                log?.print('sending ping to device');
                localSocketContainer.socket.send('Heartbeat');
              } else {
                log?.print('time to undef the socket for device----, ' + device.Mac);
                reduxStore.store.dispatch(_actions.HBSocket({ item: { Mac: device.Mac, socket: undefined } }));
              }
            }
          } else {
            log?.print('getting socket for device : ' + device.Mac);
            let socket = null;
            let res = await api.deviceAPI.authAPI.v1({
              IP: device.IP,
              log: log ? new logger('authAPI', log) : undefined,
            });
            log?.print('authAPI from device : ' + device.Mac + ' >> ' + JSON.stringify(res));
            if (res.RES) {
              log?.print(device.ts + 'getting socket for device : ' + device.Mac);
              try {
                socket = await getWebSocket({
                  ipAddr: device.IP,
                  onOpen: () => {
                    //log("WS Connected for Devie >> " + device.Mac);
                  },
                  onMsg: (msg) => {
                    try {
                      reduxStore.store.dispatch(
                        _actions.HBSocket({ item: { Mac: device.Mac, lastMsgRecTs: getCurrentTimeStampInSeconds() } })
                      );
                      log?.print('SOCKET MSG >> ' + msg);
                    } catch (error) {
                      log?.print('socket error');
                      log?.print(error);
                    }
                  },
                  onErr: (e) => {
                    log?.print('Ws Error - ' + JSON.stringify(e));
                    reduxStore.store.dispatch(_actions.HBSocket({ item: { Mac: device.Mac, socket: undefined } }));
                  },
                  onClose: () => {
                    log?.print('socket closed');
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
