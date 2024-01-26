import { FootballApi } from "../sportApi/footballApi";
import {MatrixParser} from '../matrixParser/matrixParser'
import net from 'net'

export interface displayboardIP {
    host: string,
    port: number
  };

export class LEDmatrix{
    _api:FootballApi|undefined//or basket ball etc 
    _parser:MatrixParser = new MatrixParser();
    _ipHost:string = '';
    _ipPort:number = 0;
    _matrixSocket:net.Socket|undefined

    constructor(){

    }

    async init(IPinfo:displayboardIP){
        this._ipHost = IPinfo.host
        this._ipPort = IPinfo.port
        this._matrixSocket = net.createConnection(IPinfo.port, IPinfo.host)

        this._matrixSocket.on('connect',()=>{
            console.log('connected to display')
            console.log(this._matrixSocket?.remoteAddress)
        })

        this._matrixSocket.on('error', ()=>{

        })

        this._parser.init();
        await this._api?.init();
    }

    addApi(data:FootballApi){ // or basketball etc
        this._api = data
    }

    update(){
        this._api?.update();
    }

    parseAPIData(){
        if(this._api){
            let concatString = ''
            const results = this._api?.getFormattedResults()
            for(let i = 0; i < results?.length; i++){
                concatString = concatString.concat(results[i] + "     ")
            }
            this._parser.ParseText(concatString)
        }
    }

    sendData(){
        if(this._parser._hexToSend){
            console.log(this._parser._textToParse)
    
            this._matrixSocket?.write(this._parser._hexToSend)
            
        }
    }

    async connectToMatrix(){
        if(this._matrixSocket){

        
        }
    }
}