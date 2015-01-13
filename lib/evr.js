'use strict';

// Load modules

var Util = require('util');


// Exports
exports.shouldThrow = true;
exports.envVars ={};

exports.load = function(envVarNames){
    envVarNames
        .forEach(function(envVarName){
            var value = process.env[envVarName];
            if(!value){
                var msg = Util.format('Required Environment Variable: "%s" must be set', envVarName);
                console.error(msg);
                if(exports.shouldThrow){
                    throw new Error(msg);
                }
            }
            else {
                if(parseFloat(value)){
                    value = parseFloat(value);
                }
            }
            exports.envVars[envVarName] = value;
        });
    return exports.envVars;
};

