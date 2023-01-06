import http from "http";
import { Server, Socket } from "socket.io";

const db = require("./database/index");
const chat_log = db.chat_log;

type Socket2 = Socket & { name?: string };

function socket(server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket: Socket2) => {
    socket.on("newUser", (data) => {
      console.log(data + "님이 입장하였습니다.");
      socket.name = data;
      io.emit("update", {
        type: "connect",
        name: "알림",
        message: data + "님이 입장하였습니다.",
      });
    });
    // ip 정보 관련
    //const ip = socket.conn.remoteAddress;
    //console.log("새로운 클라이언트 접속!", ip, socket.id);
    // socket.id 는 소켓 연결된 고유한 클라이언트 식별자라고 보면된다. 채팅방의 입장한 고유한 사람

    // 메시지 왔을때 메시지를 보낸 클라이언트를 제외한 모든 클라이언트에게 전송
    socket.on("message", (data) => {
      data.name = socket.name;
      console.log(data);
      socket.broadcast.emit("update", data);
      chat_log.create({
        name: data.name,
        content: data.message,
      });
    });

    //* 연결 종료 시
    socket.on("disconnect", () => {
      console.log(socket.name + "님이 퇴장하였습니다.");
      socket.broadcast.emit("update", {
        type: "connect",
        name: "알림",
        message: socket.name + "님이 퇴장하였습니다.",
      });
      //console.log("클라이언트 접속 해제", ip, socket.id);
    });

    //* 에러 시
    socket.on("error", (error) => {
      console.error(error);
    });
  });
}

export default socket;
