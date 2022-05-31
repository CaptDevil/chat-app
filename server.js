const express = require('express')
const app = express()
const http = require('http')
const { Server } = require('socket.io')
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
})

io.on('connection', (socket) => {
    console.log(socket.id)
    socket.on('join_room', ({room,username}) => {
        socket.join(room)
        io.to(room).emit('receive_message', {author: '', body: `${username} joined room`})
        console.log(`User '${username}' joined room: ${room}`)
    })

    socket.on('send_message', ({room, author, body}) => {
        socket.to(room).emit('receive_message', {author, body})
    })

    socket.on('leave_room', ({room,username}) => {
        socket.leave(room)
        io.to(room).emit('user_left', {author: '', body: `${username} left room`})
        console.log(`User '${username}' left room: ${room}`)
    })
})

if(process.env.NODE_ENV === 'production') {
    app.use(express.static('../client/build'))
    app.get('*', (req,res) => {
        res.sendFile('./client/build/index.html')
    })
}

let port = process.env.PORT || 5000;

server.listen(port, () => console.log(`Server opened on port ${port}...`))