import { getWss } from "./createWs";

export const broadcast: (message: string) => void = (message) => {
  console.log('Broadcasting', message);
  getWss().clients.forEach((client) => {
    client.send(message);
  });
};
