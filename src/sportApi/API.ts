import fs from 'fs/promises'

export interface IAPIData{
    i:number,
    data:object
}

export class APIdata {

    _savePath = ''
    _data:IAPIData[];


    constructor(){

    }

    async init(savePath:string){
        this._savePath = savePath;
    }

    async fetchAndAdd(url:string, i:number){
        try {
            const res = await fetch(url)
            const response = await res.json() as object
            this._data = this._data.concat(
                {
                    i:i,
                    data:response
                }
            )
        } catch (err:unknown) {
            if(err instanceof Error){
                console.log(err)
            }
        }
         
    }

    async fetch(url:string){
        try {
            const res = await fetch(url);
            const response = await res.json() as object
            this._data = [
                {
                    i:0,
                    data:response
                }
            ]
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
          this._data =  json as IAPIData[]
          } catch (error:unknown) {
            if(error instanceof Error){
              console.log(error)
            }
          }
      }
}