'use strict';

var EVR = require('../lib/evr'),
    env;

process.env.NODE_ENV = 'dev';
process.env.PORT = 1023;
process.env.DB_SECRET = 'some secret';

env = EVR.load([
    'NODE_ENV',
    'PORT',
    'DB_SECRET'
]);

console.log('env.NODE_ENV:', env.NODE_ENV);
console.log('env.PORT:', env.PORT);
console.log('env.DB_SECRET:', env.DB_SECRET);
