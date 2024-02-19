import { FootballApi } from "../sportApi/footballApi";
import {MatrixParser} from '../matrixParser/matrixParser'
import net from 'net'
import { Networking } from "../networking/networking";

export interface displayBoardInfo {
    mac: string,
    port: number
  };

export class LEDmatrix{
    _api:FootballApi|undefined//or basket ball etc 
    _parser:MatrixParser = new MatrixParser(); 
    _ipHost:string|undefined = '';
    _ipPort:number = 0;
    _matrixSocket:net.Socket|undefined
    _networking:Networking = new Networking()

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
                concatString = concatString.concat(results[i] + "\n\n")
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