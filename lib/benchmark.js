import convertToBuffer from './convert_to_buffer.js';
import StopWatch from './stopwatch.js';

class Benchmark {
  constructor(connections, command, requests) {
    this.connections = connections;
    this.command = command;
    this.commandBytes = convertToBuffer(command);
    this.requests = requests;
  }

  run() {
    this.counter = 0;
    this.stopWatch = new StopWatch();
    this.requestsInMilliseconds = [];

    const throughputId = setInterval(() => this.showThroughput(), 250);

    const promises = [];
    for (const conn of this.connections) {
      promises.push(new Promise((resolve, reject) => {
        // TODO: handle connection errors and reject
        conn.receive((data) => {
          // TODO: should we be parsing data here?
          const elapsedHighPrecisionDiff = process.hrtime(conn.lastSendTime);
          if (this.counter == this.requests) {
            this.stopWatch.stop();
            this.calculateResponseTime(elapsedHighPrecisionDiff);            
            resolve();
          } else {
            conn.send(this.commandBytes);
            this.calculateResponseTime(elapsedHighPrecisionDiff);
            this.counter++;  
          }
        });
        conn.send(this.commandBytes);
        this.counter++;
      }));
    }

    return new Promise((resolve, reject) => {
      Promise.all(promises).then(() => { 
        clearInterval(throughputId);
        for (const conn of this.connections)
          conn.disconnect();
        resolve(this);
      }, (reason) => {
        clearInterval(throughputId);
        reject(reason);
      });
    });
  }

  showThroughput() {
    const requestsPerSecond = (this.counter / this.stopWatch.elapsed()).toFixed(2);
    process.stdout.clearLine();
    process.stdout.cursorTo(0); 
    process.stdout.write(`${this.command}: ${requestsPerSecond}`);
  }

  calculateResponseTime(diff) {
    const elapsedMilliseconds = Math.round(((diff[0] * 1e9) + diff[1]) / 1e6);
    this.requestsInMilliseconds.push(elapsedMilliseconds);
  }
}

export default Benchmark;