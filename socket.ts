import http from "http";
import { Server } from "socket.io";
import { clearInterval } from "timers";

function Socket(server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    //* ip 정보 얻기
    const ip = socket.conn.remoteAddress;
    console.log(ip);
    console.log("새로운 클라이언트 접속!", ip, socket.id);
    // socket.id 는 소켓 연결된 고유한 클라이언트 식별자라고 보면된다. 채팅방의 입장한 고유한 사람

    //* 연결 종료 시
    socket.on("disconnect", () => {
      console.log("클라이언트 접속 해제", ip, socket.id);
      //clearInterval(interval);
    });

    //* 에러 시
    socket.on("error", (error) => {
      console.error(error);
    });

    //* 클라이언트로부터 메시지
    socket.on("reply", (data) => {
      console.log(data);
      socket.emit("news", "server -> client");
      console.log("server -> client");
    });
    //* 클라이언트로 메세지 보내기
    /*const interval = setInterval(() => {
      // 3초마다 클라이언트로 메시지 전송
      console.log("3초마다 전송");
      socket.emit("news", "server -> client");
    }, 3000);
    */
  });
}

export default Socket;
