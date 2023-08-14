import { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { Badge } from "./Badge";
import { Message } from "./Message";

export const MessagesContainer = () => {
  const { hostname, port } = window.location;
  const [socketUrl] = useState(`ws://${hostname}:${port}/api/search/messages`);
  const [messageHistory, setMessageHistory] = useState<MessageEvent<string>[]>(
    []
  );

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    onError(...data) {
      console.error("Error with websocket connection", data);
    },
    onOpen() {
      sendMessage("PING");
      sendMessage("GET_MESSAGES");
    },
  });

  useEffect(() => {
    console.log("Last message (s)", lastMessage);
    console.log("Now", Date.now());

    if (lastMessage?.data === "CLEAR_MESSAGES") {
      setMessageHistory([]);
      sendMessage("GET_MESSAGES");
    }

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
    <div className="w-full h-full relative">
      <div className="top-0 right-0 p-4 max-w-[100vw]">
        <aside className="">
          <button
            className="bg-slate-800 m-1 hover:bg-slate-600 text-xs text-white py-1 px-2 rounded-lg"
            onClick={() => sendMessage("OPTION_ASSISTANT_1")}
          >
            ASSISTANT: ALGORITHMS
          </button>
          <button
            className="bg-slate-800 m-1 hover:bg-slate-600 text-xs text-white py-1 px-2 rounded-lg"
            onClick={() => sendMessage("OPTION_ASSISTANT_2")}
          >
            ASSISTANT: SYSTEM DESIGN
          </button>
          <button
            className="bg-slate-800 m-1 hover:bg-slate-600 text-xs text-white py-1 px-2 rounded-lg"
            onClick={() => sendMessage("OPTION_ASSISTANT_3")}
          >
            ASSISTANT: FREE FORM
          </button>
          <button
            className="bg-slate-800 m-1 hover:bg-slate-600 text-xs text-white py-1 px-2 rounded-lg"
            onClick={() => sendMessage("OPTION_CONVERSATION_1")}
          >
            CONVERSATION: QUESTION
          </button>
          <button
            className="bg-slate-800 m-1 hover:bg-slate-600 text-xs text-white py-1 px-2 rounded-lg"
            onClick={() => sendMessage("OPTION_CONVERSATION_2")}
          >
            CONVERSATION: FOLLOW-UP
          </button>
          <button
            className="bg-slate-800 m-1 hover:bg-slate-600 text-xs text-white py-1 px-2 rounded-lg"
            onClick={() => sendMessage("OPTION_CONVERSATION_3")}
          >
            CONVERSATION: CORRECTION
          </button>
          <button
            className="bg-slate-800 m-1 hover:bg-slate-600 text-xs text-white py-1 px-2 rounded-lg"
            onClick={() => sendMessage("CLEAR_MESSAGES_REQUEST")}
          >
            CLEAR
          </button>
        </aside>
      </div>
      <div>
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
    </div>
  );
};
