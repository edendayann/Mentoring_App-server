import express from "express";
import cors from "cors";
import { connectToDb, manageDB } from "./manageDB.js";
import { manageWS } from "./manageWS.js";
import { WebSocketServer } from "ws";
import http from "http";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

function startServer() {
  connectToDb();
  manageDB(app);
  manageWS(wss);
  const SOCKET_PORT = process.env.SOCKET_PORT || 3001;
  server.listen(SOCKET_PORT , () => {
    console.log("server listening at port " + SOCKET_PORT);
  });
  const APP_PORT = process.env.APP_PORT || 3002;
  app.listen(APP_PORT, () => {
    console.log("app listening at port " + APP_PORT);
  });
}

startServer();
