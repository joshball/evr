'use strict';
var expect = require('chai').expect;   // assertion library
var Lab = require('lab');
var lab = exports.lab = Lab.script();

// Module under test
var EVR = require('../lib/evr');


lab.experiment('evr', function () {

    lab.before(function(done){
        process.env.word = 'word';
        process.env.one = 1;
        process.env.oneString = '1';
        process.env.floatString = '1.1';
        done();
    });

    lab.test('reads the array parameter environment variables', function (done) {
        var e = EVR.load(['one','word','oneString','floatString']);
        expect(e.word).to.equal('word');
        expect(e.one).to.equal(1);
        expect(e.oneString).to.equal(1);
        expect(e.floatString).to.equal(1.1);
        done();
    });

});

