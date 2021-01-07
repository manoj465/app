import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Axios from "axios";
import { getWebSocket } from "./webSocket";
import {
  getTimeDiffNow,
  getTimeDiffNowInMs,
  getCurrentTimeStamp,
} from "../../util/DateTimeUtil";
import { store } from "../../../App";
import {
  deviceContainerType,
  deviceType,
} from "../../util/dummyData/DummyData";
import { updateDeviceList } from "../../util/AppUtil";
import {
  HBDeviceListReduxAction,
  updateMsgReceivedTimestampAction,
} from "../../redux/actions/HBDeviceListActions";
import { HBDeviceList_msgSentType } from "../../redux/helperSideEffect/reducers/HBReducer";

interface timeStampTable_prop {
  LAST_MSG_REC_TS: number;
  LAST_MSG_SENT_TS: number;
}
interface Props { }
export const BackgroundService = ({ }: Props) => {
  const [timeStampTable, setTimeStampTable] = useState([]);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const debug = true;
    const HeartBeat = setInterval(async () => {
      let isChange = false;
      /* const HBDevicelist_msgRec = store.getState().HBReducer
        .HBDevieclist_msgRec; */
      /* const HBDevieclist_msgRec =
        _HBDevieclist_msgRec.length > 0 ? _HBDevieclist_msgRec : []; */
      const _HBDevicelist_msgSent = store.getState().HBReducer
        .HBDevieclist_msgSent;
      /* const HBDeviceList = _HBDeviceList.length > 0 ? _HBDeviceList : []; */
      const updatedGroupList = await Promise.all(
        store
          .getState()
          .deviceReducer.deviceList.map(async (group, groupIndex) => {
            return Object.assign({}, group, {
              devices:
                1 > 2
                  ? group.devices
                  : await Promise.all(
                    group.devices.map(async (device, deviceIndex) => {
                      const __HBDevice_msgRec = store
                        .getState()
                        .HBReducer.HBDevieclist_msgRec?.find(
                          (item) => item.Mac == device.Mac
                        );
                      const __HBDevice_msgSent = store
                        .getState()
                        .HBReducer.HBDevieclist_msgSent?.find(
                          (item) => item.Mac == device.Mac
                        );
                      let HBDevice_msgSent = __HBDevice_msgSent
                        ? __HBDevice_msgSent
                        : {
                          Mac: device.Mac,
                          last_msg_sent: 0,
                        };
                      let HBDevice_msgRec = __HBDevice_msgRec
                        ? __HBDevice_msgRec
                        : {
                          Mac: device.Mac,
                          last_msg_rec: 0,
                        };
                      const updatedDevice = Object.assign({}, device);
                      /* Sec1: Device has Socket, Check Ping Status */
                      if (device.socket) {
                        //console.log("Device : " + device.Mac + " has socket");
                        const diff_msgReceived = getTimeDiffNow(
                          HBDevice_msgRec.last_msg_rec
                        );
                        console.log(
                          "TIME DIFF MSG_REC for " +
                          device.Mac +
                          " === " +
                          diff_msgReceived
                        );
                        /* Sec: Ping Timeout Exceeded -- 15 seconds*/
                        if (
                          diff_msgReceived &&
                          diff_msgReceived > 15 &&
                          device.socket
                        ) {
                          {
                            debug &&
                              console.log(
                                "TIMEOUT Device for " +
                                device.Mac +
                                " Socket Disconnected"
                              );
                          }
                          device.socket.close();
                          updatedDevice.socket = null;
                          isChange = true;
                        } else if (
                          /* Sec: Time for next Ping -- 3 Second*/
                          (diff_msgReceived && diff_msgReceived >= 3) ||
                          diff_msgReceived == null ||
                          diff_msgReceived == 0
                        ) {
                          {
                            debug &&
                              console.log(
                                "LAST MSG_REC Time diff > 3000 == " +
                                diff_msgReceived +
                                " sending Ping"
                              );
                          }
                          const diff_msgSent = getTimeDiffNowInMs(
                            HBDevice_msgSent?.last_msg_sent
                          );
                          if (diff_msgSent > 200 || diff_msgSent == null) {
                            {
                              debug &&
                                console.log(
                                  "LAST MSG_SENT DIFF > 200 " +
                                  diff_msgSent +
                                  " --- CAN SEND"
                                );
                            }
                            HBDevice_msgSent.last_msg_sent = getCurrentTimeStamp();
                            device.socket.send("STATUS");
                          } else {
                            {
                              debug &&
                                console.log(
                                  "LAST MSG_SENT DIFF < 200--" +
                                  diff_msgSent +
                                  " --- CAN'T SEND"
                                );
                            }
                          }
                        }
                      }
                      /* Sec1: No socket Object FOund. Open New Socket  */
                      if (
                        (device.socket == null ||
                          device.socket == undefined) &&
                        device.IP != null &&
                        device.IP != undefined
                      ) {
                        /* Sec: AUTH prior SocketRequest */
                        try {
                          {
                            debug &&
                              console.log(
                                "getting socket for device " + device.Mac
                              );
                          }
                          const result = await Axios.get(
                            `http://${device.IP}/auth`,
                            {
                              timeout: 1000,
                            }
                          );
                          if (result.data) {
                            /* console.log(
                              "Auth DATA :: " + JSON.stringify(result.data)
                            ); */
                            const _socket = await getWebSocket({
                              Mac: device.Mac,
                              ipAddr: device.IP,
                              onOpen: async () => { },
                              onMsg: async (msg) => {
                                store.dispatch(
                                  updateMsgReceivedTimestampAction({
                                    deviceMac: device.Mac,
                                  })
                                );
                              },
                              onErr: async () => { },
                              onClose: async () => { },
                            });
                            /* Sec: Update Socket in updatedDevice*/
                            if (_socket) {
                              isChange = true;
                              {
                                debug &&
                                  console.log(
                                    "NEW SOCKET OPENED WITH--------" +
                                    device.Mac
                                  );
                              }
                              HBDevice_msgSent.last_msg_sent = getCurrentTimeStamp();
                              updatedDevice.socket = _socket;
                            }
                          }
                        } catch (error) {
                          /* console.log(
                            "HEARTBEAT_AUTH_TRY/CATCH_BLOCK==> :: " +
                              JSON.stringify(error)
                          ); */
                        }
                      }

                      ///replace in array
                      let HBDevicefound = false;
                      _HBDevicelist_msgSent.forEach((item, HBindex) => {
                        if (item.Mac == device.Mac) {
                          HBDevicefound = true;
                          _HBDevicelist_msgSent.splice(
                            HBindex,
                            1,
                            HBDevice_msgSent
                          );
                        }
                      });

                      ///add to HBDeviceList
                      if (!HBDevicefound)
                        _HBDevicelist_msgSent.push(HBDevice_msgSent);

                      return updatedDevice;
                    })
                  ),
            });
          })
      );
      if (isChange) {
        //console.log(updatedGroupList);
        dispatch(deviceListSagaAction({ deviceList: updatedGroupList }));
      }
      dispatch(
        HBDeviceListReduxAction({ HBDeviceList: _HBDevicelist_msgSent })
      );
    }, 3000);
    return () => {
      clearInterval(HeartBeat);
    };
  }, [isTimerRunning, timeStampTable]);

  return null;
};
