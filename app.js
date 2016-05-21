#!/usr/bin/env ./node_modules/.bin/babel-node
'use strict';

import Benchmark from './lib/benchmark.js';
import Formatter from './lib/formatter.js';
import processOptions from './lib/options.js'

const options = processOptions();
const formatter = new Formatter(options);
const benchmark = new Benchmark(options);

function handleException(reason) {
  console.log(`Exception: ${reason}`);
  process.exit(1);
}

function handleSuccess(stopwatch) {
  formatter.print(stopwatch);
  process.exit(0);  
}

benchmark.run(handleSuccess, handleException);

//wait for key
process.stdin.on('data', buffer => {
  // exit on '\n' or '\r'
  if ([10, 13].includes(buffer[buffer.length - 1])) {
    // conn.disconnect();
    process.exit();
  }
});
