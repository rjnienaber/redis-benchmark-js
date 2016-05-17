function encodeCommand(commandArray, encoding) {
  let redisCommand = `*${commandArray.length}\r\n`;
  for (const item of commandArray)
    redisCommand += `$${item.length}\r\n${item}\r\n`;
  return new Buffer(redisCommand, encoding);
}

function ensureArray(command) {
  if (typeof command === 'string' || command instanceof String)
    return command.split(' ').map((s) => s.trim());
  
  if (Array.isArray(command))
    return command;
  
  throw 'Only strings or an array of strings are accepted';
}

function convertToBuffer(command, encoding='utf8') {
  const commandArray = ensureArray(command);
  return encodeCommand(commandArray, encoding);
}

export default convertToBuffer;