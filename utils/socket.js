const socketHub = {};

const serverConfig = (IO) => {
  IO.on("connection", (socket) => {
    let uID = "";
    if (socket.request.session.user) {
      uID = socket.request.session.user.id;
      socketHub[uID] = socket.id;
      console.log("connection ", socketHub);
    }

    socket.on("disconnect", () => {
      if (uID) {
        delete socketHub[uID];
      }
      console.log("disconnection ", socketHub);
    });
  });
};

module.exports = {
  serverConfig,
  socketHub,
};
