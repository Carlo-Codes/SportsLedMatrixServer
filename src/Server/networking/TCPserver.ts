/* import net, { Socket } from 'net'

export let sockets:Socket[] = []



export const TCPserver = net.createServer((socket:Socket) => {
    const deviceinfo = { //porbably wont need this
        name:"RasberryPi",
        ip:socket.remoteAddress
    }
    console.log('clientConnected')
    sockets.push(socket);

    socket.on('end', () => {
        console.log('client Disconnected')
        let index = sockets.indexOf(socket)
        if(index !== -1){
          sockets.splice(index, 1)
        }
    })
    socket.write('hello from the server! \r\n')
})

TCPserver.on('error', (err:unknown) => {
    if(err instanceof Error){
        throw err
    }
})





// telnet localhost 3001




/* const net = require('net');

const serverPort = 12345; // Replace with the actual port number

const server = net.createServer((socket) => {
  // Send information about the device when a connection is established
  const deviceInfo = {
    name: 'MyDevice',
    ip: socket.remoteAddress,
    // Add other information as needed
  };

  socket.write(JSON.stringify(deviceInfo));
  socket.end();
});

server.listen(serverPort, () => {
  console.log(`TCP server listening on port ${serverPort}`);
});
 */ 