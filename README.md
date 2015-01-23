# evr
Environment variable reader in node

# evr v1.0.2 [![Build Status: Linux](https://travis-ci.org/joshball/evr.svg?branch=master)](https://travis-ci.org/joshball/evr)

> A simple environment variable reader that asserts when missing and scans in secret dirs

## Examples

See the `./examples` directly.

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

