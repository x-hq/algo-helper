import { exec } from "child_process";

// Function to execute a shell command and return it as a Promise
export function execShellCommand(cmd: string): Promise<string> {
    return new Promise((resolve, reject) => {
      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          console.warn(error);
          reject(error);
        }
        resolve(stdout ? stdout : stderr);
      });
    });
  }