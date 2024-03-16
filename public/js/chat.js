const socket = io();

socket.on("add message", (msg) => {
  addMessage(msg);
});

document
  .querySelector(".send-msg .send")
  .addEventListener("click", async (e) => {
    let text = e.target.closest(".send-msg").querySelector(".msg-text").value;
    let dept1 = e.target.closest("#chat-div").dataset.dept;
    let dept2 = e.target
      .closest(".send-msg")
      .querySelector(".choose-dept").value;

    if (text && dept2) {
      socket.emit("new message", { text, dept1, dept2 });
    }
  });

function addMessage(msg) {
  const Chatbox = document.querySelector("#chat-div .chatbox");
  const dptName = document.querySelector("#chat-div").dataset.dept;
  const isSentByDept = msg.sender === dptName;

  const msgType = isSentByDept ? "sent" : "receipt";
  const senderOrTarget = isSentByDept
    ? `TO: ${msg.recipient}`
    : `FROM: ${msg.sender}`;

  const messageTime = new Date(msg.time);
  const hours = messageTime.getHours();
  const minutes = messageTime.getMinutes();

  const div = `
        <div class="${msgType}-msg">
            <div class="msg-sender">${senderOrTarget}</div>
            <div class="msg-body">
                ${msg.text} --- ${hours}:${minutes} (${new Date(
    msg.time
  ).toDateString()})
            </div>
        </div>
    `;

  Chatbox.insertAdjacentHTML("beforeend", div);
  document.querySelector(".send-msg .msg-text").value = "";
}
