import { FootballApi } from "../sportApi/footballApi";
import {MatrixParser} from '../matrixParser/matrixParser'
import net from 'net'
import { Networking } from "../networking/networking";
import { resolve } from "path";
import express from 'express';
import webSocket from 'ws'
import { Server, IncomingMessage, ServerResponse } from 'http';


export interface displayBoardInfo {
    mac: string,
    port: number
  };

export class LEDmatrix{
    _api:FootballApi|undefined//or basket ball etc 
    _parser:MatrixParser = new MatrixParser(); 
    private _ipHost:string|undefined = '';
    private _ipPort:number = 0;
    _matrixSocket:net.Socket|undefined
    _networking:Networking = new Networking()
    private _updateLoopTime = 1200000 //20 minutes to allow for free tier
    private _apiUpdateLoop:NodeJS.Timeout|undefined

    constructor(){

    }

    async init(info:displayBoardInfo){
        await this._networking.init();
        this._ipHost = this._networking.getIpfromMac(info.mac)
        this._ipPort = info.port

        this._matrixSocket = net.createConnection(this._ipPort, this._ipHost)

        this._matrixSocket.on('connect',()=>{
            console.log('connected to display')
            console.log(this._matrixSocket?.remoteAddress)
        })

        this._matrixSocket.on('error', ()=>{
            console.log('Conneciton to Matrix Error')
        })

        this._parser.init();
    }

    async addApi(data:FootballApi){ // or basketball etc
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

   
}