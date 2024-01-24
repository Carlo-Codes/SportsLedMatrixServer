export class MatrixParser{
    _textToParse = ''
    _hexToSend:Buffer|undefined
    _startHex = '';
    _endHex = '';
    constructor(){

    }

    init(startHex = `015A303002410F45544141060A49310A4F31`, endHex = '04'){
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
        return this._hexToSend
    }

    public set startHex(string:string){
        this._startHex = string
    }

    public set endHex(string:string){
        this._endHex = string
    }

    
}