#!/usr/bin/env ./node_modules/.bin/babel-node
'use strict';

import Connection from './lib/connection.js';
import ResponseParser from './lib/response_parser.js';
import CommandWriter from './lib/command_writer.js';

let conn = new Connection('127.0.0.1', 6379, new ResponseParser());
conn.start(new CommandWriter().write('GET TEST'));

process.stdin.on('data', text => {
  var buffer = new Buffer(text, 'utf-8');
  var lastCharacter = buffer[buffer.length - 1];

  // exit on '\n' or '\r'
  if ([10, 13].includes(lastCharacter)) {
    conn.stop();
    process.exit();
  }
});
