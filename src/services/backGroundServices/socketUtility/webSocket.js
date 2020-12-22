const getWebSocket = async (ipAddr, wsHandler, OnMessageRecieved, wsErr) => {
  let wsUrl = `ws://${ipAddr}/ws`;
  let ws = await new WebSocket(wsUrl);
  console.log("WSURL 0:   ", wsUrl);
  ws.onopen = (res) => {
    if (res && ws) {
      try {
        ws.send("Connected");
      } catch (e) {
        console.error("errrrrrrrrrrrrrrrrrrrrr" + e);
      }
      wsHandler(">>>>>>>ws");
    }
  };

  ws.onerror = (e) => {
    let debug = false;
    {
      debug && console.log("WS Error: ", e.message);
    }
    wsErr(e);
  };

  ws.onmessage = (e) => {
    //console.log("WS Message: ", e.data)
    OnMessageRecieved(e, ws);
  };

  ws.onclose = (e) => {
    console.log("WS Close: ", e);
    OnMessageRecieved(e, null);
  };
  return ws;
};

export { getWebSocket };
