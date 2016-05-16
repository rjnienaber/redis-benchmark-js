const assert = require('chai').assert;
const expect = require('chai').expect;
import ResponseParser from '../lib/response_parser.js';

const parser = new ResponseParser();

describe('ResponseParser', function() {
  describe('#parse', function () {
    it('handles a simple string', function() {
      const buffer = new Buffer('+OK\r\n', 'ascii');
      assert.equal(parser.parse(buffer), 'OK');      
    })

    it('handles errors', function() {
      const buffer = new Buffer('-Error message\r\n', 'ascii');
      expect(function() { return parser.parse(buffer); }).to.throw('Error message');
    })

    it('handles bulk string', function () {
      const buffer = new Buffer('$6\r\nfoobar\r\n', 'ascii');
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

    it('handles arrays of integers', function() {
      const buffer = new Buffer('*3\r\n:1\r\n:2\r\n:3\r\n', 'ascii');
      assert.deepEqual(parser.parse(buffer), [1, 2, 3]);
    })

    it('handles mixed types', function() {
      const buffer = new Buffer('*5\r\n:1\r\n:2\r\n:3\r\n:4\r\n$6\r\nfoobar\r\n', 'ascii');
      assert.deepEqual(parser.parse(buffer), [1, 2, 3, 4, 'foobar']);
    })

    it('handles nested arrays', function() {
      const buffer = new Buffer('*2\r\n*3\r\n:1\r\n:2\r\n:3\r\n*1\r\n+Foo\r\n', 'ascii');
      assert.deepEqual(parser.parse(buffer), [[1, 2, 3], ['Foo']]);
    })

    it('handles nested arrays with error', function() {
      const buffer = new Buffer('*2\r\n*3\r\n:1\r\n:2\r\n:3\r\n*2\r\n+Foo\r\n-Bar\r\n', 'ascii');
      expect(function() { return parser.parse(buffer); }).to.throw('Bar');
    })

    it('handles null arrays', function() {
      const buffer = new Buffer('*-1\r\n', 'ascii');
      assert.equal(parser.parse(buffer), undefined);
    })

    it('handles nulls in arrays', function() {
      const buffer = new Buffer('*3\r\n$3\r\nfoo\r\n$-1\r\n$3\r\nbar\r\n', 'ascii');
      assert.deepEqual(parser.parse(buffer), ['foo', undefined, 'bar']);      
    })
  });
});

