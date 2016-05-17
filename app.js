#!/usr/bin/env ./node_modules/.bin/babel-node
'use strict';

import Connection from './lib/connection.js';
import ResponseParser from './lib/response_parser.js';
import convertToBuffer from './lib/convert_to_buffer.js';
import StopWatch from './lib/stopwatch.js';

const parser = new ResponseParser();
const conn = new Connection('127.0.0.1', 6379);
const stopwatch = new StopWatch();

const totalRequests = 1000000;

const command = convertToBuffer('PING');

let counter = 0;
const onData = (d) => {
  // console.log(parser.parse(d))
  counter++;
  if (counter == totalRequests) {
    const duration = stopwatch.stop();
    console.log("====== PING_INLINE ======");
    console.log(`  ${totalRequests} requests completed in ${duration} seconds`);    
    console.log("  1 parallel clients");
    console.log("  3 bytes payload");
    console.log("  keep alive: 1");
    console.log("");
    console.log(`${(totalRequests / duration).toFixed(2)} requests per second`);
    
    process.exit();
  }
    
  conn.send(command);
}

conn.receive(onData);

stopwatch.start();
conn.send(command);

//wait for key
process.stdin.on('data', text => {
  var buffer = new Buffer(text, 'utf-8');
  var lastCharacter = buffer[buffer.length - 1];

  // exit on '\n' or '\r'
  if ([10, 13].includes(lastCharacter)) {
    conn.stop();
    process.exit();
  }
});
