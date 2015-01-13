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


lab.experiment('evr spec', function () {

    lab.before(function (done) {
        done();
    });

    function expectParsedEnvVars(e) {
        expect(e.word).to.equal('word');
        expect(e.one).to.equal(1);
        expect(e.oneString).to.equal(1);
        expect(e.floatString).to.equal(1.1);
    }

    function expectUnParsedEnvVars(e) {
        expect(e.word).to.equal('word');
        expect(e.one).to.equal('1');
        expect(e.oneString).to.equal('1');
        expect(e.floatString).to.equal('1.1');
    }

    var sandbox;

    lab.beforeEach(function (done) {
        // Don't log to the console for the test
        sandbox = Sinon.sandbox.create();
        EVR.consoleError = sandbox.stub();
        //EVR.consoleError = console.error;
        EVR.shouldThrow = true;
        EVR.parseNumbers = true;
        EVR.secretVarsOverrideExisting = true;
        EVR.useSecretVarsFile = false;
        EVR.secretVarsFileName = './secret_vars/env_vars.js';
        EVR.envVars = {};

        process.env.word = 'word';
        process.env.one = 1;
        process.env.oneString = '1';
        process.env.floatString = '1.1';

        process.env.undefinedNum = undefined;
        delete process.env.undefinedNum;

        process.env.undefinedVariableWithDefault = undefined;
        delete process.env.undefinedVariableWithDefault;

        process.env.somethingsfish = undefined;
        delete process.env.somethingsfish;

        process.env.missingEnv = undefined;
        delete process.env.missingEnv;

        process.env.secretVarEnvVar = undefined;
        delete process.env.secretVarEnvVar;

        done();
    });

    lab.afterEach(function (done) {
        sandbox.restore();
        done();
    });

    lab.experiment('load parameters', function () {

        lab.test('Should throw if missing parameter', function (done) {
            expect(EVR.shouldThrow).to.be.true;
            expect(EVR.parseNumbers).to.be.true;
            expect(EVR.useSecretVarsFile).to.be.false;
            expect(EVR.secretVarsOverrideExisting).to.be.true;

            expect(function () {
                EVR.load();
            }).to.throw(Error, 'Invalid parameter: envVarNames is required to be either an object or array');
            done();
        });

        lab.test('reads the array parameter environment variables', function (done) {

            expect(EVR.shouldThrow).to.be.true;
            expect(EVR.parseNumbers).to.be.true;
            expect(EVR.useSecretVarsFile).to.be.false;
            expect(EVR.secretVarsOverrideExisting).to.be.true;

            var e = EVR.load(['one', 'word', 'oneString', 'floatString']);
            expectParsedEnvVars(e);
            done();
        });

        lab.test('should read an object parameter environment variables', function (done) {

            expect(EVR.shouldThrow).to.be.true;
            expect(EVR.parseNumbers).to.be.true;
            expect(EVR.useSecretVarsFile).to.be.false;
            expect(EVR.secretVarsOverrideExisting).to.be.true;

            var e = EVR.load({
                one: undefined,
                word: undefined,
                oneString: undefined,
                floatString: undefined
            });
            expectParsedEnvVars(e);
            done();
        });
    });


    lab.test('should read an object parameter', function (done) {

        expect(EVR.shouldThrow).to.be.true;
        expect(EVR.parseNumbers).to.be.true;
        expect(EVR.useSecretVarsFile).to.be.false;
        expect(EVR.secretVarsOverrideExisting).to.be.true;

        var e = EVR.load({
            one: 1,
            word: 'word',
            oneString: undefined,
            floatString: '1.1',
            undefinedNum: 3,
            undefinedVariableWithDefault: 'stringValue'
        });

        expectParsedEnvVars(e);

        expect(e.undefinedVariableWithDefault).to.be.equal('stringValue');
        expect(e.undefinedNum).to.be.equal(3);

        done();
    });


    lab.test('Should throw if missing variable if shouldThrow is false', function (done) {
        expect(EVR.shouldThrow).to.be.true;
        expect(EVR.parseNumbers).to.be.true;
        expect(EVR.useSecretVarsFile).to.be.false;
        expect(EVR.secretVarsOverrideExisting).to.be.true;

        expect(function () {
            EVR.load(['one', 'word', 'oneString', 'floatString', 'missingEnv']);
        }).to.throw(Error, 'Required Environment Variable: "missingEnv" must be set');
        done();
    });

    lab.experiment('configuration overrides', function () {

        lab.test('override parseNumbers (setting to false) reads the array parameter environment variables, but does not parse numbers', function (done) {

            expect(EVR.shouldThrow).to.be.true;
            EVR.parseNumbers = false;
            expect(EVR.useSecretVarsFile).to.be.false;
            expect(EVR.secretVarsOverrideExisting).to.be.true;

            var e = EVR.load(['one', 'word', 'oneString', 'floatString']);
            expectUnParsedEnvVars(e);
            done();
        });

        lab.test('override shouldThrow (setting to false) Should not throw if missing variable if shouldThrow=false', function (done) {

            EVR.shouldThrow = false;
            expect(EVR.parseNumbers).to.be.true;
            expect(EVR.useSecretVarsFile).to.be.false;
            expect(EVR.secretVarsOverrideExisting).to.be.true;

            var e = EVR.load(['somethingsfish', 'one', 'word', 'oneString', 'floatString', 'missingEnv']);
            expectParsedEnvVars(e);

            expect(e.missingEnv).to.be.undefined;
            expect(EVR.consoleError).to.be.calledTwice;
            expect(EVR.consoleError).to.be.calledWith('Required Environment Variable: "somethingsfish" must be set');
            expect(EVR.consoleError).to.be.calledWith('Required Environment Variable: "missingEnv" must be set');

            done();
        });

        lab.experiment('secret_vars', function () {

            lab.test('adding a secretVars directory should look in there before checking the environment', function (done) {
                EVR.useSecretVarsFile = true;
                expect(EVR.shouldThrow).to.be.true;
                expect(EVR.parseNumbers).to.be.true;


                var e = EVR.load(['secretVarEnvVar', 'one', 'word', 'oneString', 'floatString']);
                expect(e.one).to.equal(1);
                expect(e.oneString).to.equal(1);
                expect(e.floatString).to.equal(1.1);
                // Note the override of word:
                expect(e.word).to.equal('secret word');
                // and the new env:
                expect(e.secretVarEnvVar).to.be.eql('super secret');

                expect(EVR.consoleError).to.be.calledTwice;
                expect(EVR.consoleError).to.be.calledWith('Setting process.env[word] from secret file: ./secret_vars/env_vars.js');
                expect(EVR.consoleError).to.be.calledWith('Setting process.env[secretVarEnvVar] from secret file: ./secret_vars/env_vars.js');

                done();
            });

            lab.test('adding an alternative secretVars directory should look in there before checking the environment', function (done) {
                EVR.useSecretVarsFile = true;
                EVR.secretVarsFileName = './test/alt.secret.vars/alt.env.vars.js';
                expect(EVR.shouldThrow).to.be.true;
                expect(EVR.parseNumbers).to.be.true;

                var e = EVR.load(['secretVarEnvVar', 'one', 'word', 'oneString', 'floatString']);
                expect(e.one).to.equal(1);
                expect(e.oneString).to.equal(1);
                expect(e.floatString).to.equal(1.1);
                // Note the override of word:
                expect(e.word).to.equal('alt secret word');
                // and the new env:
                expect(e.secretVarEnvVar).to.be.eql('super squirrel secret');
                expect(EVR.consoleError).to.be.calledTwice;
                expect(EVR.consoleError).to.be.calledWith('Setting process.env[word] from secret file: ./test/alt.secret.vars/alt.env.vars.js');
                expect(EVR.consoleError).to.be.calledWith('Setting process.env[secretVarEnvVar] from secret file: ./test/alt.secret.vars/alt.env.vars.js');
                done();
            });

            lab.test('when secretVarsOverrideExisting = false, secretVars should not override existing', function (done) {
                EVR.useSecretVarsFile = true;
                EVR.secretVarsOverrideExisting = false;
                expect(EVR.shouldThrow).to.be.true;
                expect(EVR.parseNumbers).to.be.true;

                var e = EVR.load(['secretVarEnvVar', 'one', 'word', 'oneString', 'floatString']);
                expect(e.one).to.equal(1);
                expect(e.oneString).to.equal(1);
                expect(e.floatString).to.equal(1.1);
                // Note the override of word:
                expect(e.word).to.equal('word');
                // and the new env:
                expect(e.secretVarEnvVar).to.be.eql('super secret');
                expect(EVR.consoleError).to.be.calledOnce;
                expect(EVR.consoleError).to.be.calledWith('Setting process.env[secretVarEnvVar] from secret file: ./secret_vars/env_vars.js');
                done();
            });
        });

    });


});

