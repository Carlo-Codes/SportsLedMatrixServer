import { spawn, ChildProcessWithoutNullStreams } from "child_process"

interface arpScanRes{
  ip:string,
  mac:string
}

export class Networking{
    ipAddress:string|undefined = ''
    networkInterfaces:object = {}
    arpScan:ChildProcessWithoutNullStreams
    arpScanCommand = 'arp-scan';
    arpScanArgs = ['192.168.1.0/24'];
    scannedIps:arpScanRes[] = []


    constructor(){
        this.arpScan = spawn('sudo', [this.arpScanCommand, ...this.arpScanArgs])

        this.arpScan.stdout.on('data', (data:string) => {
            console.log(`stdout: ${data}`);
            const parsedData = data.split('\t')
            const scannedIp:arpScanRes = {
              ip:parsedData[0],
              mac:parsedData[1]
            }
            this.scannedIps.push(scannedIp)

          });
          
          this.arpScan.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
          });
          
          this.arpScan.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
          }); 
            
    }


    
}