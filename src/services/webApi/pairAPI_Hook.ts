import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  getWebSocket,
  deviceSocketHBResponse,
} from "../backGroundServices/webSocket";
import api from "../api"

export enum pairing_state_e {
  IDLE,
  AUTH_FAILED,
  NO_SOCKET,
  PAIR_READY,
  PAIR_REQUEST_SENT,
  PAIR_REQUEST_SUCCESS_N_CONNECTING,
  PAIR_UNKNOWN_ERROR,
  PAIR_SUCCESS,
  PAIR_WRONG_PASSWORD,
  PAIR_NO_SSID,
  PAIR_NO_RESPONSE,
  PAIR_TIMEOUT,
  SOCKET_ERROR,
  SAVE_CONFIG_SUCCESS,
  SAVE_CONFIG_ERROR
}
type connectProps = (ssid: string, pass: string) => Promise<void>;

interface Props {
  (_props: { IP: string; _onMsg: (msg: string) => void }): [
    WebSocket | null,
    string,
    connectProps,
    pairing_state_e,
  ];
}
const usePairApiHook: Props = ({ IP: IP_ADD, _onMsg }) => {
  const [pairingTimeCounter, SetPairingTimeCounter] = useState(0);
  const [IP, setIP] = useState<string>("");
  const [pairStatus, setPairStatus] = useState<pairing_state_e>(pairing_state_e.IDLE);
  const [error, setError] = useState(false);
  const [isSocketConnecting, setIsSocketConnecting] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [lastTimestamp, setLastTimestamp] = useState(0);

  const getCurrentTimeStamp = () => {
    let timestamp = new Date().getTime();
    return Math.round(timestamp);
  };

  const getTimeDiffNow = (timeStamp: number) => {
    if (timeStamp)
      return Math.round((getCurrentTimeStamp() - timeStamp) / 1000);
    return null;
  };

  const pair: connectProps = async (ssid, pass) => {
    console.log("Pair Credentials are " + ssid + " -- " + pass);
    if (pairStatus == pairing_state_e.PAIR_READY || pairStatus == pairing_state_e.PAIR_WRONG_PASSWORD || pairStatus == pairing_state_e.PAIR_UNKNOWN_ERROR) {
      setPairStatus(pairing_state_e.PAIR_REQUEST_SENT);
      SetPairingTimeCounter(0);
      const result = await api.v1.deviceAPI.pairAPI(ssid, pass)
      if (result.RES?.MAC) {
        console.log("Pair Request Data Came" + JSON.stringify(result));
        setPairStatus(pairing_state_e.PAIR_REQUEST_SUCCESS_N_CONNECTING);
      } else {
        console.log("PAIR API FAILED >> ", JSON.stringify(result));
        setPairStatus(pairing_state_e.PAIR_UNKNOWN_ERROR);
      }
    } else if (pairStatus == pairing_state_e.PAIR_SUCCESS) {
      console.log("[hitSaveAPI]")
      const res = await api.v1.deviceAPI.saveWiFiConfigAPI()
      if (res.RES == "RES-551") {
        console.log("[hitSaveAPI] success")
        setPairStatus(pairing_state_e.SAVE_CONFIG_SUCCESS)
      }
      else if (res.ERR?.data == "ERR-048" || res.ERR?.errCode) {
        console.log("[hitSaveAPI] error")
        setPairStatus(pairing_state_e.SAVE_CONFIG_ERROR)
      } else if (pairStatus < pairing_state_e.PAIR_READY) {
        //TODO alert for not yet ready
      }

    }
    else {
      //TODO alert for not ready
    }
  }



  async function getSocket() {
    if (socket == null) {
      setIsSocketConnecting(true);
      let state = pairStatus
      let result
      if (pairStatus == pairing_state_e.IDLE || pairStatus == pairing_state_e.AUTH_FAILED)
        result = await api.v1.deviceAPI.authAPI()
      if (result?.RES?.Mac) {
        if (pairStatus != pairing_state_e.NO_SOCKET) {
          setPairStatus(pairing_state_e.NO_SOCKET)
          state = pairing_state_e.NO_SOCKET
        }
        console.log("Auth success :: " + result.RES.Mac);
      } else {
        //console.log("No Data received -- -- Starting Timeout");
        if (pairStatus != pairing_state_e.AUTH_FAILED)
          setPairStatus(pairing_state_e.AUTH_FAILED)
        setTimeout(async () => {
          await getSocket();
        }, 5000);
      }
      console.log("check if socket required")
      if (state == pairing_state_e.NO_SOCKET)
        try {
          const _socket = await getWebSocket({
            Mac: "",
            ipAddr: IP_ADD,
            onOpen: () => {
              setSocket(_socket);
              setIsSocketConnecting(false);
              console.log("WS Connected for Devie >> " + IP_ADD);
            },
            onMsg: (msg) => {
              const d = getCurrentTimeStamp();
              try {
                const data: deviceSocketHBResponse | null = msg
                  ? JSON.parse(msg)
                  : null;
                setLastTimestamp(d);
                console.log("SOCKET MSG >> " + JSON.stringify(data))
                if (data?.WIFI_STATUS == "WL_CONNECT_FAILED" && pairStatus != pairing_state_e.PAIR_WRONG_PASSWORD)
                  setPairStatus(pairing_state_e.PAIR_WRONG_PASSWORD)
                else if (data?.WIFI_STATUS == "WL_CONNECTED" && data.IP?.length) {
                  setPairStatus(pairing_state_e.PAIR_SUCCESS)
                  setIP(data.IP)
                } else if (data?.WIFI_STATUS == "WL_NO_SSID_AVAIL")
                  setPairStatus(pairing_state_e.PAIR_NO_SSID)
                else if (data?.WIFI_STATUS == "UNKNOWN")
                  setPairStatus(pairing_state_e.PAIR_UNKNOWN_ERROR)
                /* if (data?.WIFI_STATUS == "WL_CONNECTED" && data.IP_ADD) {
                  setIP(data.IP_ADD);
                  console.log("Device is connected >>>>>>>>" + IP);
                  setPairStatus(4);
                } else if (data?.WIFI_STATUS == "WL_CONNECT_FAILED") {
                  console.log(
                    "Device Connection Failed---------InCorrect Password Entered--" +
                    data.WIFI_STATUS
                  );
                  setPairStatus(5);
                } else if (data?.WIFI_STATUS == "WL_NO_SSID_AVAIL") {
                } */
              } catch (error) {
                console.log(error);
              }
              _onMsg(msg);
            },
            onErr: (e) => {
              console.log("Ws Error - " + e);
              setSocket(null);
              setIsSocketConnecting(false);
              setPairStatus(pairing_state_e.IDLE);
            },
            onClose: () => {
              setSocket(null);
            },
          });
          if (_socket) {
            setPairStatus(pairing_state_e.PAIR_READY)
            console.log("WE HAVE NEW SOCKET")
          } else {
            if (pairStatus != pairing_state_e.NO_SOCKET)
              setPairStatus(pairing_state_e.NO_SOCKET)
            console.log("No Socket connected -- -- Starting Timeout");
            setTimeout(async () => {
              await getSocket();
            }, 5000);
          }
        } catch (e) {
          setPairStatus(pairing_state_e.SOCKET_ERROR)
          console.log("Starting Timeout -- Error:: " + e);
          setTimeout(async () => {
            await getSocket();
          }, 5000);
        }
    }
  }



  useEffect(() => {
    const socketTimer = setInterval(async () => {
      const gap = getTimeDiffNow(lastTimestamp);
      //console.log("Last Msg Gap == " + gap + " --- " + lastTimestamp);
      if (socket != null) {
        if (pairStatus != pairing_state_e.PAIR_REQUEST_SENT && pairStatus != pairing_state_e.PAIR_REQUEST_SUCCESS_N_CONNECTING) {
          console.log("Sending ws STATUS request")
          await socket.send("STATUS");
        }
        if (gap && gap > 20) {
          console.log("socket gap overflowed::DISCONNECTING");
          setSocket(null);
          setPairStatus(pairing_state_e.IDLE);
        }
      }
      if (socket == null && !isSocketConnecting) {
        console.log("getting New Socket");
        await getSocket();
      }
    }, 5000);
    return () => {
      //console.log("Pair API Hook UnSubscribe");
      clearInterval(socketTimer);
    };
  }, [
    socket,
    isSocketConnecting,
    lastTimestamp,
    pairStatus,
    pairingTimeCounter,
  ]);

  return [
    socket,
    IP,
    pair,
    pairStatus,
  ];
};

export default usePairApiHook;
