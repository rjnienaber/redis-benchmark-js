const assert = require('chai').assert;
import ResponseParser from '../lib/response_parser.js';

const parser = new ResponseParser();

describe('ResponseParser', function() {
  describe('#parse', function () {
    it('handles standard string', function () {
      const buffer = new Buffer('$6\r\nfoobar\r\n');
      assert.equal(parser.parse(buffer), 'foobar');
    });

    it('handles empty string', function () {
      const buffer = new Buffer('$0\r\n\r\n', 'ascii');
      assert.equal(parser.parse(buffer), '');
    });

    it('handles nil string', function () {
      const buffer = new Buffer('$-1\r\n', 'ascii');
      assert.equal(parser.parse(buffer), undefined);
    });

    it('handles integers', function() {
      const buffer = new Buffer(':1000\r\n', 'ascii');
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

    it('handles arrays of nil strings', function() {
      const buffer = new Buffer('*2\r\n$-1\r\n$-1\r\n', 'ascii');
      const values = parser.parse(buffer);
      assert.deepEqual(values, [undefined, undefined]);      
    });
    
    it('handles arrays of empty strings', function() {
      const buffer = new Buffer('*2\r\n$0\r\n$0\r\n', 'ascii');
      assert.deepEqual(parser.parse(buffer), ['', '']);
    });
  });
});