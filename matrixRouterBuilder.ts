import express, { Response, Request } from 'express';
import * as path from 'path';
import bodyParser from 'body-parser';
import { LEDmatrix } from './src/ledMatrix/ledMartix';
import { FootballApi } from './src/sportApi/footballApi';
import { Networking } from './src/networking/networking';
import {displayBoardInfo} from './src/ledMatrix/ledMartix'
import webSocket from 'ws'
import { Server, IncomingMessage, ServerResponse } from 'http';


function matrixRouteBuilder(matrix:LEDmatrix, server: Server<typeof IncomingMessage, typeof ServerResponse>, wsServer:webSocket.Server, route:string){
    const router = express.Router()
    router.post('/sendText', (req, res) => {
        try {
          const text = req.body as string;
          matrix.removeApi();
          matrix._parser.ParseText(text)
          matrix.sendData()
        
          console.log(req.ip)
          wsServer.clients.forEach((client) => {
            if(client.readyState === webSocket.OPEN){
              client.send(text)
            }
          })
          res.status(200).send('Data received successfully');
        
        } catch (error) {
          console.log(error)
        }
    });
      
    
    router.get('/football', async(req,res) => {
        await matrix.addApi(new FootballApi())
        await matrix.update();
        await matrix.initUpdateLoop()
        wsServer.clients.forEach((client) => {
          if(client.readyState === webSocket.OPEN){
            client.send(matrix._parser._textToParse)
          }
        })

        res.status(200).send('Request received successfully');
    })
    
    return router
}

export default matrixRouteBuilder
