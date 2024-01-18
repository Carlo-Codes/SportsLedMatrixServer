export function stringToHex(str:string) {
    let hex = '';
    for (let i = 0; i < str.length; i++) {
        let charCode = str.charCodeAt(i).toString(16);
        hex += charCode.length === 1 ? '0' + charCode : charCode;
    }
    return hex;
}