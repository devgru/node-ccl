var colors = require('./colors.js');

var Logger = function (context, contextColor) {
    Logger.padding = Math.max(Logger.padding, context.length);

    var contextColorCode = contextColor ? colors.bold[contextColor] : colors.bold.white;

    var that = this;
    var doPadding = function () {
        while (context.length < Logger.padding) {
            context = context.length % 2 ? context + ' ' : ' ' + context;
        }
    };
    var prepareText = function (text) {
        doPadding();
        return typeof(text) == "object" ? JSON.stringify(text) : text;
    };
    var log = function (text, textColor) {
        that.rawPrint(colorize(prepareText(text), textColor));
        return that;
    };
    var colorize = function (text, color) { return color + text + colors.reset; };

    this.rawPrint = function (text) {
        console.log('[' + colorize(context, contextColorCode) + '] ' + text);
    };

    this.info   = function (text) { return log(text, colors.white);};
    this.debug  = function (text) { return this.showDebug ? log(text, colors.cyan) : this; };
    this.error  = function (text) { return log(text, colors.bold.red); };
    this.warn   = function (text) { return log(text, colors.yellow); };

    this.buffered = function () {
        var chain = new Logger(context, contextColor);
        chain.buffer = '';
        chain.oldRawPrint = chain.rawPrint;
        chain.rawPrint = function (text) { this.buffer += text + ' '; };
        chain.flush = function() {
            chain.oldRawPrint(this.buffer);
            this.buffer = '';
        };

        return chain;
    };

    this.showDebug = Logger.defaultShowDebug;
};

Logger.padding = 0;
Logger.defaultShowDebug = true;

exports.forContext = function (context, color) { return new Logger(context, color); };
exports.setPadding = function (padding) { Logger.padding = Math.max(padding, Logger.padding); };
exports.setDefaultShowDebug = function (show) { Logger.defaultShowDebug = show; };
