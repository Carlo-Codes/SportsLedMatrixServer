
import express, { Response, Request } from 'express';
import * as path from 'path';
import bodyParser from 'body-parser';
import { LEDmatrix } from './src/ledMatrix/ledMartix';
import { FootballApi } from './src/sportApi/footballApi';
import { Networking } from './src/networking/networking';
const port = 3000;

const displayboard = {
  host: '192.168.1.187',
  port: 9520
};


const matrix = new LEDmatrix()

async function initMatrix(){
  matrix.addApi(new FootballApi)
  await matrix.init(displayboard).then(async()=>{
      matrix.parseAPIData();
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
  //initMatrix();
  const networking = new Networking()
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.post('/sendText', (req, res) => {
  const text = req.body as string;
  matrix._parser.ParseText(text)
  matrix.sendData()
  console.log(req.ip)
  res.status(200).send('Data received successfully');
});
