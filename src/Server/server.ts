import express from 'express'
import * as path from 'path';
import { TCPserver, sockets } from './networking/TCPserver';
const port = 3000
const TCPport = 3001

const app = express()

app.use(express.static('../Client'))

TCPserver.listen(TCPport, () => {
  console.log('got Ya')  
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Client/test.html'))
    for(let i = 0; i < sockets.length; i++){
      sockets[i].write('<0x01>Z00<0x02>AA<0x06><0x0a>I0ABCD2345<0x0D>EFGH6789<0x0D>IJKL0123<0x04>')
  }
  })




