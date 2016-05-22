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

    const groupedResponseTimes = this.groupResponseTimes(benchmark);
    let runningTotal = 0;
    for (const requestTimeInMilliseconds of Object.getOwnPropertyNames(groupedResponseTimes)) {
      runningTotal += groupedResponseTimes[requestTimeInMilliseconds]; 
      const percentage = Math.floor((runningTotal / options.requests) * 10000) / 100;
      if (percentage < 90)
        continue;
      console.log(`${percentage.toFixed(2)}% <= ${requestTimeInMilliseconds} milliseconds`);
    }
    console.log(`${(options.requests / stopwatch.duration()).toFixed(2)} requests per second`);
    console.log();    
    console.log();
  }

  groupResponseTimes(benchmark) {
    let responseTimeCount = {};
    for (const responseTime of benchmark.requestsInMilliseconds) {
      if (responseTime === 0)
        responseTimeCount[1] += 1;
      else if (responseTimeCount[responseTime])
        responseTimeCount[responseTime] += 1;
      else
        responseTimeCount[responseTime] = 1;
    }
    return responseTimeCount;
  }
}

export default Printer;