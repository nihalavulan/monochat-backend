import { Server } from "socket.io"
import http from "http"

export function setupSocket(server : http.Server){
    const io = new Server(server , {
        cors : {
            origin : "*"
        }
    })

    io.on("connection" , (socket) => {
        console.log("a user connected")
    })
}
