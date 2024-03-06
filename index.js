import express from "express";
import cors from "cors";
import { connectToDb, codeBlock, names } from "./db.js";
import { WebSocketServer } from "ws";
import http from "http";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// Define a route to handle the Axios request
app.get('/names', async (req, res) => {
  try{
    const allNames = await names.findOne();
    if(allNames)
      res.json({ type: 'names', data: allNames });
    else
      res.json({ type: 'namesError', message: 'cannot find names' });
  } catch(err){
      res.json({ type: 'namesError', message: err });
  }
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

let mentorsBlockIndex = -1

wss.on('connection', (ws) => {

  ws.on('message', (message) => {   // triggered after send function from client
    const data = JSON.parse(message);

    switch (data.type) {
      case 'joinCodeBlock':
        joinCodeBlock(ws, data.index);
        break;
      case 'changeCode': // changes code in socket only
        changeCode(wss, data.newCode);
        break;
      case 'closeBlock': 
        closeBlock(data.isMentor);
        break;
      case 'save': // changes code in database
        handleSaveEvent(data);
        break;   
      default:
        break;
    }

  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

async function joinCodeBlock(ws, index) {
  console.log('Client joined block number:', index);
  // Send to client a message that this is the mentor
  if (mentorsBlockIndex != index) {
    mentorsBlockIndex = index;
    ws.send(JSON.stringify({ type: 'mentor' }));
  }
  try{
    const block = await codeBlock.findOne({ index: String(index) });
    if(block)
      ws.send(JSON.stringify({ type: 'codeBlock', block: block }));
    else
      ws.send(JSON.stringify({ type: 'codeBlockError', message: 'cannot find code block' }));
  } catch(err){
      ws.send(JSON.stringify({ type: 'codeBlockError', message: err }));
  }
  
}
  
// Broadcast the new code to all connected clients, including the sender
function changeCode(wss, newCode) {
  wss.clients.forEach(client => {
    client.send(JSON.stringify({ type: 'code', code: newCode }));
  });
}

function closeBlock(isMentor){
  if(isMentor)
    mentorsBlockIndex = -1;
    console.log("mentor disconnected")
}

function handleSaveEvent(data) {
  const newCode = data.code
  const blockId = data.id
  const updateQuery = 'UPDATE moveo SET code = ? WHERE id = ?';
  db.query(updateQuery, [newCode, blockId], (err, data) => {
    if (err) {
      console.error(err);
      throw new Error('Failed to update code in the database');
    }
    console.log('Code updated in the database');
  })
}

function startServer() {
  connectToDb();
  const SOCKET_PORT = process.env.PORT || 3001;
  server.listen(SOCKET_PORT, () => {
    console.log("server listening at port " + SOCKET_PORT);
  });
  const APP_PORT = process.env.PORT || 3002;
  app.listen(APP_PORT, () => {
    console.log("app listening at port " + APP_PORT);
  });
}

startServer();