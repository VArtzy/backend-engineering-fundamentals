const http = require("http")
const WebSocketServer = require("websocket").server
const connections = []

const httpServer = http.createServer()

const webSocket = new WebSocketServer({"httpServer": httpServer})

httpServer.listen(8080, () => console.log("My server is running on port 8080"))

webSocket.on("request", request => {
     const connection = request.accept(null, request.origin)
    connection.on("message", message => {
        connections.forEach(c => c.send(`User${connection.socket.remotePort} says: ${message.utf8Data}`))
    })
    connections.push(connection)
    connections.forEach(c => c.send(`User${connection.socket.remotePort} just connected.`))
})

// client code
// const ws = new WebSocket("ws://localhost:8080")
// ws.onmessage = message => console.log(`${message.data}`)
// ws.send("hey")
