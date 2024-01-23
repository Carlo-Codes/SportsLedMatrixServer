import fs from 'fs/promises'

interface match extends Object{
  strStatus:string
  strTimestamp:string
}

interface matchesByMatchWeek{
  events:object[]
}

interface MatchWeekMatches{
matchWeek:number,
matches:match[]
}

function sleep(ms:number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  });
}

export class FootballApi{
  matchWeeks = 38;
  season = '2023-2024' //change this progromatically for production
  date = Date.now() //in miliseconds
  allMatches:MatchWeekMatches[]|undefined;
  allMatchesFilePath = `allMatchesPerMatchWeek${this.season}.json`
  currentMatchWeek = 0

  nextMatch:match|undefined;

  constructor(){

  }

  async init(){
    try {
      await this.readMatchesFromServer().then((resolve)=>{
        this.update()
        this.setMatchWeek(21)//get this from api
      })
      if(!this.allMatches){
        await this.getAndSaveMatchesToServer()
      }
    } catch (error:unknown) {
      if(error instanceof Error){
        console.log(error)
      }
    }
  }


  private async getMatchesByMatchWeek(){
    try {
      for (let i = 1; i <= this.matchWeeks; i++){
        const res = await fetch(`https://www.thesportsdb.com/api/v1/json/3/eventsround.php?id=4328&r=${i}&s=${this.season}`)
        const response = await res.json() as matchesByMatchWeek
        await sleep(100)
        const matchWeek:MatchWeekMatches = {
          matchWeek:i,
          matches:response.events as match[],
        }
        this.allMatches = this.allMatches?.concat(matchWeek)
    }
  
    } catch (error:unknown) {
      if(error instanceof Error){
        console.log(error)
      }
    }
  }
  
  private async saveMatchesToFile(){
  
    try {
      const dataString = JSON.stringify(this.allMatches);
      await fs.writeFile(this.allMatchesFilePath, dataString , 'utf-8')
    }
     catch (error:unknown) {
      if(error instanceof Error){
        console.log(error)
      }
    }
  
  }
  
  async getAndSaveMatchesToServer(callback:()=>void = ()=>{null}){
    await this.getMatchesByMatchWeek();
    await this.saveMatchesToFile();
    callback
  }
  
  async readMatchesFromServer(){
    try {
      const data = await fs.readFile(this.allMatchesFilePath, {encoding:"utf-8"})
      const json = await JSON.parse(data)
      this.allMatches =  json as MatchWeekMatches[]
      } catch (error:unknown) {
        if(error instanceof Error){
          console.log(error)
        }
      }
  }


  setMatchWeek(weekN: number){
    this.currentMatchWeek = weekN;
  }
  calculateCurrentGameWeek(){ //this is POINTLESS!!! just pay for api
    if(this.allMatches){
      for(let i = 0; i < this.allMatches?.length; i++){ //"strStatus": "Not Started"
        for(let j = 0; j < this.allMatches[i].matches.length; j++){
          const tempMatch = this.allMatches[i].matches[j];
          if(tempMatch.strStatus !== "Not Started"){
            if(!this.nextMatch){
              this.nextMatch = tempMatch
            }else{
              const currentnextMatchDate = new Date(this.nextMatch.strTimestamp).valueOf()
              const newNextMatchDate = new Date(tempMatch.strTimestamp).valueOf()
              if(newNextMatchDate>currentnextMatchDate){

                this.nextMatch = tempMatch
                this.currentMatchWeek = this.allMatches[i].matchWeek
              }
            }
          }
        }
      }  
    }
    console.log(this.nextMatch)
  }

  getCurrentWeekMatches(){
    
  }

  formatResults(){

  }

  update(){
    this.date = Date.now();
    //this.calculateCurrentGameWeek()
  }


}



