import { useEffect, useState } from "react";
import UNIVERSALS from "../../@universals";
import { logger } from "../../util/logger";
import api from "../api";
import { deviceSocketHBResponse, getWebSocket } from "../backGroundServices/webSocket";

export enum pairing_state_e {
  IDLE,
  PAIR_READY,
  PAIR_REQUEST_SUCCESS_N_CONNECTING,
  PAIR_UNKNOWN_ERROR,
  PAIR_SUCCESS,
  PAIR_WRONG_PASSWORD,
  PAIR_NO_SSID,
  SAVE_CONFIG_SUCCESS,
  SAVE_CONFIG_ERROR
}
type connectProps = (ssid: string, pass: string) => Promise<void>;

interface Props {
  (_props: {
    IP: string,
    _onMsg: (msg: string) => void,
    log?: logger
  })
    : [
      api.deviceAPI.pairAPI.pairApiReturnType | undefined,
      WebSocket | undefined,
      connectProps,
      pairing_state_e,
      () => Promise<void>
    ];
}
const usePairApiHook: Props = ({ IP: IP_ADD, _onMsg, log }) => {
  const [data, setData] = useState<api.deviceAPI.pairAPI.pairApiReturnType | undefined>(undefined);
  const [pairStatus, setPairStatus] = useState<pairing_state_e>(pairing_state_e.IDLE);
  const [socket, setSocket] = useState<WebSocket | undefined>(undefined);


  useEffect(() => {
    log?.print("--------*")
    let interval: any
    if (!socket) {
      log?.print("--------getSocket() interval start")
      interval = setInterval(() => {
        log?.print("--")
        getSocket()
      }, 5500)
    }
    else {
      log?.print("--------getSocket() interval end")
      log?.print("we have socket")
      clearInterval(interval)
    }
    return () => {
      clearInterval(interval)
    }
  }, [socket])

  const pair: connectProps = async (ssid, pass) => {
    log?.print("Pair Credentials are " + ssid + " -- " + pass);
    if (pairStatus == pairing_state_e.PAIR_READY
      || pairStatus == pairing_state_e.PAIR_WRONG_PASSWORD
      || pairStatus == pairing_state_e.PAIR_UNKNOWN_ERROR
      || pairStatus == pairing_state_e.PAIR_NO_SSID) {
      const result = await api.deviceAPI.pairAPI.v1({ IP: "192.168.4.1", ssid, pass, log: log ? new logger("pair api", log) : undefined })
      log?.print("-result- RES - " + JSON.stringify(result))
      if (result.RES?.Mac)
        setPairStatus(pairing_state_e.PAIR_REQUEST_SUCCESS_N_CONNECTING)
      setData(result)
    }
  }

  const hitSaveAPI = async () => {
    const res = await api.deviceAPI.saveWiFiConfigAPI.v1({ IP: "192.168.4.1" })
    log?.print("save api RES - " + JSON.stringify(res))
    if (res.RES == "RES-551") {
      setPairStatus(pairing_state_e.SAVE_CONFIG_SUCCESS)
    } else {
      setPairStatus(pairing_state_e.SAVE_CONFIG_ERROR)
    }
  }


  const getSocket = async () => {
    if (!socket) {
      log?.print("getting socket");
      let result = await api.deviceAPI.authAPI.v1({ IP: "192.168.4.1" })
      if (result?.RES?.Mac) {
        log?.print("Auth success :: " + result.RES.Mac);
      } else {
        setSocket(undefined)
      }
      try {
        const _socket = await getWebSocket({
          ipAddr: IP_ADD,
          onOpen: () => {
            log?.print("WS Connected for Devie >> " + IP_ADD);
            setPairStatus(pairing_state_e.PAIR_READY)
            if (_socket)
              setSocket(_socket)
          },
          onMsg: (msg) => {
            try {
              const data: api.deviceAPI.pairAPI.pairApiRes_i | undefined = msg
                ? JSON.parse(msg)
                : undefined;
              log?.print("SOCKET MSG >> " + JSON.stringify(data))
              if (data?.WIFI_STATE == UNIVERSALS.GLOBALS.deviceApi._DEVICE_WIFI_STATE_e.DEVICE_WL_CONNECT_FAILED && pairStatus != pairing_state_e.PAIR_WRONG_PASSWORD)
                setPairStatus(pairing_state_e.PAIR_WRONG_PASSWORD)
              else if (data?.WIFI_STATE == UNIVERSALS.GLOBALS.deviceApi._DEVICE_WIFI_STATE_e.DEVICE_WL_NO_SSID_AVAIL)
                setPairStatus(pairing_state_e.PAIR_NO_SSID)
              else if (data?.WIFI_STATE == UNIVERSALS.GLOBALS.deviceApi._DEVICE_WIFI_STATE_e.DEVICE_WL_CONNECTED && data.IP?.length) {
                setPairStatus(pairing_state_e.PAIR_SUCCESS)
                setData({ RES: data })
              }
            } catch (error) {
              log?.print(error);
            }
            _onMsg(msg);
          },
          onErr: (e) => {
            log?.print("Ws Error - " + JSON.stringify(e));
            setPairStatus(pairing_state_e.IDLE)
            setSocket(undefined);
          },
          onClose: () => {
            setPairStatus(pairing_state_e.IDLE)
            setSocket(undefined);
          },
        });
      } catch (e) {
      }
    }
  }


  return [
    data,
    socket,
    pair,
    pairStatus,
    hitSaveAPI
  ];
};

export default usePairApiHook;
