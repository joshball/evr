'use strict';

// Load modules

var Util = require('util');


// Exports
exports.consoleError = console.error;
exports.shouldThrow = true;
exports.parseNumbers = true;
exports.envVars = {};

exports.load = function(envVarNames){
    exports.envVars = {};
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

