'use strict';

// Load modules

var Util = require('util');


// Exports
exports.consoleError = console.error;
exports.shouldThrow = true;
exports.parseNumbers = true;
exports.envVars ={};

exports.load = function(envVarNames){
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
    return exports.envVars;
};

