import WebSocket from 'isomorphic-ws';
import config from '../../config.json'
import './main.css';

let username

function App() {

    function setUsername(e){
        if(e.key === 'Enter'){
            username = document.getElementById('clientUsername').value
            if(username.length > 30 || username.length < 2)return
            document.getElementById("PLEASEREMOVETHIS").style.display = "none";
        }
    }

    let ws = new WebSocket(config.ws)
    
    function UpdateScroll() {
        let scroll = document.getElementById("ChatSectionID")
        if(scroll?.scrollHeight){
            scroll.scrollTop = scroll.scrollHeight;
        }
    }

    let connection

    ws.onopen = function open() {
        console.log('Connected to the websocket');
        document.getElementById("OhNoProblem").style.top = '-30px'
        ws.onmessage = function incoming({data}) {
            
            if(data.startsWith('ping')) return document.getElementById('TheRealTimePing').innerHTML = `Ping: ${Date.now() - data.split(' ')[1]}`

            if(!data.startsWith('ping')){
                document.getElementById('TheChatContentSection').textContent = JSON.parse(data).join('\r\n')
                UpdateScroll()
            }
            
        }
        UpdateScroll()
        connection = true
    }

    setInterval(() => {
        if(!connection) return
        ws.send('!!ping ' + Date.now())
    }, 2000)

    ws.onclose = function close() {
        document.getElementById("OhNoProblem").style.top = '0px'
        setTimeout(() => {
            document.getElementById('theBigError').innerHTML = 'Failed to reconnect to the websocket! Try Refreshing the page . . .'
        }, 4000)
        connection = false
    }

    function SendMessage(){
        let data  = document.getElementById('messageSendContent').value
        document.getElementById('messageSendContent').value = ''
        if(!data.length) return
        if(!username) return window.location.reload()
        if(data.length > 600) return
        ws.send(username + ": " + data)
    }

    function SendMessageEnter(e){
        if(e.key === 'Enter'){
            SendMessage()
        }
    }

    window.addEventListener('resize', UpdateScroll());

    return(
        <div className="MainContainer">
            <div className='PingContainer'><a id='TheRealTimePing'>Ping:</a></div>
            <div className='OhNoProblem' id='OhNoProblem'><a className='TheError' id='theBigError'> <img src='https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif' className='TheFuckingGif'/> Websocket Didnt Connect! Trying to reconnect . . .</a></div>
            <div className='Center'>
                <div className='ChatSection' id='ChatSectionID'>
                    <div className='ChatContent' id='TheChatContentSection'>
                        
                    </div>
                </div>
                <div className='TypeSection'>
                    <input id='messageSendContent' className='SendMessageBox' name="textfield" type="text" placeholder="Type Here . . ." onKeyDown={SendMessageEnter}/>
                    <button className='SendBuwuton' onClick={SendMessage}>➤</button>
                </div>
            </div>
            <div className='BlurrBackground' id='PLEASEREMOVETHIS'>
                <div className='logincontainer'>
                    <a className="whatsurusername" >What Is Your Name</a>
                    <input id='clientUsername' className="loginusername" onKeyDown={setUsername}/>
                </div>
            </div>
        </div>
    )

}
export default App;