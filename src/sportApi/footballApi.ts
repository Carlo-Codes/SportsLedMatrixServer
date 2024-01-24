import fs from 'fs/promises'
import { APIdata } from './API';
import { League, Fixture, SportsApiResponse } from './@types/SpotsAPi';


export class FootballApi{
  _apiSportsURL = 'https://v3.football.api-sports.io/'

  _season = 0 //change this progromatically for production

  _premSeasonURL =  this._apiSportsURL + 'leagues?id=39'
  _premSeasonData = new APIdata() // all seasons ever so i can get the current season
  _premSeaonDataPath = 'premSeasonData.json'

  _premLiveFixturesURL = ''
  _premLiveFixturesData = new APIdata()
  _premLiveFixturesDataSavePath = ''

  _premLastTenFixturesURL = ''
  _premLastTenFixturesData = new APIdata()
  _premLastTenFixturesDataSavePath = ''


  apiSportsConfig = {
    method:'get',
    headers: {
        "x-rapidapi-key":"14dbc453cdfea255add81128ba902975",
        "x-rapidapi-host":"v3.football.api-sports.io"
    }
  }

 
  initSeasonDependentData(){

    this._premLiveFixturesURL = this._apiSportsURL + `league=39&season=${this._season}&live=all`
    this._premLiveFixturesDataSavePath = `premLiveFixtureData${this._season}.json`

    this._premLastTenFixturesURL = this._apiSportsURL + `fixtures?league=39&season=${this._season}&last=10`
    this._premLastTenFixturesDataSavePath = `premlast10FixtureData${this._season}.json`

    this._premLiveFixturesData.init(this._premLiveFixturesURL,this._premLiveFixturesDataSavePath,this.apiSportsConfig)
    this._premLastTenFixturesData.init(this._premLastTenFixturesURL, this._premLastTenFixturesDataSavePath, this.apiSportsConfig)
  }


  constructor(){

  }

  async init(){
    try {
      this._premSeasonData.init(this._premSeasonURL,this._premSeaonDataPath, this.apiSportsConfig)
      await this._premSeasonData.fetch().then(async()=>{
        this.getSeason();
        this.initSeasonDependentData();
        await this._premLiveFixturesData.fetch();
        await this._premLastTenFixturesData.fetch();
      })

    } catch (error:unknown) {
      if(error instanceof Error){
        console.log(error)
      }
    }
  }


  async getSeason(){
    const data = this._premSeasonData._data as SportsApiResponse
    const response = data.response as League[]
    const seasons = response[0].seasons
    for (let i = 0; i < seasons.length; i++){
      if(seasons[i].current){
        this._season = seasons[i].year
      }
    }
    
  }

  formatFixture(fixture:Fixture){// here
    const homeTeam = fixture.teams.home.name
    const awayTeam = fixture.teams.away.name
    const homeScore = fixture.goals.home
    const awayScore = fixture.goals.away
    const fixtureText = homeTeam + " " + homeScore + " - " + awayScore + " " + awayTeam
    return fixtureText
  }

  getFormattedResults(){
    let response:string[] = []

    const liveData = this._premLiveFixturesData._data
    const last10Data = this._premLastTenFixturesData._data

    if(liveData){
      const liveFixtures = liveData.response as Fixture[]
      if(liveFixtures){
        for(let i =0; i < liveFixtures.length; i++){
          response.push(this.formatFixture(liveFixtures[i]))
        }
    }
    }
    
    if(last10Data){
      const last10Fixtures = last10Data?.response as Fixture[]
      for(let i = 0; i < last10Fixtures.length; i++){
        response.push(this.formatFixture(last10Fixtures[i]))
      }
    }
    return response
  }

  async update(){
    try {
      this._premSeasonData.init(this._premSeasonURL,this._premSeaonDataPath, this.apiSportsConfig)
      await this._premSeasonData.fetch().then(async()=>{
        this.getSeason();
        this.initSeasonDependentData();
        await this._premLiveFixturesData.fetch();
        await this._premLastTenFixturesData.fetch();
      })

    } catch (error:unknown) {
      if(error instanceof Error){
        console.log(error)
      }
    }

  }

}



