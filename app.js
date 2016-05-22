#!/usr/bin/env ./node_modules/.bin/babel-node
'use strict';

import Benchmarks from './lib/benchmarks.js';
import Printer from './lib/printer.js';
import processOptions from './lib/options.js';

const options = processOptions();
const printer = new Printer(options);
const benchmark = new Benchmarks(options);

function handleException(reason) {
  console.log(`Exception: ${reason}`);
  process.exit(1);
}

function handleSuccess(stopwatch) {
  printer.print(stopwatch);
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
