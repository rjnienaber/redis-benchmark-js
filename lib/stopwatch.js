class StopWatch {
  constructor() {
    this.duration_in_s = 0;
    this.start = new Date();
  }

  duration() {
    return this.duration_in_s;
  }

  stop() {
    this.end = new Date();
    this.duration_in_s = (this.end - this.start) / 1000;
    return this.duration_in_s;
  }
}

export default StopWatch;