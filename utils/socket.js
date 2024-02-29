const socketHub = {};
const Message = require("../models/message");

const serverConfig = (IO) => {
  IO.on("connection", (socket) => {
    let uID = "";
    if (socket.request.session.user) {
      uID = socket.request.session.user.id;
      let department = socket.request.session.user.role;
      socketHub[uID] = socket.id;
      socket.join(department); // join the department room
    }

    socket.on("new message", async ({ text, dept1, dept2 }) => {
      let message = new Message({
        text,
        sender: dept1,
        recipient: dept2,
        time: Date.now(),
      });

      let savedMessage = await message.save();

      IO.to(dept2).to(dept1).emit("add message", savedMessage);
    });

    socket.on("disconnect", () => {
      if (uID) {
        // delete user id from the sockethub
        delete socketHub[uID];
      }
    });
  });
};

module.exports = {
  serverConfig,
  socketHub,
};
