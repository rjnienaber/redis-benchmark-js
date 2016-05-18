#!/usr/bin/env ./node_modules/.bin/babel-node
'use strict';

const p = new Promise(() => 42);
import Benchmark from './lib/benchmark.js';

const options = {
  host: '127.0.0.1',
  port: 6379,
  command: 'PING',
  requests: 100000,
  clients: 1
};

const benchmark = new Benchmark(options);
benchmark.run(stopwatch => {
  console.log('====== PING_INLINE ======');
  console.log(`  ${options.requests} requests completed in ${stopwatch.duration()} seconds`);    
  console.log(`  ${options.clients} concurrent clients`);
  console.log('  3 bytes payload');
  console.log('  keep alive: 1');
  console.log('');
  console.log(`${(options.requests / stopwatch.duration()).toFixed(2)} requests per second`);

  process.exit(0);
})

//wait for key
process.stdin.on('data', buffer => {
  // exit on '\n' or '\r'
  if ([10, 13].includes(buffer[buffer.length - 1])) {
    // conn.disconnect();
    process.exit();
  }
});
