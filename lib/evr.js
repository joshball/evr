'use strict';

// Load modules

var Util = require('util');
var Path = require('path');


// Exports
exports.consoleError = console.error;
exports.shouldThrow = true;
exports.parseNumbers = true;
exports.useSecretVarsFile = true;
exports.logUseOfSecretVarsFile = true;
exports.secretVarsOverrideExisting = true;
exports.secretVarsFileName = './secret_vars/env_vars.js';
exports.envVars = {};

function processSecretVars(){
    if(exports.useSecretVarsFile){
        var secretVarsFileNameResolved = Path.resolve(exports.secretVarsFileName);
        try {
            var envVars = require(secretVarsFileNameResolved);
            Object.keys(envVars).forEach(function(envVarName){
                // only set it if it does not already exist or if it does exist, and we override
                if(!process.env[envVarName] || (process.env[envVarName] && exports.secretVarsOverrideExisting)) {
                    if(exports.logUseOfSecretVarsFile){
                        exports.consoleError(Util.format('Setting process.env[%s] from secret file: %s', envVarName, exports.secretVarsFileName));
                    }
                    process.env[envVarName] = envVars[envVarName];
                }
            })
        }
        catch (err) {
            exports.consoleError('Could not read secret_vars');
            exports.consoleError(err);
        }
    }
}

// Take from:https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseFloat
function filterFloat (value) {
    if(/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/
            .test(value))
        return Number(value);
    return NaN;
}

exports.load = function(envVarNames){
    exports.envVars = {};
    processSecretVars();
    if( Array.isArray(envVarNames)){
        envVarNames
            .forEach(function(envVarName){
                var value = process.env[envVarName];
                if(!value){
                    var msg = Util.format('Required Environment Variable: "%s" must be set', envVarName);
                    exports.consoleError(msg);
                    if(exports.shouldThrow){
                        throw new Error(msg);
                    }
                }
                else {
                    if(exports.parseNumbers && filterFloat(value)){
                        value = filterFloat(value);
                    }
                }
                exports.envVars[envVarName] = value;
            });
    }
    else if(envVarNames !== null && typeof envVarNames === 'object'){
        Object
            .keys(envVarNames)
            .forEach(function(envVarName){
                var keyValue = envVarNames[envVarName];
                var defaultValue = (typeof keyValue) === 'object' ? undefined : keyValue;
                var value = process.env[envVarName] || defaultValue;
                if(!value){
                    var msg = Util.format('Required Environment Variable: "%s" must be set', envVarName);
                    exports.consoleError(msg);
                    if(exports.shouldThrow){
                        throw new Error(msg);
                    }
                }
                else {
                    if(exports.parseNumbers && filterFloat(value)){
                        value = filterFloat(value);
                    }
                }
                exports.envVars[envVarName] = value;
            });
    }
    else {
        throw new Error('Invalid parameter: envVarNames is required to be either an object or array')
    }
    return exports.envVars;
};

