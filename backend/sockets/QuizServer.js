// server/socket/quizSocket.js
export default function quizSocket(io,rooms) {
  /**
   * rooms = {
   *   roomId: {
   *     users: Map<userId, userData>,
   *     adminId: string | null
   *   }
   * }
   */


  io.on("connection", (socket) => {
    console.log("✅ New socket connected:", socket.id);

    socket.on("START_QUIZ", ({roomId, data}) => {
      console.log("rooms 2 = ",rooms)
        if(!roomId) return;
        

        socket.join(roomId);
        socket.data.roomId = roomId;      
        socket.data.role = "admin";  
        if (!rooms.has(roomId)){
            rooms.set(roomId, {
                 users: new Map(), currQuestion:0, slide:"waiting", active:true, questions:data.room.questions
            });
        }else{
            const room = rooms.get(roomId);
            room.questions = data.room.questions
            room.slide = 'waiting',
            room.active = true,
            room.currQuestion = 0
        }

        io.to(roomId).emit('QUIZ_STARTED', rooms.get(roomId));
        
    })

    // 🔹 Participant joins quiz room
    socket.on("JOIN_ROOM", ({ roomId, user }) => {
      console.log("rooms = ",rooms)
      if (!roomId || !user?.id) return;

      socket.join(roomId);
      socket.data.roomId = roomId;
      socket.data.userId = user.id;
      socket.data.role = "participant";

      if (!rooms.has(roomId)){
        console.log("ethe aya bc")
        rooms.set(roomId, { users: new Map(), adminId: null });
      }
        

      const room = rooms.get(roomId);
      room.users.set(user.id, user);
      console.log("rooms",rooms);

      // 🔁 Notify everyone (admin + participants)
      io.to(roomId).emit("ROOM_UPDATE", room);
      io.to(roomId).emit("PARTICIPANTS_UPDATE", Array.from(room.users.values()));
      console.log(`👥 ${user.name} joined room ${roomId}`);
    });

    // 🔹 Admin joins control room
    socket.on("JOIN_ADMIN", ({ roomId }) => {
      if (!roomId) return;

      socket.join(roomId);
      socket.data.roomId = roomId;
      socket.data.role = "admin";

      if (!rooms.has(roomId))
        rooms.set(roomId, { users: new Map(), adminId: socket.id });
      else rooms.get(roomId).adminId = socket.id;

      const room = rooms.get(roomId);
      room.status = 'active';

      console.log("admin rooms",rooms);
      io.to(roomId).emit("ROOM_UPDATE", room);

      console.log(`🧑‍💼 Admin joined room ${roomId}`);
    });

    socket.on('UPDATE_SLIDE',({currentQuestion, roomId, currentSlide})=>{
      console.log("Ethe vi aya")
      console.log(currentQuestion);
        if(!roomId) return;
        const room = rooms.get(roomId);
        room.currQuestion = currentQuestion
        room.slide = currentSlide
        io.to(roomId).emit('ROOM_UPDATE',room)
    })

    socket.on('ABLE_TO_ANSWER',({roomId})=>{
      if(!roomId) return;
      const room = rooms.get(roomId);
      room.isAbleToAnswer = true;
      io.to(roomId).emit('ROOM_UPDATE',room)
    }
  )

  socket.on('NOT_ABLE_TO_ANSWER', ({roomId})=>{
    if(!roomId) return;
    const room = rooms.get(roomId);
    room.isAbleToAnswer = false;
    io.to(roomId).emit('ROOM_UPDATE',room)
  });

  

 


    // 🔹 Handle disconnects safely
    socket.on("disconnect", () => {
      const { roomId, userId, role } = socket.data;

      console.log(`❌ Socket disconnected: ${socket.id}`);

      if (!roomId || !rooms.has(roomId)) return;
      const room = rooms.get(roomId);

      if (role === "participant" && room?.users?.has(userId)) {
        room.users.delete(userId);
        io.to(roomId).emit("PARTICIPANTS_UPDATE", Array.from(room.users.values()));
        console.log(`⚡ Cleaned up disconnected user ${userId}`);
      }

      if (role === "admin") {
        room.adminId = null;
        console.log(`⚡ Admin disconnected from room ${roomId}`);
      }

      // cleanup empty rooms
      if (room?.users?.size === 0 && !room.adminId) {
        rooms.delete(roomId);
        console.log(`🧹 Room ${roomId} deleted (empty).`);
      }
    });
  });
}
