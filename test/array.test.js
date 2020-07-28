'use strict';

import * as arrayHelper from '../src/js/array.js';

const assert = require('assert');
// var expect = require('expect.js');
const expect = require('chai').expect;
// var deep = require("deep-eql");
// var chai = require("chai");

describe('array.js', function() {
  describe('#compareById()', function() {
    const list = [
      {
        'id': '1',
        'name': 'A',
      },
      {
        'id': '2',
        'name': 'B',
      },
      {
        'id': '3',
        'name': 'C',
      },
    ];
    it('should return a sorted array', function() {
      expect(list.reverse().sort(arrayHelper.compareById)).to.deep.equal(list);
    });
  });
  describe('#compareByTimestamp()', function() {
    const list = [
      {
        'id': '1',
        'datetime': '123',
      },
      {
        'id': '2',
        'datetime': '456',
      },
      {
        'id': '3',
        'datetime': '789',
      },
    ];
    it('should return a sorted array', function() {
      expect(list.reverse().sort(arrayHelper.compareByTimestamp)).to.deep.equal(list);
    });
  });
  describe('#compareByString()', function() {
    const list = [
      {
        'id': '1',
        'name': 'A',
      },
      {
        'id': '2',
        'name': 'B',
      },
      {
        'id': '3',
        'name': 'C',
      },
    ];
    it('should return a sorted array', function() {
      expect(list.reverse().sort(arrayHelper.compareByString)).to.deep.equal(list);
    });
  });
  describe('#getArrayObjectById()', function() {
    const list = [
      {
        'id': '1',
        'name': 'A',
      },
      {
        'id': '2',
        'name': 'B',
      },
    ];
    const obj1 = {
      'id': '1',
      'name': 'A',
    };
    it('should return the resulting object searched by id', function() {
      expect(arrayHelper.getArrayObjectById(list, 1)).to.deep.equal(obj1);
    });
    it('should return the undefined if no object has found', function() {
      assert.equal(arrayHelper.getArrayObjectById(list, 3), undefined);
    });
    it('should return the undefined when given parameters are undefined', function() {
      assert.equal(arrayHelper.getArrayObjectById(), undefined);
    });
  });
  describe('#getArrayIndexById()', function() {
    const list = [
      {
        'id': '4',
        'name': 'A',
      },
      {
        'id': '2',
        'name': 'B',
      },
    ];
    it('should return the index of the object searched by id', function() {
      assert.equal(arrayHelper.getArrayIndexById(list, 4), 0);
    });
    it('should return the undefined if no object has found', function() {
      assert.equal(arrayHelper.getArrayIndexById(list, 3), undefined);
    });
    it('should return the undefined when given parameters are undefined', function() {
      assert.equal(arrayHelper.getArrayIndexById(), undefined);
    });
  });
  describe('#getArrayObjectsByName()', function() {
    const list = [
      {
        'id': '1',
        'name': 'AB',
      },
      {
        'id': '2',
        'name': 'BA',
      },
      {
        'id': '3',
        'name': 'C',
      },
    ];
    const result1 = [
      {
        'id': '1',
        'name': 'AB',
      },
      {
        'id': '2',
        'name': 'BA',
      },
    ];
    const result2 = [];
    it('should return all objects that contains the string', function() {
      expect(arrayHelper.getArrayObjectsByName(list, 'A')).to.deep.equal(result1);
    });
    it('should return no objects', function() {
      expect(arrayHelper.getArrayObjectsByName(list, 'D')).to.deep.equal(result2);
    });
    it('should return the undefined when given parameters are undefined', function() {
      assert.equal(arrayHelper.getArrayObjectsByName(), undefined);
    });
  });
});
