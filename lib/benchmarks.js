import Benchmark from './benchmark.js';
import convertToBuffer from './convert_to_buffer.js';
import Connection from './connection.js';
import ResponseParser from './response_parser.js';

function warmUp(connections, options, timeout_in_s=10) {
  // test each connection with a PING command
  const parser = new ResponseParser();
  const promises = [];
  for (const conn of connections) {
    promises.push(new Promise((resolve, reject) => {
      conn.receive((data) => {
        const result = parser.parse(data);
        if (result == 'PONG')
          resolve();
        else
          reject(`Warmup failed. Received '${result}'`);
      });
      conn.send(convertToBuffer('PING'));
    }));
  }

  //wait for all PINGs to succeed
  let finished = false;
  return new Promise((resolve, reject) => {
    Promise.all(promises).then(() => { 
      finished = true;
      resolve(connections);
    }, (reason) => reject(reason));

    //timeout waiting for PINGs
    let counter = 0;
    (function wait() {
      if (!finished) {
        if (++counter != timeout_in_s)
          setTimeout(wait, 1000);
        else
          reject('Warmup failed. Timed out waiting for responses');
      }
    })();    
  });
}

function createClients(clients, host, port) {
  let connections = [];
  for (let i = 0; i < clients; i++)
    connections.push(new Connection(host, port));

  return connections;
}

class Benchmarks {
  constructor(options) {
    this.options = options;
  }

  run(success, error) {
    const options = this.options;
    const connections = createClients(options.clients, options.host, options.port);
    
    warmUp(connections, options).then((connections) => {
      const benchmark = new Benchmark(connections, options.tests[0], options.requests);
      return benchmark.run();
    }).then(success).catch(error);
  }
}

export default Benchmarks;