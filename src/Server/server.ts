import express from 'express'
import * as path from 'path';
import net, { Socket } from 'net'
import bodyParser from "body-parser";



//import { TCPserver, sockets } from './networking/TCPserver';
const port = 3000

const displayboard = {
  host:'192.168.1.111',
  port : 9520
}

const scrollingStartHex = `015A303002410F45544141060A49310A4F31`
const endHex = '04'
const testdata ='61616161'

const data = scrollingStartHex + testdata + endHex

const rawHex = Buffer.from(data, 'hex')


const app = express()

app.use(express.static('public'));
app.use(express.json());


app.use(express.static('../Client/public/'))


const tcpClient = net.createConnection(displayboard.port, displayboard.host)
tcpClient.on('connect',()=>{
  console.log('connected to display')
  tcpClient.write(rawHex)
  console.log(rawHex)
  
})

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});




app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../Client/test.html'))

})
app.get('/public/index.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../Client/public/index.js'))

})




app.post('/sendText', (req,res) => {
    const test = req.body as string
    const hex = scrollingStartHex + test + endHex
})




