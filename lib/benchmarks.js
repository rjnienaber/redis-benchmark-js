const Benchmark = require('./benchmark.js');
const convertToBuffer = require('./convert_to_buffer.js');
const Connection = require('./connection.js');
const ResponseParser = require('./response_parser.js');

function warmUp(connections, options, timeout_in_s=10) {
  // test each connection with a PING command
  const parser = new ResponseParser();
  const promises = connections.map((conn) => new Promise((resolve, reject) => {
      conn.receive((data) => {
        const result = parser.parse(data);
        if (result == 'PONG')
          resolve();
        else
          reject(`Warmup failed. Received '${result}'`);
      });
      conn.send(convertToBuffer('PING'));
    })
  );

  //wait for all PINGs to succeed
  return new Promise(async (resolve, reject) => {
    setTimeout(() => {
      reject('Warmup failed. Timed out waiting for responses')
    }, timeout_in_s * 1000);


    Promise.all(promises).then(() => resolve()).catch((err) => reject(err));    
  });
}

function createClients(connectionNumber, host, port) {
  return [...Array(connectionNumber)].map(() => new Connection(host, port));
}

class Benchmarks {
  constructor(options) {
    this.options = options;
  }

  async run() {
    const options = this.options;
    const connectionNumber = Math.min(options.clients, options.requests);
    const connections = createClients(connectionNumber, options.host, options.port);

    await warmUp(connections, options);
    const benchmark = new Benchmark(connections, options.tests[0], options.requests);
    return benchmark.run()
  }
}

module.exports = Benchmarks;
