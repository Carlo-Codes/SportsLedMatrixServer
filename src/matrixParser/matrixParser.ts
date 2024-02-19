export class MatrixParser{
    _textToParse = ''
    _hexToSend:Buffer|undefined
    _startHex = '';
    _endHex = '';
    _newLineHex = '0D'
    _linesToParse:string []= []
    constructor(){

    }
    

    init(startHex = `015A303002410F45544141060A49310A4F311C321A340E3230303030`, endHex = '04'){
        this._startHex = startHex;
        this._endHex = endHex;
    }

    stringToHex(str:string) {
        let hex = '';
        for (let i = 0; i < str.length; i++) {
            let charCode = str.charCodeAt(i).toString(16);
            hex += charCode.length === 1 ? '0' + charCode : charCode;
        }
        return hex;
    }

    public ParseText(string:string){
        this._textToParse = string
        const textToHex = this.stringToHex(string)
        const combinedHex = this._startHex + textToHex + this._endHex
        this._hexToSend = Buffer.from(combinedHex, 'hex')
    }

    public ParseLines(lines:string[]){
        this._linesToParse = lines
        let combinedHex:string = ''
        for(let i = 0; i < lines.length; i++){
            const lineHex = this.stringToHex(lines[i])
            const combinedLine = lineHex + this._newLineHex
            combinedHex+=combinedLine;
        }
        combinedHex = this._startHex + combinedHex + this._endHex
        this._hexToSend = Buffer.from(combinedHex, 'hex')
    }

    public set startHex(string:string){
        this._startHex = string
    }

    public set endHex(string:string){
        this._endHex = string
    }

    
}