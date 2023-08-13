import fs from "fs";

export const logger = {
  // eslint-disable-next-line
  log: (...msg: any[]) => {
    const now = Date.now();
    console.log(now, ...msg);

    fs.appendFile(
      "./logs/log.txt",
      [now, ...msg].toString() + "\n",
      function (err) {
        if (err) throw err;
      }
    );
  },
};
