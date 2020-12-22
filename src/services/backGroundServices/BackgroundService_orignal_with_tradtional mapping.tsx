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
  /* const deviceList = useSelector(
    ({ deviceReducer: { deviceList } }) => deviceList
  ); */
  const dispatch = useDispatch();

  useEffect(() => {
    const HeartBeat = setInterval(async () => {
      let isChange = false;
      const updatedGroupList: deviceContainerType[] = [];
      const _GL = store.getState().deviceReducer.deviceList;
      await Promise.all(
        _GL.map(async (groupFromStore, index) => {
          const debug = false;
          const preDtate = Object.assign({}, groupFromStore);
          const updatedDeviceList: deviceType[] = [];
          await Promise.all(
            groupFromStore.devices.map(
              async (deviceFromStore, deviceFromStoreIndex) => {
                const updatedDevice = Object.assign({}, deviceFromStore);
                /* Sec1: Device has Socket, Check Ping Status */
                if (deviceFromStore.socket) {
                  console.log(
                    "Device : " + deviceFromStore.Mac + " has socket"
                  );
                  const diff_msgReceived = getTimeDiffNow(
                    deviceFromStore.Last_WS_Msg_Received_Time_Stamp
                  );
                  console.log(
                    "diff_msgReceived for " +
                    deviceFromStore.Last_WS_Msg_Received_Time_Stamp +
                    " == " +
                    diff_msgReceived
                  );
                  /* Sec: Ping Timeout Exceeded -- 15 seconds*/
                  if (
                    diff_msgReceived &&
                    diff_msgReceived > 15 &&
                    deviceFromStore.socket
                  ) {
                    console.log(
                      "Device " + deviceFromStore.Mac + " Socket Disconnected"
                    );
                    deviceFromStore.socket.close();
                    updatedDevice.socket = null;
                    isChange = true;
                  } else if (
                    (diff_msgReceived && diff_msgReceived >= 3) ||
                    diff_msgReceived == null
                  ) {
                    /* Sec: Time for next Ping -- 3 Second*/
                    console.log(
                      "--last msg received Time diff > 3000-- " +
                      diff_msgReceived
                    );

                    const diff_msgSent = getTimeDiffNowInMs(
                      deviceFromStore.Last_WS_Msg_Sent_Time_Stamp
                    );
                    if (diff_msgSent > 200 || diff_msgSent == null) {
                      console.log(
                        "--last msg sent Time diff > 200-- " + diff_msgSent
                      );
                      updatedDevice.Last_WS_Msg_Sent_Time_Stamp = getCurrentTimeStamp();
                      deviceFromStore.socket.send("STATUS");
                      isChange = true;
                    } else {
                      console.log(
                        "--last msg sent Time diff < 200--" + diff_msgSent
                      );
                    }
                  }
                }
                /* Sec1: No socket Object FOund. Open New Socket  */
                if (
                  (deviceFromStore.socket == null ||
                    deviceFromStore.socket == undefined) &&
                  deviceFromStore.IP != null &&
                  deviceFromStore.IP != undefined
                ) {
                  /* Sec: AUTH prior SocketRequest */
                  try {
                    const result = await Axios.get(
                      `http://${deviceFromStore.IP}/auth`,
                      {
                        timeout: 1000,
                      }
                    );
                    if (result.data) {
                      console.log(
                        "Auth DATA :: " + JSON.stringify(result.data)
                      );
                      const _socket = await getWebSocket({
                        Mac: deviceFromStore.Mac,
                        ipAddr: deviceFromStore.IP,
                        onOpen: () => { },
                        onMsg: (msg) => {
                          store.dispatch(
                            updateMsgReceivedTimestampAction({
                              deviceMac: deviceFromStore.Mac,
                              timestamp: getCurrentTimeStamp(),
                              groupUUID: groupFromStore.groupUUID,
                            })
                          );
                        },
                        onErr: () => { },
                        onClose: () => { },
                      });
                      /* Sec: Update Socket in updatedDevice*/
                      if (_socket) {
                        isChange = true;
                        console.log(
                          "NEW SOCKET OPENED WITH--------" + updatedDevice.Mac
                        );
                        updatedDevice.Last_WS_Msg_Sent_Time_Stamp = getCurrentTimeStamp();
                        updatedDevice.socket = _socket;
                      }
                    }
                  } catch (error) {
                    /* console.log(
                  "HEARTBEAT_TRY/CATCH_BLOCK==> :: " + JSON.stringify(error)
                ); */
                  }
                }
                updatedDeviceList.push(updatedDevice);
              }
            )
          ).then(() => {
            updatedGroupList.push(
              Object.assign({}, groupFromStore, {
                devices: updatedDeviceList,
              })
            );
          });
        })
      ).then((res) => { });
      if (isChange) {
        console.log("Sending Update to Store");
        dispatch(deviceListSagaAction({ deviceList: updatedGroupList }));
      }
    }, 3000);
    return () => {
      clearInterval(HeartBeat);
    };
  }, [isTimerRunning, timeStampTable]);

  return null;
};
