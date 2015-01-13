'use strict';

// Load modules

var Util = require('util');
var Path = require('path');


// Exports
exports.consoleError = console.error;
exports.shouldThrow = true;
exports.parseNumbers = true;
exports.useSecretVarsFile = false;
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
                    if(exports.parseNumbers && parseFloat(value)){
                        value = parseFloat(value);
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
                    if(exports.parseNumbers && parseFloat(value)){
                        value = parseFloat(value);
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

