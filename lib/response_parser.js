//http://redis.io/topics/protocol#resp-simple-strings
function parseSimpleString(buffer, index, encoding) {
  const start = index;
  while (buffer[index++] != 10);
  const result = buffer.toString(encoding, start, index - 2);
  return [result, index - 1];
}

function parseError(buffer, index, encoding) {
  throw parseSimpleString(buffer, index, encoding)[0];
}

//http://redis.io/topics/protocol#resp-integers
function parseInteger(buffer, index) {
  let value, integer = 0;
  while ((value = buffer[index++]) != 13)
    integer = (integer * 10) + (value - 48);

  return [integer, index];
}

//http://redis.io/topics/protocol#resp-bulk-strings
function parseBulkString(buffer, index, encoding) {
  switch(buffer[index]) {
    case 45: return [undefined, index + 3]; //'-' = NULL result
    case 48: return ['', index + 2];        //'0' = zero length string
  }

  let length;
  [length, index] = parseInteger(buffer, index);
  const start = index + 1;
  const end = start + length;
  const result = buffer.toString(encoding, start, end);  
  return [result, end + 1];
}

function parseArray(buffer, index, encoding) {
  switch(buffer[index]) {
    case 45: return [undefined, index + 3]; //'-' = NULL array
    case 48: return [[], index + 2];        //'0' = zero length array
  }

  let length;
  [length, index] = parseInteger(buffer, index);

  let values = [];
  let value, counter = 0;
  while (counter++ < length) {
    [value, index] = parseValues(buffer, index + 1, encoding);
    values.push(value);
  }

  return [values, index];
}

function parseValues(buffer, index, encoding) {
  switch(buffer[index]) {
    case 43: // '+'
      return parseSimpleString(buffer, index + 1, encoding);
    case 45: // '-'
      parseError(buffer, index + 1);
      break;
    case 58: // ':'
      return parseInteger(buffer, index + 1);
    case 36: // '$'
      return parseBulkString(buffer, index + 1, encoding);
    case 42: // '*'
      return parseArray(buffer, index + 1, encoding);
    default: {
      const type = String.fromCharCode(buffer[index]);
      throw `Response symbol '${type}' not supported`;
    }
  }
}

class ResponseParser {
  constructor(encoding='utf8') {
    this.encoding = encoding;
  }

  parse(buffer) {
    return parseValues(buffer, 0, this.encoding)[0];    
  }
}

module.exports = ResponseParser;