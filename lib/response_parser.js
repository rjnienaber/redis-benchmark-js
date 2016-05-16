//http://redis.io/topics/protocol#resp-integers
function parseInteger(buffer, index) {
  let value, integer = 0;
  while ((value = buffer[index++]) != 13)
    integer = (integer * 10) + (value - 48);

  return [integer, index];
}

//http://redis.io/topics/protocol#resp-bulk-strings
function parseBulkString(buffer, index) {
  switch(buffer[index]) {
    case 45: return [undefined, index + 3]; //'-' = NULL result
    case 48: return ['', index + 2];        //'0' = zero length string
  }

  let length;
  [length, index] = parseInteger(buffer, index);
  const start = index + 1;
  const end = start + length;
  var result = buffer.toString('utf8', start, end);  
  return [result, end + 1];
}

function parseArray(buffer, index) {
  //array of index 0 indicated
  if (buffer[index] == 48) return [[], index + 2];

  let length;
  [length, index] = parseInteger(buffer, index);

  let values = [];
  let value, counter = 0;
  while (counter++ < length) {
    [value, index] = parseValues(buffer, index + 1);
    values.push(value);
  }

  return [values, index];
}

// '*2\r\n$-1\r\n$-1\r\n'
function parseValues(buffer, index) {
  switch(buffer[index]) {
    case 58: // ':'
      return parseInteger(buffer, index + 1);
    case 36: // '$'
      return parseBulkString(buffer, index + 1);
    case 42: // '*'
      return parseArray(buffer, index + 1);
    default: {
      const type = String.fromCharCode(buffer[index]);
      throw `Response symbol ${type} not supported`;
    }
  }
}

class ResponseParser {
  parse(buffer) {
    return parseValues(buffer, 0)[0];    
  }
}

export default ResponseParser;