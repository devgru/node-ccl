# node-ccl

Colored, context-enabled logger.

It is in beta version.

The way I use it:

    //initial global settings
    var logger = require('node-ccl');
    logger.setDefaultShowDebug(true);
    logger.setPadding(8);
    
    //using it
    var log = require('node-ccl').forContext('RUNNER', 'yellow');
    
    //and then
    log.info('blah-blah');
    log.debug(someJsonObject); //it will use JSON.stringify automaticly
    log.warn('some bad warning');

