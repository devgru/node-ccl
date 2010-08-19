var colors = require('./colors.js');

this.forContext = function (context, color) { return new logger(context, color) };
this.setPadding = function (padding) { logger.padding = padding; };

var logger = function (context, contextColor) {

    logger.padding = Math.max(logger.padding, context.length);

    contextColor = contextColor ? colors.bold[contextColor] : colors.bold.white;

    var log = function (text, textColor) {
        if (typeof(text) == "object") text = JSON.stringify(text);
        doPadding();
        console.log('[' + colorize(context, contextColor) + '] ' + colorize(text, textColor));
    }

    var doPadding = function () {
        while (context.length < logger.padding) {
            if (context.length % 2) context += ' ';
            else context = ' ' + context;
        }
    }

    var colorize = function (text, color) { return color + text + colors.reset; }

    this.info   = function (text) { log(text, colors.white); };
    this.debug  = function (text) { log(text, colors.cyan); }
    this.error  = function (text) { log(text, colors.bold.red); };
    this.call   = null;
}

logger.padding = 0; //tune it if you need
