const socketHub = {};

module.exports = (IO) => {
  IO.on("connection", (socket) => {
    let uID = "";

    if (socket.request.session.user) {
      uID = socket.request.session.user.id;
      if (socketHub[uID]) {
        socket.disconnect(true);
      } else {
        socketHub[uID] = socket.id;
      }
    }

    socket.on("disconnect", () => {
      console.log(`${socketHub[uID]} just disconnected`);
      delete socketHub[uID];
    });
  });
};
