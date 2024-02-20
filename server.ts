
import express, { Response, Request } from 'express';
import * as path from 'path';
import bodyParser from 'body-parser';
import { LEDmatrix } from './src/ledMatrix/ledMartix';
import { FootballApi } from './src/sportApi/footballApi';
import { Networking } from './src/networking/networking';
import {displayBoardInfo} from './src/ledMatrix/ledMartix'
import webSocket from 'ws'

const port = 3000;

const displayboard1:displayBoardInfo = {
  mac: '00:1D:6F:01:D6:03',
  port: 9520
};


const matrix = new LEDmatrix()
async function initMatrix(){
  matrix.addApi(new FootballApi)
  await matrix.init(displayboard1).then(async()=>{
      matrix.parseAPIData();
      matrix.sendData();
   })
  
}



const app = express();

const server = app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`); 
  initMatrix(); 

});

const wsServer = new webSocket.Server({server})

wsServer.on('connection', (ws:webSocket,req) =>{
  console.log("connect to: " + req.socket.remoteAddress)
  ws.send(matrix._parser._textToParse)

  ws.on('close', ()=>{
    console.log(req.socket.remoteAddress + " Closed the connection")
  })
})

app.use(express.static('public'));

app.use(bodyParser.text()); // Add this middleware to parse text/plain requests

app.use(function (req: Request, res: Response, next: Function) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
  




app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.post('/sendText', (req, res) => {
  const text = req.body as string;
  matrix._parser.ParseText(text)
  matrix.sendData()
  console.log(req.ip)
  wsServer.clients.forEach((client) => {
    if(client.readyState === webSocket.OPEN){
      client.send(text)
    }
  })
  res.status(200).send('Data received successfully');
});
