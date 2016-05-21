import convertToBuffer from './convert_to_buffer.js';
import Connection from './connection.js';
import StopWatch from './stopwatch.js';
import ResponseParser from './response_parser.js';

function runBenchmark([connections, options]) {
  const command = convertToBuffer(options.tests);

  let counter = 0;
  const promises = [];
  const stopWatch = new StopWatch();
  for (const conn of connections) {
    promises.push(new Promise((resolve, reject) => {
      // TODO: handle connection errors and reject
      conn.receive((data) => {
        // TODO: should we be parsing data here?
        if (counter == options.requests) {
          stopWatch.stop();
          resolve();
        } else {
          conn.send(command);
          counter++;  
        }
      });
      conn.send(command);
      counter++;
    }));
  }

  return new Promise((resolve, reject) => {
    Promise.all(promises).then(() => { 
      for (const conn of connections)
        conn.disconnect();
      resolve(stopWatch);
    }, (reason) => reject(reason));
  });
}

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
      resolve([connections, options]);
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

class Benchmark {
  constructor(options) {
    this.options = options;
  }

  run(success, error) {
    const options = this.options;
    const connections = createClients(options.clients, options.host, options.port);
    warmUp(connections, options).then(runBenchmark).then(success).catch(error);
  }
}

export default Benchmark;