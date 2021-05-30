import { useEffect, useState } from 'react';
import UNIVERSALS from '../../@universals';
import { logger } from '../../@logger';
import api from '../../@api';
import { deviceSocketHBResponse, getWebSocket } from '../backGroundServices/webSocket';

export enum pairing_state_e {
  IDLE,
  PAIR_READY,
  PAIR_REQUEST_SUCCESS_N_CONNECTING,
  PAIR_UNKNOWN_ERROR,
  PAIR_SUCCESS,
  PAIR_WRONG_PASSWORD,
  PAIR_NO_SSID,
  SAVE_CONFIG_SUCCESS,
  SAVE_CONFIG_ERROR,
}

/**
 * @param pair function props
 */
type connectProps = (ssid: string, pass: string) => Promise<void>;

interface Props {
  (_props: {
    /** Device IP address */
    IP: string;
    _onMsg: (msg: string) => void;
    log?: logger;
  }): [
    api.deviceAPI.pairAPI.pairApiReturnType | undefined,
    WebSocket | undefined,
    /** pair function props */
    connectProps,
    // PAIRING STATUS enum
    pairing_state_e,
    () => Promise<void>
  ];
}
const usePairApiHook: Props = ({ IP: IP_ADD, _onMsg, log }) => {
  const [data, setData] = useState<api.deviceAPI.pairAPI.pairApiReturnType | undefined>(undefined);
  const [pairStatus, setPairStatus] = useState<pairing_state_e>(pairing_state_e.IDLE);
  const [socket, setSocket] = useState<WebSocket | undefined>(undefined);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    log?.print('--------*');
    let interval: any;
    if (!socket) {
      log?.print('--------getSocket() interval start');
      interval = setInterval(() => {
        log?.print('--');
        getSocket();
      }, 5500);
    } else {
      log?.print('--------getSocket() interval end');
      log?.print('we have socket');
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);

  const pair: connectProps = async (ssid, pass) => {
    log?.print('Pair Credentials are ' + ssid + ' -- ' + pass);
    if (socket) {
      const result = await api.deviceAPI.pairAPI.v1({ IP: '192.168.4.1', ssid, pass, log: log ? new logger('pair api', log) : undefined });
      log?.print('-result- RES - ' + JSON.stringify(result));
      if (result.RES?.Mac) setPairStatus(pairing_state_e.PAIR_REQUEST_SUCCESS_N_CONNECTING);
      setData(result);
    }
  };

  const hitSaveAPI = async () => {
    const res = await api.deviceAPI.saveWiFiConfigAPI.v1({ IP: '192.168.4.1' });
    log?.print('save api RES - ' + JSON.stringify(res));
    if (res.RES == 'RES-551') {
      setPairStatus(pairing_state_e.SAVE_CONFIG_SUCCESS);
    } else {
      setPairStatus(pairing_state_e.SAVE_CONFIG_ERROR);
    }
  };

  const getSocket = async () => {
    if (!socket) {
      log?.print('getting socket');
      try {
        let result = await api.deviceAPI.authAPI.v1({ IP: '192.168.4.1' });
        if (result.RES) {
          log?.print('Auth success :: ' + JSON.stringify(result.RES));
        } else {
          setSocket(undefined);
        }
        const _socket = await getWebSocket({
          ipAddr: IP_ADD,
          onOpen: () => {
            log?.print('WS Connected for Devie >> ' + IP_ADD);
            setPairStatus(pairing_state_e.PAIR_READY);
            if (_socket) setSocket(_socket);
          },
          onMsg: (msg) => {
            try {
              const data: api.deviceAPI.pairAPI.pairApiRes_i | undefined = msg ? JSON.parse(msg) : undefined;
              log?.print('SOCKET MSG >> ' + JSON.stringify(data));
              if (data?.WIFI_STATE == UNIVERSALS.GLOBALS.deviceApi._DEVICE_WIFI_STATE_e.DEVICE_WL_CONNECT_FAILED && pairStatus != pairing_state_e.PAIR_WRONG_PASSWORD)
                setPairStatus(pairing_state_e.PAIR_WRONG_PASSWORD);
              else if (data?.WIFI_STATE == UNIVERSALS.GLOBALS.deviceApi._DEVICE_WIFI_STATE_e.DEVICE_WL_NO_SSID_AVAIL) setPairStatus(pairing_state_e.PAIR_NO_SSID);
              else if (data?.WIFI_STATE == UNIVERSALS.GLOBALS.deviceApi._DEVICE_WIFI_STATE_e.DEVICE_WL_CONNECTED && data.IP?.length) {
                setPairStatus(pairing_state_e.PAIR_SUCCESS);
                setData({ RES: data });
              }
            } catch (error) {
              log?.print(error);
            }
            _onMsg(msg);
          },
          onErr: (e) => {
            log?.print('Ws Error - ' + JSON.stringify(e));
            setPairStatus(pairing_state_e.IDLE);
            setSocket(undefined);
          },
          onClose: () => {
            setPairStatus(pairing_state_e.IDLE);
            setSocket(undefined);
          },
        });
      } catch (e) {}
    }
  };

  return [data, socket, pair, pairStatus, hitSaveAPI];
};

export default usePairApiHook;
