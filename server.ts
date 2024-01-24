
import express, { Response, Request } from 'express';
import * as path from 'path';
import bodyParser from 'body-parser';
import { LEDmatrix } from './src/ledMatrix/ledMartix';
import { FootballApi } from './src/sportApi/footballApi';

const port = 3000;

const displayboard = {
  host: '192.168.1.134',
  port: 9520
};



async function initMatrix(){
  const matrix = new LEDmatrix()
  matrix.connectToMatrix()
  matrix.addApi(new FootballApi)
  await matrix.init(displayboard).then(()=>{
    matrix.parseData();
    matrix.sendData();
  })
  
}



const app = express();

app.use(express.static('public'));

app.use(bodyParser.text()); // Add this middleware to parse text/plain requests

app.use(function (req: Request, res: Response, next: Function) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  initMatrix();

});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.post('/sendText', (req, res) => {
  const text = req.body as string;

  res.status(200).send('Data received successfully');
});
