class StopWatch {
  start() {
    this.start = new Date();
  }

  stop() {
    this.end = new Date();
    return (this.end - this.start) / 1000;
  }
}

export default StopWatch;