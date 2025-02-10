import { Server } from 'socket.io'
import * as sessionManager from  './lib/sessionMannager.js'

export let io

export function setupSocketServer(httpServer) {
  io = new Server(httpServer)

  io.engine.use(sessionManager.middleware)

  io.on('connection', socket => {
    // ante cada conexión de un cliente:

    const sessionId = socket.request.session.id
    // el session ID se usa como una sala (room)
    socket.join(sessionId)

    console.log('Nueva conexión de un cliente con id', socket.id, 'y sesión', sessionId)

    socket.on('chat-message', text => {
      console.log(`Mensaje recibido del cliente id: ${socket.id} text: ${text}`)
      io.emit('chat-message', text)
    })

  })
}