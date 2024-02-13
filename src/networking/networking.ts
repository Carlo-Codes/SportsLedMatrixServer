import { spawn, ChildProcessWithoutNullStreams } from "child_process"

interface arpScanRes{
  ip:string,
  mac:string
}

export class Networking{
    ipAddress:string|undefined = ''
    networkInterfaces:object = {}
    arpScan:ChildProcessWithoutNullStreams
    arpScanCommand = 'sudo';
    arpScanArgs = ['arp-scan', '192.168.1.0/24']
    scannedIps:arpScanRes[] = []


    constructor(){
        this.arpScan = spawn(this.arpScanCommand, [...this.arpScanArgs])

        this.arpScan.stdout.on('data', (data:Buffer) => {
          const converted = data.toString();
            console.log(`stdout: ${data}`);
            const datalines = converted.split('\n')
            for(let i = 0; i < datalines.length; i++){
              if(i === 0 || i === 1 ||i === datalines.length){
                continue
              }else {
                const values = datalines[i].split('\t')
                
                  const scannedIp:arpScanRes = {
                    ip:values[0], 
                    mac:values[1]
                  }
                  
                  this.scannedIps.push(scannedIp)
                
              }
            } 


          });
          
          this.arpScan.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
          });
          
          this.arpScan.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
          }); 
            
    }

  


    
}