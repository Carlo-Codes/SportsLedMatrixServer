import express from 'express'
import * as path from 'path';

const port = 3000

const app = express()

app.use(express.static('../Client'))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Client/test.html'))
    
  })