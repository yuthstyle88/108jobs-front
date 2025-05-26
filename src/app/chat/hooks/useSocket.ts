// // hooks/useSocket.ts
// import { useEffect, useRef } from "react";
// import { io, Socket } from "socket.io-client";

// interface UseSocketProps {
//   token: string;
//   partnerId: string;
//   onMessage: (message: any) => void;
// }

// export const useSocket = ({ token, partnerId, onMessage }: UseSocketProps) => {
//   const socketRef = useRef<Socket | null>(null);

//   useEffect(() => {
//     const socket = io("wss://fastwork.ibrowe.com", {
//       path: `/api/v4/ws`,
//     //   transports: ["websocket"],
//        extraHeaders: {
//         "Authorization": `Bearer ${token}`,
//       },
//       query: {
//         partner_id: partnerId,
//       },
//     });

//     socketRef.current = socket;

//     socket.on("connect", () => {
//       console.log("Socket.IO connected");
//     });

//     socket.on("message", (data) => {
//       console.log("Received message:", data);
//       onMessage(data);
//     });

//     socket.on("disconnect", () => {
//       console.log("Socket.IO disconnected");
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, [token, partnerId, onMessage]);

//   const sendMessage = (data: any) => {
//     socketRef.current?.emit("message", data);
//   };

//   return {
//     sendMessage,
//     socket: socketRef.current,
//   };
// };
