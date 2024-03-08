let mentorsArray = []

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
        case 'closeMentor': 
            closeMentor(data.index);
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
  if (mentorsArray.includes(index)){
    ws.send(JSON.stringify({ type: 'mentor', index: index, data: false }));
  }
  else{
    mentorsArray.push(index);
    ws.send(JSON.stringify({ type: 'mentor', index: index, data: true }));
  }
}
  
function changeCode(wss, index, newCode) {
  wss.clients.forEach(client => {
    client.send(JSON.stringify({ type: 'code', index: index, code: newCode }));
  });
}

function closeMentor(index){
  mentorsArray = mentorsArray.filter(val => val !== index);
  console.log("mentor disconnected")
}