import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  deviceListReduxAction,
  deviceListSagaAction,
  updateMsgReceivedTimestampAction,
} from "../../redux/deviceListReducer/actions/DeviceListAction";
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
    const debug = false;
    const HeartBeat = setInterval(async () => {
      let isChange = false;
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
                      const updatedDevice = Object.assign({}, device);
                      /* Sec1: Device has Socket, Check Ping Status */
                      if (device.socket) {
                        //console.log("Device : " + device.Mac + " has socket");
                        const diff_msgReceived = getTimeDiffNow(
                          device.Last_WS_Msg_Received_Time_Stamp
                        );
                        /* console.log(
                          "TIME DIFF MSG_REC for " +
                            device.Mac +
                            " === " +
                            diff_msgReceived
                        ); */
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
                          diff_msgReceived == null
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
                            device.Last_WS_Msg_Sent_Time_Stamp
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
                            updatedDevice.Last_WS_Msg_Sent_Time_Stamp = getCurrentTimeStamp();
                            device.socket.send("STATUS");
                            isChange = true;
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
                                    timestamp: getCurrentTimeStamp(),
                                    deviceMac: device.Mac,
                                    groupUUID: group.groupUUID,
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
                                    updatedDevice.Mac
                                  );
                              }
                              updatedDevice.Last_WS_Msg_Sent_Time_Stamp = getCurrentTimeStamp();
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
                      return updatedDevice;
                    })
                  ),
            });
          })
      );
      if (true) {
        //console.log(updatedGroupList);
        updatedGroupList.forEach((group, groupIndex) => {
          group.devices.map((device, deviceIndex) => {
            if (device.socket) {
              /* console.log(
                "Device " + device.Mac + " Has socket, updating to store"
              ); */
            }
          });
        });
        dispatch(deviceListSagaAction({ deviceList: updatedGroupList }));
      }
    }, 3000);
    return () => {
      clearInterval(HeartBeat);
    };
  }, [isTimerRunning, timeStampTable]);

  return null;
};
