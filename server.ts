
import express, { Response, Request } from 'express';
import * as path from 'path';
import bodyParser from 'body-parser';
import {stringToHex} from './utils/utils'

const port = 3000;

const displayboard = {
  host: '192.168.1.111',
  port: 9520
};

const scrollingStartHex = `015A303002410F45544141060A49310A4F31`;
const endHex = '04';
const testdata = '61616161';

const data = scrollingStartHex + testdata + endHex;



/* const tcpClient = net.createConnection(displayboard.port, displayboard.host)
tcpClient.on('connect',()=>{
  console.log('connected to display')
  tcpClient.write(rawHex)
  console.log(rawHex)
  
}) */

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
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.post('/sendText', (req, res) => {
  const text = req.body as string;
  const textToHex = stringToHex(text)
  const hex = scrollingStartHex + textToHex + endHex
  const rawHex = Buffer.from(hex, 'hex')
  console.log(rawHex)
  //tcpClient.write(rawHex)
  res.status(200).send('Data received successfully');
});
