const assert = require('chai').assert;
const expect = require('chai').expect;
import convertToBuffer from '../lib/convert_to_buffer.js';

describe('convertToBuffer', () => {
  it('only accepts strings or arrays', () => {
    expect(() => convertToBuffer({})).to.throw('Only strings or an array of strings are accepted');
  });

  it('accepts strings', () => {
    const expected = new Buffer('*2\r\n$4\r\nLLEN\r\n$6\r\nmylist\r\n');
    assert.deepEqual(convertToBuffer('LLEN mylist'), expected);
  });

  it('accepts array of strings', () => {
    const expected = new Buffer('*2\r\n$4\r\nLLEN\r\n$6\r\nmylist\r\n');
    assert.deepEqual(convertToBuffer(['LLEN','mylist']), expected);      
  });
});
