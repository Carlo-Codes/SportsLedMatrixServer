const textBox = document.getElementById('addtext')
const sendbtn = document.getElementById('button')

async function SendData(){
    const text = JSON.stringify(textBox.nodeValue)
    console.log(text)
    const res = await fetch('localhost/sendText', {
        method: 'POST',
        body:text
    })

}

sendbtn.item(0).addEventListener('click', SendData)