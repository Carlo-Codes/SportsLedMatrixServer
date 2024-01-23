import fs from 'fs/promises'

interface match extends Object{
  strStatus:string
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
      this.allMatches = await this.readMatchesFromServer()
      if(!this.allMatches){
        this.getAndSaveMatchesToServer()
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
  
  async getAndSaveMatchesToServer(){
    await this.getMatchesByMatchWeek();
    await this.saveMatchesToFile();
  }
  
  async readMatchesFromServer(){
    try {
      const data = await fs.readFile(this.allMatchesFilePath, {encoding:"utf-8"})
      const json = JSON.parse(data)
      return json as MatchWeekMatches[]
      } catch (error:unknown) {
        if(error instanceof Error){
          console.log(error)
        }
      }
  }

  async update(){
    this.date = Date.now();
    this.calculateCurrentGameWeek();
  }

  calculateCurrentGameWeek(){
    if(this.allMatches){
      for(let i = 1; i <= this.allMatches?.length; i++){ //"strStatus": "Not Started"
        for(let j = 0; j < this.allMatches[i].matches.length; j++){
          if(this.allMatches[i].matches[j].strStatus !== "Not Started"){
            if(!this.nextMatch){
              this.nextMatch = this.allMatches[i].matches[j]
            }else{
              const currentnextMatchDate = new Date(this.nextMatch.strStatus).valueOf()
              const newNextMatchDate = new Date(this.allMatches[i].matches[j].strStatus).valueOf()
              if(newNextMatchDate>currentnextMatchDate){
                this.nextMatch = this.nextMatch = this.allMatches[i].matches[j]
                this.currentMatchWeek = i
              }
            }
          }
        }
      }  
    }
  }


}



