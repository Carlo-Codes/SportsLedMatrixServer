import { useState } from "react";
import './App.css'

function App() {

  const [textToSend, setTextToSend] = useState('')

  const handleTextChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    setTextToSend(e.target.value)
  }

  async function SendData() {
    const res = await fetch('http://192.168.1.250:3000/sendText', {
        method: 'POST',
        body: textToSend
    });

    return res
  } 

  return(
    <div id ='mainUI' className="mainUI">
    <div id='Title' className="Title">LED Matrix Client</div>
    <div id="rawTextInputDiv" className="textInput">
      <label htmlFor="rawTextInput">Text to show</label>
      <input id="rawTextInput"  className='rawTextinput' onChange={handleTextChange}></input></div>
      <button id="sendButton" onClick={SendData}> Send</button>
    </div>
  )

}

export default App
