const socketHub = {};

module.exports = (IO) => {
  IO.on("connection", (socket) => {
    let uID = socket.request.session.user.id;
    socketHub[uID] = socket.id;
    console.log("connection ", socketHub);

    socket.on("disconnect", () => {
      delete socketHub[uID];
      console.log("disconnection ", socketHub);
    });
  });
};
