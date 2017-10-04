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
    console.log();

    const values = benchmark.requestsInMilliseconds.reduce((acc, v, i) => { 
      if (v !== 0)
        acc.push([i, v])
      return acc
    }, []);

    let runningTotal = 0;
    for (const responseTimes of values) {
      const [ms, count] = responseTimes;
      runningTotal += count; 
      const percentage = Math.floor((runningTotal / options.requests) * 10000) / 100;
      console.log(`${percentage.toFixed(2)}% <= ${ms} milliseconds`);
    }

    console.log(`${(options.requests / stopwatch.duration()).toFixed(2)} requests per second`);
    console.log();    
  }
}

module.exports = Printer;