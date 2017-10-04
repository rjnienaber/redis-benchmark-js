# redis-benchmark-js
redis-benchmark reimplemented in pure javascript as a learning exercise.


### profiling tools

*builtin tool*

```
> npm run profile
> node --prof-process isolate-0x7fbbc3000000-v8.log
```

*flame graph*
```
> git clone https://github.com/brendangregg/FlameGraph
> npm run build
> perf record -g -F 99 node --perf_basic_prof app.js 
> perf script | ../FlameGraph/stackcollapse-perf.pl > out.perf-folded
> ../FlameGraph/flamegraph.pl --color=js out.perf-folded > perf-kernel.svg
```