'use strict';

var EVR = require('../lib/evr'),
    env;

env = EVR.load([
    'NODE_ENV',
    'DB_SECRET'
]);

console.log('env.NODE_ENV:', env.NODE_ENV);
console.log('env.DB_SECRET:', env.DB_SECRET);
