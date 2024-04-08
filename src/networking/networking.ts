import { spawn, ChildProcess, exec } from "child_process"
import { error } from "console"

interface arpScanRes{
  ip:string,
  mac:string
}

export class Networking{
    ipAddress:string|undefined = ''
    networkInterfaces:object = {}
    arpScan:ChildProcess | undefined
    arpScanCommand = 'sudo';
    arpScanArgs = ['arp-scan', '192.168.1.0/24', '--plain']
    scannedIps:arpScanRes[] = [] 



    async init(){
      const result = await new Promise((resolve, reject)=>{
        this.arpScan = exec(this.arpScanCommand + " " + this.arpScanArgs[0] + " " + this.arpScanArgs[1] + " " + this.arpScanArgs[2],(error, stdout, stderr)=>{
          if (error) {
            console.error(`exec error: ${error}`);
            reject(error)
            return;
          }
          const datalines = stdout.split('\n')
            for(let i = 0; i < datalines.length; i++){
                const values = datalines[i].split('\t')
                
                  const scannedIp:arpScanRes = {
                    ip:values[0], 
                    mac:values[1]
                  }
                  
                  this.scannedIps.push(scannedIp)
                } 
              
          
          console.error(`stderr: ${stderr}`);

          resolve(stdout)
        })
      })
    }

  
    getIpfromMac(mac:string){
      try { 
        if(!mac){
          throw new Error("No Mac address supplied")
        }
        const ip =  this.scannedIps.filter((obj)=>{
          if(!obj.mac) {return false}
          const scannedMac = obj.mac.toLowerCase();
          const comparisonMac = mac.toLowerCase();
          if(scannedMac === comparisonMac){
            return obj
          } 
        })[0]

        if(!ip){
          throw new Error("No Ip address found for " + mac)
        }
  
        return ip.ip
      } catch (Error) {
        console.log(Error)
      }

    }

  


    
}