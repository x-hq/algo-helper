import { ChildProcess, spawn } from "child_process";
import { logger } from "../../../src/utils/logger";
let pythonProcess: ChildProcess = null;
let keys: string[] = [];

export function startKeylogger() {
  logger.log("START KEYLOGGER");
  pythonProcess = spawn("python3", ["./src/electron/utils/keylogger.py"]);

  pythonProcess.stdout.on("data", (data) => {
    keys.push(data.toString());
  });

  pythonProcess.stderr.on("data", (data) => {
    logger.log(`ERROR: ${data}`);
  });
}

export function stopKeylogger() {
  if (pythonProcess) {
    pythonProcess.kill();
    pythonProcess = null;
  }

  const retVal = keys.join("");
  keys = [];
  logger.log(`END KEYLOGGER: ${keys}`);
  return retVal;
}
