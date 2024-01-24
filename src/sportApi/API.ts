import fs from 'fs/promises'
import fetch from 'node-fetch'


function sleep(ms:number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    });
  }

export class APIdata {
    _url = ''
    _savePath = ''
    _data:SportsApiResponse;
    _fetchOptions = {}

    constructor(){

    }

    async init(url:string, savePath:string, fetchOptions:object){
        this._url = url
        this._savePath = savePath;
        this._fetchOptions = fetchOptions
    }

    async fetch(){
        try {
            const res = await fetch(this._url,this._fetchOptions);
            const response = await res.json()
            this._data = response
            this.saveDataToFile()
            
            
        } catch (err:unknown) {
            if(err instanceof Error){
                console.log(err)
            }
        }
    }


    async saveDataToFile(){

        try {
          const dataString = JSON.stringify(this._data);
          await fs.writeFile(this._savePath, dataString , 'utf-8')
        }
         catch (error:unknown) {
          if(error instanceof Error){
            console.log(error)
          }
        }
      
      }

    async readFileFromServer(){
        try {
          const data = await fs.readFile(this._savePath, {encoding:"utf-8"})
          const json = await JSON.parse(data)
          this._data =  json as SportsApiResponse
          } catch (error:unknown) {
            if(error instanceof Error){
              console.log(error)
            }
          }
      }

    async update(){
        await this.update();
    }
}