var optionator = require("optionator");

function buildOptions() {
  return optionator({
    prepend: 'Usage: app.js [options]',
    append: 'Version 1.0.0',
    options: [{
      option: 'help',
      alias: 'h',
      type: 'Boolean',
      description: 'displays help'
    },{
      option: 'host',
      alias: 'H',
      type: 'String',
      description: 'Server hostname',
      default: '127.0.0.1'
    },{
      option: 'port',
      alias: 'p',
      type: 'Int',
      description: 'Server port',
      default: '6379'
    },{
      option: 'requests',
      alias: 'n',
      type: 'Int',
      description: 'Total number of requests',
      default: '100000'
    },{
      option: 'clients',
      alias: 'c',
      type: 'Int',
      description: 'Number of parallel connections',
      default: '50'
    }, {
      option: 'tests',
      alias: 't',
      type: 'Array',
      description: 'Only run the comma separated list of tests. The test names are the same as the ones produced as output.',
      default: 'PING'
    }]
  });
}

function processOptions() {
  const optionsParser = buildOptions();
  const options = optionsParser.parse(process.argv)
  if (options.help) {
    console.log(optionsParser.generateHelp());
    process.exit(0);
  }
  return options;
}

export default processOptions;

