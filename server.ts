
import express, { Response, Request } from 'express';
import * as path from 'path';
import bodyParser from 'body-parser';
import { LEDmatrix } from './src/ledMatrix/ledMartix';
import { FootballApi } from './src/sportApi/footballApi';
import { Networking } from './src/networking/networking';
import {displayBoardInfo} from './src/ledMatrix/ledMartix'
import webSocket from 'ws'


const port = 3000;


const app = express();

const server = app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`); 
});

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

const wsServer = new webSocket.Server({server})

wsServer.on('connection', (ws:webSocket,req) =>{
  console.log("connect to: " + req.socket.remoteAddress)

  ws.on('close', ()=>{
    console.log(req.socket.remoteAddress + " Closed the connection")
  })
})



const displayboard1:displayBoardInfo = {
  mac: '00:1D:6F:01:D6:03',
  port: 9520,
  apiRoute:'/matrix1'
};

const matrix1 = new LEDmatrix(wsServer,'/matrix1', displayboard1)
const matrix2 = new LEDmatrix(wsServer,'/matrix2', displayboard1)

const matericies = [matrix1, matrix2]

async function initMatrixes(){
  for(let i = 0; i < matericies.length; i++){
    matericies[i].init()
  }
}

initMatrixes()

app.use(matrix1._routeUrl, matrix1._router)
app.use(matrix2._routeUrl, matrix2._router)


