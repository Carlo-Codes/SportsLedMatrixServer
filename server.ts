
import express, { Response, Request } from 'express';
import * as path from 'path';
import bodyParser from 'body-parser';
import { LEDmatrix } from './src/ledMatrix/ledMartix';
import { FootballApi } from './src/sportApi/footballApi';
import { Networking } from './src/networking/networking';
import {displayBoardInfo} from './src/ledMatrix/ledMartix'
import webSocket from 'ws'

/////setting up server/////////
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

/////setting up server/////////

////setting up matricies///////

const displayboard1:displayBoardInfo = {
  mac: '00:1D:6F:01:D6:03',
  port: 9520,
  apiRoute:'/matrix1'
};


const displayboard2:displayBoardInfo = {
  mac: '00:1D:6F:01:D6:03',
  port: 9520,
  apiRoute:'/matrix2'
};

const matrix1 = new LEDmatrix(displayboard1)
const matrix2 = new LEDmatrix(displayboard2)

const matricies = [matrix1, matrix2]

////setting up matricies///////

////setting up webscoketServer///////

const wsServer = new webSocket.Server({server})

wsServer.on('connection', (ws:webSocket,req) =>{
  console.log("websocket connect to: " + req.url)

  //attaching sockets to matricies based on url
  for(let i = 0; i < matricies.length; i++){
    if(matricies[i]._routeUrl === req.url){
      matricies[i].attachWebsocket(ws)
      ws.send(matricies[i]._parser._textToParse)
    }
  }

  ws.on('close', ()=>{
    console.log(req.socket.remoteAddress + " Closed the connection")
  })
})

////setting up webscoketServer///////

///init matricies///
async function initMatrixes(){
  for(let i = 0; i < matricies.length; i++){
    matricies[i].init()
  }
}

app.use(matrix1._routeUrl, matrix1.matrixRouteBuilder())
app.use(matrix2._routeUrl, matrix2.matrixRouteBuilder())

initMatrixes()

///init matricies///



