class StopWatch {
  constructor() {
    this.duration_in_s = 0;
    this.start = new Date();
  }

  duration() {
    return this.duration_in_s;
  }

  elapsed(end) {
    const end_time = (end || new Date());
    return (end_time - this.start) / 1000;
  }

  stop() {
    this.end = new Date();
    this.duration_in_s = this.elapsed(this.end);
    return this.duration_in_s;
  }
}

module.exports = StopWatch;