import { clipboard, net } from "electron";
import { sendAsHTMLOrText } from "./sendAsHTMLOrText";

export const readFromClipboardAndSend: () => Promise<string> = async () => {
  const content = clipboard.readText();

  if (content) {
    await sendAsHTMLOrText(null, content);
  }

  return content;
};
