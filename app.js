const express = require("express"),
  app = express(),
  server = require("http").Server(app),
  io = require("socket.io")(server),
  port = 8888;

const index = require("./routes/index");

//user server
app.use(index);

io.on("connection", onConnection);

var connectedSocket = null;
function onConnection(socket) {
  connectedSocket = socket;
}

//Serial port to CMD
const SerialPort = require("serialport");
const Readline = SerialPort.parsers.Readline;
const usbport = new SerialPort("COM1", { baudRate: 4800 });
const parser = usbport.pipe(new Readline());
parser.on("data", function(data) {
  io.emit("data", { data: data });
});

//Server start
server.listen(port, () => console.log("Listening to requests on port" + port));
