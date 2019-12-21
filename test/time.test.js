'use strict';

import * as timeHelper from "../src/js/time.js";

var assert = require('assert');
var expect = require('expect.js');

describe('time.js', function() {
    describe('#getTimestamp()', function() {
        it('should return a Unix Time Stamp (pass empty string)', function() {
            expect(timeHelper.getTimestamp()).to.be.a('number');
        });
        it('should return a Unix Time Stamp (pass "December 21, 2019 14:45:30")', function() {
            expect(timeHelper.getTimestamp("December 21, 2019 14:45:30")).to.be.a('number');
        });
        it('should return a Unix Time Stamp (pass "2019-12-21T14:45:30")', function() {
            expect(timeHelper.getTimestamp("2019-12-21T14:45:30")).to.be.a('number');
        });
        it('should return a Unix Time Stamp (pass "21.12.2019 14:45:30")', function() {
            expect(timeHelper.getTimestamp("21.12.2019 14:45:30")).to.be.a('number');
        });
        it('should return a Unix Time Stamp (pass "21.12.2019 14:45")', function() {
            expect(timeHelper.getTimestamp("21.12.2019 14:45")).to.be.a('number');
        });
        it('should return false when passing a invalid timestamp', function() {
            assert.equal(timeHelper.getTimestamp("21-12-2019 14:45:30"), false);
        });
    });
    describe('#getIETFTimestamp()', function() {
        it('should return a timestamp in IETF Syntax', function() {
            assert.equal(timeHelper.getIETFTimestamp("0123456789"), "Thu, 29 Nov 1973 22:33:09");
        });
        it('should return false when the value is not a number', function() {
            assert.equal(timeHelper.getIETFTimestamp("abc"), false);
        });
    });
    describe('#getFormatTimestamp()', function() {
        it('should return a timestamp in IETF Syntax', function() {
            assert.equal(timeHelper.getFormatTimestamp("0123456789"), "Thursday, 29.11.1973 22:33");
        });
        it('should return false when the value is not a number', function() {
            assert.equal(timeHelper.getFormatTimestamp("abc"), false);
        });
    });
    describe('#getShortFormatTimestamp()', function() {
        it('should return a timestamp in IETF Syntax', function() {
            assert.equal(timeHelper.getShortFormatTimestamp("0123456789"), "29.11.1973 22:33");
        });
        it('should return false when the value is not a number', function() {
            assert.equal(timeHelper.getShortFormatTimestamp("abc"), false);
        });
    });
    describe('#timestampToSeconds()', function() {
        it('should return a Unix Time Stamp (pass "1234567890")', function() {
            expect(timeHelper.timestampToSeconds("1234567890")).to.be.a('number');
        });
        it('should return a Unix Time Stamp (pass "14:45")', function() {
            expect(timeHelper.timestampToSeconds("14:45")).to.be.a('number');
        });
        it('should return a Unix Time Stamp (pass "14:45:00")', function() {
            expect(timeHelper.timestampToSeconds("14:45:00")).to.be.a('number');
        });
        it('should return false when the value is not a number', function() {
            assert.equal(timeHelper.timestampToSeconds("abc"), false);
        });
        it('should return false when the value empty', function() {
            assert.equal(timeHelper.timestampToSeconds(), false);
        });
    });
});
