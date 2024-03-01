import { APIdata } from './API';
import { League, Fixture, SportsApiResponse } from './@types/SpotsAPi';

export class SportsApiBaseClass{
    _apiSportsURL = 'https://v3.football.api-sports.io/'
  
  
    apiSportsConfig = {
      method:'get',
      headers: {
          "x-rapidapi-key":"14dbc453cdfea255add81128ba902975",
          "x-rapidapi-host":"v3.football.api-sports.io"
      }
    }
  
   
    initSeasonDependentData(){

    }
  
  
    constructor(){
  
    }
  
    async init(){

    }
  
  
    async getSeason(){

    }
  
    formatFixture(fixture:Fixture){

    }
  
    getFormattedResults():string[]{
        return ['']
    }
  
    async update(){

  
    }
  
  }