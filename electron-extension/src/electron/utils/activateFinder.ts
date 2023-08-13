import { execShellCommand } from "./execShellCommand";

export const activateFinder = async () => {
  console.debug("ACTIVATING FINDER");
  const osaCommand = `osascript ./src/electron/utils/activateFinder.scpt`;
  return await execShellCommand(osaCommand);
};
