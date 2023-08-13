import React, { useState, useCallback, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { env } from "../utils/env";
import { Message } from "./Message";
import { Badge } from "./Badge";

export const WebSocketDemo = () => {
  //Public API that will echo messages sent to it back to the client

  const { hostname, port } = window.location;
  const [socketUrl, setSocketUrl] = useState(
    `ws://${hostname}:${port}/api/search/messages`
  );
  const [messageHistory, setMessageHistory] = useState<MessageEvent<string>[]>(
    []
  );

  const {  sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    onError(...data) {
      console.error("Error with websocket connection", data);
    },
    onOpen(...data) {
      console.log("Connected to websocket", data);
      sendMessage('PING');
      sendMessage('GET_MESSAGES');
    }
  });

  useEffect(() => {
    console.log("Last message (s)", lastMessage);
    console.log("Now", Date.now());
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage, setMessageHistory]);


  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return (
    <div className="w-full h-full">
      <div>
        <span className="font-semibold">Connection status:</span>{" "}
        <Badge>{connectionStatus}</Badge>
      </div>

      <div>
        {messageHistory.map((message, idx) => (
          <Message key={idx} message={message} />
        ))}
      </div>
    </div>
  );
};
