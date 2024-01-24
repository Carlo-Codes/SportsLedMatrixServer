import fs from 'fs/promises'
import { APIdata } from './API';

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



export class FootballApi{

  data = new APIdata()
  apiKey = '3'
  matchWeeks = 38;
  season = '2023-2024' //change this progromatically for production
  date = Date.now() //in miliseconds
  allMatchesFilePath = `allMatchesPerMatchWeek${this.season}.json`
  currentMatchWeek = 0
  matches:match[] =[]

  constructor(){

  }

  async init(){
    try {
      await this.data.init(this.allMatchesFilePath).then((resolve)=>{
        this.setMatchWeek(21)//get this from api
      })
      if(!this.data._data){
        await this.getMatchesByMatchWeek()
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
        this.data.fetchAndAdd(`https://www.thesportsdb.com/api/v1/json/${this.apiKey}/eventsround.php?id=4328&r=${i}&s=${this.season}`, i)
    }
  
    } catch (error:unknown) {
      if(error instanceof Error){
        console.log(error)
      }
    }
  }
  


  setMatchWeek(weekN: number){
    this.currentMatchWeek = weekN;
  }
/*   calculateCurrentGameWeek(){ //this is POINTLESS!!! just pay for api
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
  } */

  getCurrentWeekMatches(){
    const data = this.data._data as unknown as MatchWeekMatches[]
    const matches = data.filter((week)=>{
      week.matchWeek === this.currentMatchWeek
    })[0]
    this.matches = matches.matches
  }

  formatResults(week:match){// here
/*     const homeTeam
    const awayTeam
    const score */
  }

  update(){
    this.date = Date.now();
    //this.calculateCurrentGameWeek()
  }


}



