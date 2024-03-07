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
  const PORT = process.env.PORT || 3001; // Use a common environment variable like PORT
  server.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
  });
}

startServer();
