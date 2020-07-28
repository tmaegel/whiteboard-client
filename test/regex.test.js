'use strict';

import * as regexHelper from '../src/js/regex.js';

const assert = require('assert');

describe('regex.js', function() {
  describe('#empty()', function() {
    it('should return true when value is empty', function() {
      assert.equal(regexHelper.empty(''), true);
    });
    it('should return true when value contains spaces', function() {
      assert.equal(regexHelper.empty(' '), true);
    });
    it('should return true when value contains new lines', function() {
      assert.equal(regexHelper.empty('\n'), true);
    });
    it('should return true when value contains tabs', function() {
      assert.equal(regexHelper.empty('\t'), true);
    });
    it('should return false when value contains other chararcters', function() {
      assert.equal(regexHelper.empty('az123'), false);
    });
    it('should return false when value is undefined', function() {
      assert.equal(regexHelper.empty(), false);
    });
  });
  describe('#simpleRegex()', function() {
    it('should return true when value contains umlaute', function() {
      assert.equal(regexHelper.simpleRegex('ÄÜÖäüö'), true);
    });
    it('should return true when value contains "ß', function() {
      assert.equal(regexHelper.simpleRegex('ß'), true);
    });
    it('should return true when value contains simple chararcters', function() {
      assert.equal(regexHelper.simpleRegex('abc123'), true);
    });
    it('should return true when value contains special chararcters', function() {
      assert.equal(regexHelper.simpleRegex('.,:&\'"\-()/'), true);
    });
    it('should return false when value contains illegally chararcters', function() {
      assert.equal(regexHelper.simpleRegex('@%'), false);
    });
    it('should return false when value is undefined', function() {
      assert.equal(regexHelper.simpleRegex(), false);
    });
  });
  describe('#extendedRegex()', function() {
    it('should return true when value contains umlaute', function() {
      assert.equal(regexHelper.extendedRegex('ÄÜÖäüö'), true);
    });
    it('should return true when value contains "ß', function() {
      assert.equal(regexHelper.extendedRegex('ß'), true);
    });
    it('should return true when value contains simple chararcters', function() {
      assert.equal(regexHelper.extendedRegex('abc123'), true);
    });
    it('should return true when value contains special chararcters', function() {
      assert.equal(regexHelper.extendedRegex('.,:&\'"\-()/@%_-'), true);
    });
    it('should return false when value contains illegally chararcters', function() {
      assert.equal(regexHelper.extendedRegex('$§'), false);
    });
    it('should return false when value is undefined', function() {
      assert.equal(regexHelper.extendedRegex(), false);
    });
  });
  describe('#numRegex()', function() {
    it('should return true when value contains numbers (positive)', function() {
      assert.equal(regexHelper.numRegex('123'), true);
    });
    it('should return false when value contains numbers (negative)', function() {
      assert.equal(regexHelper.numRegex('-123'), false);
    });
    it('should return false when value contains illegally chararcters', function() {
      assert.equal(regexHelper.numRegex('abc'), false);
    });
    it('should return false when value is undefined', function() {
      assert.equal(regexHelper.numRegex(), false);
    });
  });
  describe('#floatRegex()', function() {
    it('should return true when value contains valid floating number (1)', function() {
      assert.equal(regexHelper.floatRegex('123'), true);
    });
    it('should return true when value contains valid floating number (2)', function() {
      assert.equal(regexHelper.floatRegex('123.45'), true);
    });
    it('should return false when value contains valid floating number (1) (negative)', function() {
      assert.equal(regexHelper.floatRegex('-123'), false);
    });
    it('should return false when value contains valid floating number (2) (negative)', function() {
      assert.equal(regexHelper.floatRegex('-123.45'), false);
    });
    it('should return false when value contains invalid floating number (1)', function() {
      assert.equal(regexHelper.floatRegex('.123'), false);
    });
    it('should return false when value contains invalid floating number (2)', function() {
      assert.equal(regexHelper.floatRegex('213.45.7'), false);
    });
    it('should return false when value contains illegally chararcters', function() {
      assert.equal(regexHelper.floatRegex('abc'), false);
    });
    it('should return false when value is undefined', function() {
      assert.equal(regexHelper.floatRegex(), false);
    });
  });
  describe('#datetimeRegex()', function() {
    it('should return true when the value has a valid forma (dd.mm.YYY HH:MM)', function() {
      assert.equal(regexHelper.datetimeRegex('09.05.2019 19:21'), true);
    });
    it('should return true when the value has a valid format (dd.mm.YYY HH:MM:SS)', function() {
      assert.equal(regexHelper.datetimeRegex('09.05.2019 19:21:34'), true);
    });
    it('should return true when the value has a valid format (d.m.YYY HH:MM:SS)', function() {
      assert.equal(regexHelper.datetimeRegex('9.5.2019 19:21:34'), true);
    });
    it('should return true when the value has a invalid format', function() {
      assert.equal(regexHelper.datetimeRegex('9.5.19 19:21:34'), false);
    });
    it('should return false when value is undefined', function() {
      assert.equal(regexHelper.datetimeRegex(), false);
    });
  });
  describe('#timestampRegex()', function() {
    it('should return true when the value has a valid forma (HH:MM)', function() {
      assert.equal(regexHelper.timestampRegex('19:21'), true);
    });
    it('should return true when the value has a valid format (HH:MM:SS)', function() {
      assert.equal(regexHelper.timestampRegex('19:21:34'), true);
    });
    it('should return true when the value has a valid format (H:MM:SS)', function() {
      assert.equal(regexHelper.timestampRegex('6:21:34'), true);
    });
    it('should return true when the value has a invalid format', function() {
      assert.equal(regexHelper.timestampRegex('19:21:'), false);
    });
    it('should return false when value is undefined', function() {
      assert.equal(regexHelper.timestampRegex(), false);
    });
  });
  describe('#stripString()', function() {
    it('should return a string without leading spaces', function() {
      assert.equal(regexHelper.stripString(' string'), 'string');
    });
    it('should return a string without trailing spaces', function() {
      assert.equal(regexHelper.stripString('string '), 'string');
    });
    it('should return a string without leading and trailing spaces', function() {
      assert.equal(regexHelper.stripString('  string  '), 'string');
    });
    it('should return a string without new lines', function() {
      assert.equal(regexHelper.stripString('string\n\r'), 'string');
    });
    it('should return a string without tabs', function() {
      assert.equal(regexHelper.stripString('string\t'), 'string');
    });
    it('should return false when value is undefined', function() {
      assert.equal(regexHelper.stripString(), false);
    });
  });
});
