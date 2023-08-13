import { globalShortcut } from "electron";
import { readFromClipboardAndSend } from "./readFromClipboard";
import { execSelectAndCopy } from "./execSelectAndCopy";
import { execGetHTMLFromFrontWindow } from "./execGetHTMLFromFrontWindow";
import { startRecordingKeyboard } from "./startRecordingKeyboard";
import { stopRecordingKeyboard } from "./stopRecordingKeyboard";
import { setMode } from "../../utils/setMode";

type Action = {
    id: string;
    label: string;
    action: () => void;
}   

export const SHORTCUTS: Record<string,Action > = {
  "Alt+CommandOrControl+C": {
    id: "readFromClipboardAndSend",
    label: "Read from clipboard and send",
    action: () => readFromClipboardAndSend(),
  },
  "Alt+CommandOrControl+A": {
    id: "execSelectAndCopy",
    label: "Select all, copy and send",
    action: () => execSelectAndCopy(),
  },
  "Alt+CommandOrControl+S": {
    id: "execGetHTMLFromFrontWindow",
    label: "Get active HTML and send",
    action: () => execGetHTMLFromFrontWindow(),
  },
  "Alt+CommandOrControl+R": {
    id: "startRecordingKeyboard",
    label: "Start keyboard recording",
    action: () => startRecordingKeyboard(),
  },
  "Alt+CommandOrControl+T": {
    id: "stopRecordingKeyboard",
    label: "Stop keyboard recording and send",
    action: () => stopRecordingKeyboard(),
  },
  "Alt+CommandOrControl+1": {
    id: "setMode-a1",
    label: "Set assistant mode: algorithms",
    action: () => setMode({ assistant: "algorithms" }),
  },
  "Alt+CommandOrControl+2": {
    id: "setMode-a2",
    label: "Set assistant mode: system-design",
    action: () => setMode({ assistant: "system-design" }),
  },
  "Alt+CommandOrControl+3": {
    id: "setMode-a2",
    label: "Set assistant mode: free-form",
    action: () => setMode({ assistant: "free-form" }),
  },
  "Alt+Shift+CommandOrControl+1": {
    id: "setMode-c1",
    label: "Set conversation mode: question",
    action: () => setMode({ conversation: "question" }),
  },
  "Alt+Shift+CommandOrControl+2": {
    id: "setMode-c2",
    label: "Set conversation mode: follow-up",
    action: () => setMode({ conversation: "follow-up" }),
  },
  "Alt+Shift+CommandOrControl+3": {
    id: "setMode-31",
    label: "Set conversation mode: correction",
    action: () => setMode({ conversation: "correction" }),
  },
};

export const registerShortcuts = () => {
  for (const shortcut in SHORTCUTS) {
    globalShortcut.register(shortcut, SHORTCUTS[shortcut].action);
  }
};
