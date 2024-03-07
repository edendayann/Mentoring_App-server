//assuming only one mentor for the project. can have an array/map for multiple
let mentorsBlockIndex = -1;

export const manageWS = wss => {

    wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const data = JSON.parse(message);

        switch (data.type) {
        case 'joinCodeBlock':
            joinCodeBlock(ws, data.index);
            break;
        case 'changeCode':
            changeCode(wss, data.index, data.newCode);
            break;
        case 'closeBlock': 
            closeBlock(data.isMentor);
            break; 
        default:
            break;
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
    });
}

async function joinCodeBlock(ws, index) {
  console.log('Client joined block number:', index);
  if (mentorsBlockIndex === index)
    ws.send(JSON.stringify({ type: 'mentor', index: index, data: 'false' }));
  else{
    mentorsBlockIndex = index;
    ws.send(JSON.stringify({ type: 'mentor', index: index, data: 'true' }));
  }
}
  
function changeCode(wss, index, newCode) {
  wss.clients.forEach(client => {
    client.send(JSON.stringify({ type: 'code', index: index, code: newCode }));
  });
}

function closeBlock(index, isMentor){
  if(isMentor)
    mentorsBlockIndex = -1;
    wss.clients.forEach(client => {
      client.send(JSON.stringify({ type: 'mentor', index: index, data: 'false' }));
    });
    console.log("mentor disconnected")
}