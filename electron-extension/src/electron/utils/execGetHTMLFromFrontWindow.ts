import { logger } from "../../../src/utils/logger";
import { execShellCommand } from "./execShellCommand";
import { jsDOMFindHTMLNode } from "./jsDOMFindHTMLNode";
import { sendAsHTMLOrText } from "./sendAsHTMLOrText";


export const execGetHTMLFromFrontWindow = async () => {
    logger.log('START HTML READ');


    // eslint-disable-next-line 
    try {
        const osaCommand = `osascript ./src/electron/utils/getHTML.scpt`;
        const res = await execShellCommand(osaCommand);    
        const content = jsDOMFindHTMLNode(res);
        
        await sendAsHTMLOrText(content, null);
    } catch (e) {
        logger.log('ERROR in execGetHTMLFromFrontWindow', e);
    }
}