const Benchmarks = require('./lib/benchmarks.js');
const Printer = require('./lib/printer.js');
const processOptions = require('./lib/options.js');

const options = processOptions();
const printer = new Printer(options);
const benchmarks = new Benchmarks(options);

//wait for key
process.stdin.on('data', buffer => {
  // exit on '\n' or '\r'
  if ([10, 13].includes(buffer[buffer.length - 1])) {
    // conn.disconnect();
    process.exit();
  }
});

async function main() {
  try {
    const benchmark = await benchmarks.run();
    printer.print(benchmark);
    process.exit(0)
  } catch (err) {
    console.log(`Exception: ${err.stack}`);  
    process.exit(1)
  }
}

main();


