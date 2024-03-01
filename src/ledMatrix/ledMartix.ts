import { FootballApi } from "../sportApi/footballApi";
import {MatrixParser} from '../matrixParser/matrixParser'
import net from 'net'
import { Networking } from "../networking/networking";
import { resolve } from "path";
import express, { Router } from 'express';
import webSocket from 'ws'
import { SportsApiBaseClass } from "../sportApi/sportsApiBaseClass";
import { Server, IncomingMessage, ServerResponse } from 'http';



export interface displayBoardInfo {
    mac: string,
    port: number,
    apiRoute : string
  };

export class LEDmatrix{
    
    //const server things
    readonly _routeUrl:string
    _ws:webSocket[] = [] //webSockects - this could be from various browers and ips, we broadcast the status of matrix to all sockets.

    //changable data things
    _api:SportsApiBaseClass|undefined
    _parser:MatrixParser = new MatrixParser(); 

    private _mac:string
    private _ipHost:string|undefined = '';
    private _ipPort:number;
    private _matrixSocket:net.Socket|undefined
    private _networking:Networking = new Networking()
    private _updateLoopTime = 1200000 //20 minutes to allow for api free tier
    private _apiUpdateLoop:NodeJS.Timeout|undefined

    constructor(info:displayBoardInfo){
        this._routeUrl = info.apiRoute
        this._mac = info.mac
        this._ipPort = info.port
    }

    async init(){
        await this._networking.init();
        this._ipHost = this._networking.getIpfromMac(this._mac)
        this._matrixSocket = net.createConnection(this._ipPort, this._ipHost)
        this._matrixSocket.on('connect',()=>{
            console.log('connected to display')
            console.log(this._matrixSocket?.remoteAddress)
        })

        this._matrixSocket.on('error', ()=>{
            console.log('Conneciton to Matrix Error ' + this._routeUrl)
        })

        this._parser.init();
    }

    async addApi(data:SportsApiBaseClass){ // or basketball etc
        this._api = data
        await this._api.init()
    }

    async removeApi(){
        this._api = undefined
        this.stopUpdateLoop();
    }

    async update(){
        await this._api?.update();
        this.parseAPIData(); 
        this.sendData();
    }

    parseAPIData(){
        if(this._api){
            let concatString = ''
            const results = this._api?.getFormattedResults()
            this._parser.ParseLines(results)
        }
    }

    sendData(){
        if(this._parser._hexToSend){
            console.log(this._parser._textToParse)
            this._matrixSocket?.write(this._parser._hexToSend)
        }
    }

    async initUpdateLoop(){
        this._apiUpdateLoop = setInterval(async()=>{
            await this.update();
        }, this._updateLoopTime)
    }

    stopUpdateLoop(){
        clearInterval(this._apiUpdateLoop)
    }

    attachWebsocket(ws:webSocket){
        this._ws?.push(ws)
    }

    sendToAllSockets(text:string){
        for(let i = 0; i < this._ws?.length!; i++){
            this._ws[i].send(text)
        }
    }

    matrixRouteBuilder(){
        const router = express.Router()
        router.post('/sendText', (req, res) => {
            try {
                const text = req.body as string;
                this.removeApi();
                this._parser.ParseText(text)
                this.sendData()
                this.sendToAllSockets(text)
                
                res.status(200).send('Data received successfully');
            
            } catch (error) {
              console.log(error)
            }
        });
          
        router.get('/football', async(req,res) => {
            await this.addApi(new FootballApi())
            await this.update();
            await this.initUpdateLoop()
            this.sendToAllSockets(this._parser._textToParse)
          
            res.status(200).send('Request received successfully');
        })
        
        return router
    }

   
}