
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
  port: 9520
};

const matrix1 = new LEDmatrix()

async function initMatrixes(){
  await matrix1.init(displayboard1)
}

initMatrixes()

const matrix1Route = '/matrix1'
const router1 = matrixRouter(matrix1, server ,matrix1Route)
app.use(matrix1Route, router1)


