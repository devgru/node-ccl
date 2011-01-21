var colors = require('./colors.js');
var sys = require('sys');

var Logger = function (context, contextColor) {
    Logger.padding = Math.max(Logger.padding, context.length);

    this.context = context;

    var contextColorCode = contextColor ? colors.bold[contextColor] : colors.bold.white;

    this.doPadding = function () {
        var ct = this.context;
        while (ct.length < Logger.padding) {
            ct = ct.length % 2 ? ct + ' ' : ' ' + ct;
        }
        this.context = ct;
    };
    this.prepareText = function (text) {
        this.doPadding();
        return typeof(text) == "object" ? JSON.stringify(text) : text;
    };
    this.log = function (text, textColor) {
        if (Logger.lastUsed && Logger.lastUsed != this && Logger.lastUsed.flush) sys.puts('');
        this.rawPrint(colorize(this.prepareText(text), textColor));
        Logger.lastUsed = this;
        return this;
    };
    var colorize = function (text, color) { return color + text + colors.reset; };

    this.rawPrint = function (text) {
        console.log('[' + colorize(this.context, contextColorCode) + '] ' + text);
    };

    this.info   = function (text) { return this.log(text, colors.white);};
    this.debug  = function (text) { return this.showDebug ? this.log(text, colors.cyan) : this; };
    this.error  = function (text) { return this.log(text, colors.bold.red); };
    this.warn   = function (text) { return this.log(text, colors.yellow); };

    this.buffered = function (id) {
        if (typeof(id) == 'undefined') id = 'buffer';
        var mama = new Logger(this.context, contextColor);
        mama.oldRawPrint = mama.rawPrint;
        mama.rawPrint = function (text) {
            if (Logger.lastUsed != this) {
                sys.print('[' + colorize(this.context, contextColorCode) + '] |' + id + '| ');
            }
            sys.print(text + ' ');
        };
        mama.flush = sys.puts;
        return mama;
    };

    this.showDebug = Logger.defaultShowDebug;
};

Logger.padding = 0;
Logger.defaultShowDebug = true;
Logger.lastUsed = null;

exports.forContext = function (context, color) { return new Logger(context, color); };
exports.setPadding = function (padding) { Logger.padding = Math.max(padding, Logger.padding); };
exports.setDefaultShowDebug = function (show) { Logger.defaultShowDebug = show; };
