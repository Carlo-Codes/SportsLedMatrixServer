import { FootballApi } from "../sportApi/footballApi";
import {MatrixParser} from '../matrixParser/matrixParser'

interface displayboardIP {
    host: string,
    port: number
  };

class LEDmatrix{
    data:FootballApi|undefined//or basket ball etc
    parser:MatrixParser = new MatrixParser();
    constructor(){

    }

    init(IPinfo:displayboardIP){

    }
}