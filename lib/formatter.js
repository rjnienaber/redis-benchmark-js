class Formatter {
  constructor(options) {
    this.options = options;
  }

  print(stopwatch) {
    const options = this.options;
    console.log('====== PING_INLINE ======');
    console.log(`  ${options.requests} requests completed in ${stopwatch.duration()} seconds`);    
    console.log(`  ${options.clients} concurrent clients`);
    console.log('  3 bytes payload');
    console.log('  keep alive: 1');
    console.log('');
    console.log(`${(options.requests / stopwatch.duration()).toFixed(2)} requests per second`);
  }
}

export default Formatter;