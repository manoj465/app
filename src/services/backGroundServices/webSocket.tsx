
export interface deviceSocketHBResponse {
  MAC?: string;
  WIFI_STATUS?: "WL_TIMEOUT" | "WL_CONNECTED" | "WL_DISCONNECTED" | "WL_SCAN_COMPLETED" | "WL_CONNECT_FAILED" | "WL_IDLE_STATUS" | "WL_CONNECTION_LOST" | "WL_NO_SSID_AVAIL" | "UNKNOWN";
  PAIR_STATUS?: boolean;
  IP?: string;
  DEVICE?: string;
  BUILD_VERSION?: string;
}

interface webSocketProps {
  (_props: {
    ipAddr: string
    onOpen?: (s: any) => void
    onMsg: (s: any) => void
    onErr?: (s: any) => void
    onClose?: (s: any) => void
  }): Promise<WebSocket | null>;
}
const getWebSocket: webSocketProps = async ({
  ipAddr,
  onOpen,
  onMsg,
  onErr,
  onClose,
}) => {
  let wsUrl = `ws://${ipAddr}/ws`;
  try {
    let ws = await new WebSocket(wsUrl);

    ws.onopen = (e) => {
      if (ws) {
        try {
          ws.send("Connected");
        } catch (e) {
          console.error("errrrrrrrrrrrrrrrrrrrrr" + e);
        }
        onOpen ? onOpen(e) : {}
      }
    };

    ws.onerror = (e) => {
      onErr ? onErr(e) : {}
    };

    ws.onmessage = (m) => {
      onMsg(m.data);
    };

    ws.onclose = (e) => {
      onClose ? onClose(e) : {}
    }

    return ws;
  } catch (error) {
    return null;
  }
};

export { getWebSocket };

