import { app } from "electron"
import { logger } from "../../utils/logger"

export const restartApp = () => {
    logger.log('RESTART APP');
    app.exit(); // force quit
    app.relaunch();
}

export const quitApp = () => {
    logger.log('QUIT APP');
    app.exit(); // force quit
}