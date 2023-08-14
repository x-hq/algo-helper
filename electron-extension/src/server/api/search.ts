import express from "express";

import { spawn } from "child_process";
import { tidy } from "htmltidy2";
import sanitizeHtml from "sanitize-html";
import { logger } from "../../utils/logger";
import { mode, setMode } from "../../utils/setMode";
import { getWss } from "../utils/createWs";
import {  getCompletion, messagesMemo } from "../utils/getCompletion";
import { broadcast } from "../utils/broadcast";
import { clearMessages } from "../../electron/utils/clearMessages"

function pbcopy(data: any) {
  const proc = spawn("pbcopy");
  proc.stdin.write(data);
  proc.stdin.end();
}

const router = express.Router();

type SearchResponse = {
  success: boolean;
  content: string;
};

router.post<object, SearchResponse>("/", async (req, res) => {
  logger.log("SERVER SEARCH REQUEST");

  let content = "";
  try {
    let text = "";

    if (req.body.html) {
      text = `<div>${req.body.html}</div>`;
      text = sanitizeHtml(text);
      text = await new Promise((res) =>
        tidy(
          text,
          {
            clean: true,

            showBodyOnly: true,
            "merge-divs": true,

            mergeDivs: true,
            mergeEmphasis: true,

            mergeSpans: true,
            "merge-spans": true,
          },
          (err: any, html: any) =>
            err ? console.error("TIDY ERROR", err) : res(html)
        )
      );
      text = text.replace(/(\r\n|\n|\r)/gm, "");
    } else {
      text = req.body.text;
    }

    content = await getCompletion(text);
    
  } catch (e) {
    console.error(e);
    return {
      success: false,
      content: content,
    };
  }

  // Memoize the messages so that we can use them in the next request
  messagesMemo.push({
    role: "assistant",
    content: content,
  });

  content = content.replace(/^```typescript/g, "");
  content = content.replace(/```$/g, "");

  logger.log("MESSAGES HISTORY", messagesMemo.map((m) => ({ ...m, content: `${m.content.slice(0, 100)}...`  })));

  // Broadcast response
  broadcast(content);

  pbcopy(content);

  res.json({
    success: true,
    content: content,
  });
});

router.get("/test", async (req, res) => {
  broadcast('TEST OK!');
  res.json({ success: true });
});

router.ws("/messages", async (ws) => {
  ws.on("message", (msg) => {
    if (msg.toString() === "PING") {
      ws.send("PONG");
    }

    if (msg.toString() === "GET_MESSAGES") {
      for (const message of messagesMemo) {
        ws.send(message.content);
      }
    }

    if (msg.toString() === "OPTION_ASSISTANT_1") {
      setMode({ assistant: 'algorithms' });
    }
    if (msg.toString() === "OPTION_ASSISTANT_2") {
      setMode({ assistant: 'system-design' });
    }
    if (msg.toString() === "OPTION_ASSISTANT_3") {
      setMode({ assistant: 'free-form' });
    }

    if (msg.toString() === "OPTION_CONVERSATION_1") {
      setMode({ conversation: "question"  });
    }
    if (msg.toString() === "OPTION_CONVERSATION_2") {
      setMode({ conversation: 'follow-up'  });
    }
    if (msg.toString() === "OPTION_CONVERSATION_3") {
      setMode({ conversation: 'correction'  });
    }
    if (msg.toString() === "CLEAR_MESSAGES_REQUEST") {
      clearMessages()
    }

  });
});

export default router;
