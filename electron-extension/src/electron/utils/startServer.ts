import app from "../../server/app";

export const startServer = () => {
  const port = process.env.PORT || 5000;
  return new Promise(res => {
    app.listen(port, () => {
      /* eslint-disable no-console */
      console.log(`Listening: http://localhost:${port}`);
      /* eslint-enable no-console */

      res(app);
    });
  });
};
