const net = require('net');

class Connection {
  constructor(host, port) {
    this.host = host;
    this.port = port;
    this.socket = new net.Socket();
    this.socket.connect(this.port, this.host);
  }

  receive(onData) {
    this.socket.on('data', onData);
  }

  send(command) {
    this.socket.write(command);
    this.lastSendTime = process.hrtime();
  }

  disconnect() {
    this.socket.destroy();
  }
}

export default Connection;