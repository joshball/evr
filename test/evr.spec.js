'use strict';
var Chai = require('chai');
var Sinon = require('sinon');
var SinonChai = require("sinon-chai");
Chai.use(SinonChai);

var expect = Chai.expect;

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

    function expectParsedEnvVars(e){
        expect(e.word).to.equal('word');
        expect(e.one).to.equal(1);
        expect(e.oneString).to.equal(1);
        expect(e.floatString).to.equal(1.1);
    }

    function expectUnParsedEnvVars(e){
        expect(e.word).to.equal('word');
        expect(e.one).to.equal('1');
        expect(e.oneString).to.equal('1');
        expect(e.floatString).to.equal('1.1');
    }

    var sandbox;

    lab.beforeEach(function(done){
        // Don't log to the console for the test
        sandbox = Sinon.sandbox.create();
        EVR.consoleError = sandbox.stub();
        //EVR.consoleError = console.error;
        EVR.shouldThrow = true;
        EVR.parseNumbers = true;
        done();
    });

    lab.afterEach(function(done){
        sandbox.restore();
        done();
    });

    lab.test('reads the array parameter environment variables', function (done) {

        expect(EVR.shouldThrow).to.be.true;
        expect(EVR.parseNumbers).to.be.true;

        var e = EVR.load(['one','word','oneString','floatString']);
        expectParsedEnvVars(e);
        done();
    });


    lab.test('reads the array parameter environment variables, but does not parse numbers', function (done) {

        expect(EVR.shouldThrow).to.be.true;
        EVR.parseNumbers = false;

        var e = EVR.load(['one','word','oneString','floatString']);
        expectUnParsedEnvVars(e);
        done();
    });

    lab.test('Should throw if missing variable if shouldThrow is false', function (done) {
        expect(EVR.shouldThrow).to.be.true;
        expect(EVR.parseNumbers).to.be.true;

        expect(function(){
            EVR.load(['one','word','oneString','floatString', 'missingEnv']);
        }).to.throw(Error, 'Required Environment Variable: "missingEnv" must be set');
        done();
    });

    lab.test('Should not throw if missing variable if shouldThrow=false', function (done) {

        EVR.shouldThrow = false;
        expect(EVR.parseNumbers).to.be.true;

        var e = EVR.load(['somethingsfish', 'one','word','oneString','floatString', 'missingEnv']);
        expectParsedEnvVars(e);

        expect(e.missingEnv).to.be.undefined;
        expect(EVR.consoleError).to.be.calledTwice;
        expect(EVR.consoleError).to.be.calledWith('Required Environment Variable: "somethingsfish" must be set');
        expect(EVR.consoleError).to.be.calledWith('Required Environment Variable: "missingEnv" must be set');

        done();
    });



});

