var log = require('./index.js');

var basic = log.forContext('BASIC', 'yellow');
basic.info('test');
basic.error('test error');

var chain = basic.buffered();
chain.info('tap1').error('error').warn('waaarn');

var another = log.forContext('2', 'red');
another.info('test1');

basic.info('after buffer');
another.info('test2');
chain.error('test error');

basic.debug('won\'t be shown');
basic.showDebug = true;
basic.debug('this must be the only debug line');
