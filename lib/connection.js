const net = require('net');

class Connection {
  constructor(host, port, parser) {
    this.host = host;
    this.port = port;
    this.socket = new net.Socket();
    this.socket.on('data', (d) => console.log(parser.parse(d)));
  }

  start(command) {
    this.socket.connect(this.port, this.host, () => this.socket.write(`${command}\n`));
  }

  stop() {
    this.socket.destroy();
  }
}

export default Connection;