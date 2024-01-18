const textBox = document.getElementById('addtext')
const sendbtn = document.getElementById('sendbtn')

async function SendData() {
    const text = textBox.value;
    console.log(text);
    const res = await fetch('http://localhost:3000/sendText', {
        method: 'POST',
        body: text
    });
}

sendbtn.addEventListener('click', SendData)