var colors = require('./colors.js');

exports.forContext = function (context, color) { return new Logger(context, color) };
exports.setPadding = function (padding) { Logger.padding = padding; };

var Logger = function (context, contextColor) {

    Logger.padding = Math.max(Logger.padding, context.length);

    contextColor = contextColor ? colors.bold[contextColor] : colors.bold.white;

    var log = function (text, textColor) {
        if (typeof(text) == "object") text = JSON.stringify(text);
        doPadding();
        console.log('[' + colorize(context, contextColor) + '] ' + colorize(text, textColor));
    };

    var doPadding = function () {
        while (context.length < Logger.padding) {
            if (context.length % 2) context += ' ';
            else context = ' ' + context;
        }
    };

    var colorize = function (text, color) { return color + text + colors.reset; };

    this.info   = function (text) { log(text, colors.white); };
    this.debug  = function (text) { if (this.showDebug) log(text, colors.cyan); };
    this.error  = function (text) { log(text, colors.bold.red); };
    this.call   = null;

    this.showDebug = true;
}

Logger.padding = 0; //tune it if you need
