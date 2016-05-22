class Printer {
  constructor(options) {
    this.options = options;
  }

  print(benchmark) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);

    const stopwatch = benchmark.stopWatch;
    const options = this.options;
    console.log(`====== ${benchmark.command} ======`);
    console.log(`  ${options.requests} requests completed in ${stopwatch.duration()} seconds`);    
    console.log(`  ${options.clients} concurrent clients`);
    console.log('  3 bytes payload');
    console.log('  keep alive: 1');
    console.log('');
    console.log(`${(options.requests / stopwatch.duration()).toFixed(2)} requests per second`);
  }
}

export default Printer;