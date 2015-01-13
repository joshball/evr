'use strict';

var EVR = require('../lib/evr'),
    env;

EVR.shouldThrow = false;

process.env.NODE_ENV = 'dev';

env = EVR.load([
    'NODE_ENV',
    'DB_SECRET'
]);


console.log('env.NODE_ENV:', env.NODE_ENV);
console.log('env.DB_SECRET:', env.DB_SECRET);
