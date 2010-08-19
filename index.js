// colours taken from http://github.com/botanicus/colours.js
var colors = {
    reset: "\x1B[0m",

    grey:    "\x1B[0;30m",
    red:     "\x1B[0;31m",
    green:   "\x1B[0;32m",
    yellow:  "\x1B[0;33m",
    blue:    "\x1B[0;34m",
    magenta: "\x1B[0;35m",
    cyan:    "\x1B[0;36m",
    white:   "\x1B[0;37m",

    bold: {
        grey:    "\x1B[1;30m",
        red:     "\x1B[1;31m",
        green:   "\x1B[1;32m",
        yellow:  "\x1B[1;33m",
        blue:    "\x1B[1;34m",
        magenta: "\x1B[1;35m",
        cyan:    "\x1B[1;36m",
        white:   "\x1B[1;37m"
    }
};

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
