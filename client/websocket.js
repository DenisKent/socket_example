const socket = io();
const form = document.getElementById("form1");
const input = document.getElementById("input1");
const messageUl = document.getElementById("messages");

const name = window.prompt("Please input your name", "unknown");

const addMessageToBoard = (text) => {
  const message = document.createElement("li");
  message.appendChild(document.createTextNode(text));
  messageUl.appendChild(message);
};

form.onsubmit = (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit("message", { message: input.value, name });
    input.value = "";
    return false;
  }
};

const addSOStoBoard = (text) => {
  const message = document.createElement("li");
  message.appendChild(document.createTextNode(text));
  message.style = "background-color: red; color: white; font-weight: bold;";
  messageUl.appendChild(message);
};

socket.on("SOS", (msg) => {
  addSOStoBoard(msg);
});
socket.on("chat-message", (msg) => {
  addMessageToBoard(msg);
});
