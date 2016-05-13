const assert = require('chai').assert;
import ResponseParser from '../lib/response_parser.js';

const parser = new ResponseParser();

describe('ResponseParser', function() {
  describe('#parse', function () {
    it('handles standard string', function () {
      const buffer = new Buffer([36,50,13,10,50,51,13,10]);
      assert.equal(parser.parse(buffer), '23');
    });

    it('handles empty string', function () {
      const buffer = new Buffer([36,48,13,10,13,10]);
      assert.equal(parser.parse(buffer), '');
    });

    it('handles nil string', function () {
      const buffer = new Buffer([36,45,49,3,10]);
      assert.equal(parser.parse(buffer), undefined);
    });

    it('handles integers', function() {
      const buffer = new Buffer([58,49,48,48,48,13,10]);
      assert.equal(parser.parse(buffer), 1000);      
    });    

    it('handles empty array', function() {
      const buffer = new Buffer('*0\r\n', 'ascii');
      assert.equal(parser.parse(buffer).length, 0);      
    });    

    it('handles string array', function() {
      const buffer = new Buffer('*2\r\n$3\r\nfoo\r\n$3\r\nbar\r\n', 'ascii');

      const values = parser.parse(buffer);
      assert.deepEqual(values, ['foo', 'bar']);
    });  

    it('handles multiple empty arrays', function() {
      const buffer = new Buffer('*2\r\n*0\r\n*0\r\n', 'ascii');
      const values = parser.parse(buffer);
      assert.deepEqual(values, [[],[]]);
    });

    it('handles arrays of nil strings');
    it('handles arrays of empty strings');
  });
});