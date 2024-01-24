import net from 'net'

const testServer = net.createServer((socket)=>{
    socket.write('Echo server\r\n');
    socket.on('data', (data)=>{
        console.log(data)
    })
    socket.pipe(socket)
})

testServer.listen(()=>{
    console.log(testServer.address())
} )
