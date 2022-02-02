const { WebSocketServer } = require('ws')

const ws = new WebSocketServer({ port: 1106 });

messages = []
connections = []

// When someone make a connection to the server
ws.on('connection', function connection(ws) {
    connections.push(ws)
    ws.send(JSON.stringify(messages))
    console.log(ws._socket.remoteAddress + '  ||  Someone just connected to the ws')

    ws.on('message', function message(data) {
        let message = data.toString()
        if(message.startsWith('!!ping')) return ws.send(message.slice(2)) 
        messages.push(message)
        if(message.includes('!!clear')) messages = []
        connections.forEach(wss => {
            wss.send(JSON.stringify(messages))
        })
    });
});