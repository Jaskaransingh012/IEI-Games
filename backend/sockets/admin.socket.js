const adminSockets = (io, socket) => {
    socket.on('connect-to-room', async({roomId, password, role}) => {
        const data = await fetchRoom(roomId);
    })
}

export default adminSockets;