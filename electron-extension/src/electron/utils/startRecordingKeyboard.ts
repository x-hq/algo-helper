import { logger } from "../../utils/logger";
import { activateFinder } from "./activateFinder";
import { startKeylogger } from "./keyLogger";

export const startRecordingKeyboard = async () => {
    logger.log('GOT START RECORDING COMMAND');
    await activateFinder();
    startKeylogger();
}