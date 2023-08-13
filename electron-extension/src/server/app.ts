import express from "express";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import * as wsClass from "ws";

import * as middlewares from "./middlewares";
import api from "./api";
import path from "path";

import { app }  from './utils/createWs';


app.use(morgan("dev"));
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(cors());
app.use(express.json());



// Serve electron's main renderer
app.use('/main_window', express.static(path.join(__dirname, '../renderer/main_window')));

// Endpoints
app.use("/api", api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
