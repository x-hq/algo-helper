import { Menu, Tray, nativeImage } from "electron";
import { readFromClipboardAndSend } from "./readFromClipboard";
import { SHORTCUTS } from "./registerShortcuts";

const MENU_TEMPLATE: Electron.MenuItemConstructorOptions[] = Object.entries(
  SHORTCUTS
).map(([key, value]) => ({
  id: value.label,
  label: value.label,
  accelerator: key,
  click: value.action,
}));

export const createTrayIconAndMenu = () => {
  const icon = nativeImage.createFromDataURL(
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAT9JREFUWIXtl+FtgzAQhb9Y/V9GYISO4A2SDZoRmlHYIBsAE0BH6ATtCGEC+sNGcRwbbAOlqfokS+h8fveE744D0pEDn3rlqSRihoCjDpzr5x8XsAj+BWwuYAwSaIB+5mqAl5TgcwPbS8YIaFcQ0LgC7TwC+hi1EbiL50pCuVJwJ/fmVfBQAmqgALoRn0771DEiMqDkWiqS+wyuDH/XvqvUKs/+cL7UsTl7HMx1sERfHD4Xy+cwIaAHzsJBnoqU0t0L4DnA8dV4lp4zGbdXcAzgzZ4CnEC9pRL4miAuUVeaA/sQ4lABg4gpZMBbBOdj9YG/K2Css62NTnDb5Xx4R31Kd8BJ2wrDVmjbybB9BPBWApW1U707pcnYndFGjadiJMtPQ96xbPMk/JUjGaikWxpRnJKNx/JBRLtA4JaRH5NvY/W/98srFdYAAAAASUVORK5CYII="
  );
  const tray = new Tray(icon.resize({ width: 16 }));
  const contextMenu = Menu.buildFromTemplate(MENU_TEMPLATE);

  tray.setContextMenu(contextMenu);
};
