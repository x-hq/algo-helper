import { logger } from "../../utils/logger";
import { getWss } from "./createWs";

export const broadcast: (message: string) => void = (message) => {
  logger.log('BROADCAST');
  getWss().clients.forEach((client) => {
    client.send(message);
  });
};
