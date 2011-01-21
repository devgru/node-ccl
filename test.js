var log = require('./index.js');

var basic = log.forContext('BASIC', 'yellow');
basic.info('test');
basic.error('test error');

var chain = basic.buffered();
chain.info('tap1').error('error').warn('waaarn');

basic.info('asd');
chain.error('test');


