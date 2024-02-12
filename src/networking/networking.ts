import { spawn, ChildProcessWithoutNullStreams } from "child_process"

export class Networking{
    ipAddress:string|undefined = ''
    networkInterfaces:object = {}
    arpScan:ChildProcessWithoutNullStreams
    arpScanCommand = 'arp-scan';
    arpScanArgs = ['192.168.1.0/24'];

    constructor(){
        this.arpScan = spawn('sudo', [this.arpScanCommand, ...this.arpScanArgs])

        this.arpScan.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
          });
          
          this.arpScan.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
          });
          
          this.arpScan.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
          }); 
            
    }


    
}