import { execShellCommand } from "./execShellCommand";
import { readFromClipboardAndSend } from "./readFromClipboard";
import { logger } from "../../../src/utils/logger";

export const execSelectAndCopy = async () => {
    logger.log('Received exec select and copy');

    const delay ='0.15';
    const osaCommand = `osascript -e 'tell application "System Events" to keystroke "a" using command down' -e 'delay ${delay}' -e 'tell application "System Events" to keystroke "c" using command down' -e 'delay ${delay}' -e 'tell application "System Events" to key code 124'  # Right arrow key`
    await execShellCommand(osaCommand);

    readFromClipboardAndSend();
}