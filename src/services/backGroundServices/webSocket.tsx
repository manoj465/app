import { store } from "../../../App";
import { getCurrentTimeStamp } from "../../util/DateTimeUtil";

export interface deviceSocketHBResponse {
  MAC?: string;
  WIFI_STATUS?: "WL_TIMEOUT" | "WL_CONNECTED" | "WL_DISCONNECTED" | "WL_SCAN_COMPLETED" | "WL_CONNECT_FAILED" | "WL_IDLE_STATUS" | "WL_CONNECTION_LOST" | "WL_NO_SSID_AVAIL" | "UNKNOWN";
  PAIR_STATUS?: boolean;
  IP?: string;
  DEVICE?: string;
  BUILD_VERSION?: string;
}

interface onWebSocketCloseProps {
  (msg: string | undefined): void;
}
interface onWebSocketErrProps {
  (msg: string): void;
}
interface onWebSocketMsgProps {
  (msg: string): void;
}
interface onWebSocketOpenProps {
  (): void;
}
interface webSocketProps {
  (_props: {
    Mac: string;
    ipAddr: string;
    onOpen: onWebSocketOpenProps;
    onMsg: onWebSocketMsgProps;
    onErr: onWebSocketErrProps;
    onClose: onWebSocketCloseProps;
  }): Promise<WebSocket | null>;
}
const getWebSocket: webSocketProps = async ({
  Mac,
  ipAddr,
  onOpen,
  onMsg,
  onErr,
  onClose,
}) => {
  let wsUrl = `ws://${ipAddr}/ws`;
  try {
    let ws = await new WebSocket(wsUrl);

    ws.onopen = () => {
      if (ws) {
        try {
          ws.send("Connected");
        } catch (e) {
          console.error("errrrrrrrrrrrrrrrrrrrrr" + e);
        }
        onOpen();
      }
    };

    ws.onerror = (e) => {
      onErr(e.message);
    };

    ws.onmessage = (m) => {
      /* console.log("--SOCKET-MSG--\n" + msg); */
      //store.dispatch;
      ///TODO:conditional upon prop => updateMsgReceivedTimestampAction(Mac, getCurrentTimeStamp())();
      onMsg(m.data);
    };

    ws.onclose = (e) => {
      onClose(e.message);
    };

    return ws;
  } catch (error) {
    return null;
  }
};

export { getWebSocket };
