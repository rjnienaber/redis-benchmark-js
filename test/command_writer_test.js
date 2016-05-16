const assert = require('chai').assert;
const expect = require('chai').expect;
import CommandWriter from '../lib/command_writer.js';

const writer = new CommandWriter();

describe('CommandWriter', () => {
  describe('#write', () => {
    it('only accepts strings or arrays', () => {
      expect(() => writer.write({})).to.throw('Only strings or an array of strings are accepted');
    });

    it('accepts strings', () => {
      const expected = new Buffer('*2\r\n$4\r\nLLEN\r\n$6\r\nmylist\r\n');
      assert.deepEqual(writer.write('LLEN mylist'), expected);
    });

    it('accepts array of strings', () => {
      const expected = new Buffer('*2\r\n$4\r\nLLEN\r\n$6\r\nmylist\r\n');
      assert.deepEqual(writer.write(['LLEN','mylist']), expected);      
    });
  });
});
