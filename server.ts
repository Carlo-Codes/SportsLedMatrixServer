
import express, { Response, Request } from 'express';
import * as path from 'path';
import bodyParser from 'body-parser';
import { LEDmatrix } from './src/ledMatrix/ledMartix';
import { FootballApi } from './src/sportApi/footballApi';
import { Networking } from './src/networking/networking';
import {displayBoardInfo} from './src/ledMatrix/ledMartix'
import webSocket from 'ws'
import matrixRouter from './matrixRouterBuilder'

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



const displayboard1:displayBoardInfo = {
  mac: '00:1D:6F:01:D6:03',
  port: 9520,
};

const matrix1 = new LEDmatrix()
const matrix2 = new LEDmatrix()
async function initMatrixes(){
  await matrix1.init(displayboard1)
  await matrix2.init(displayboard1)
}


const wsServer = new webSocket.Server({server})

wsServer.on('connection', (ws:webSocket,req) =>{
  console.log("connect to: " + req.socket.remoteAddress)

  ws.on('close', ()=>{
    console.log(req.socket.remoteAddress + " Closed the connection")
  })
})

initMatrixes()

const matrix1Route = '/matrix1'
const router1 = matrixRouter(matrix1, server, wsServer, matrix1Route)
app.use(matrix1Route, router1)

const matrix2Route = '/matrix2'
const router2 = matrixRouter(matrix2, server, wsServer, matrix2Route)
app.use(matrix2Route, router2)


