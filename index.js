var colors = require('./colors.js');
var sys = require('sys');

require('./date.format.js');

var Logger = function (context, contextColor) {
    Logger.padding = Math.max(Logger.padding, context.length);

    var contextColorCode = contextColor ? colors.bold[contextColor] : colors.bold.white;

    this.doPadding = function () {
        var ct = context;
        while (ct.length < Logger.padding) {
            ct = ct.length % 2 ? ct + ' ' : ' ' + ct;
        }
        context = ct;
        this.context = ct;
    };

    this.prepareText = function (text) {
        this.doPadding();
        return typeof(text) == "object" ? JSON.stringify(text) : text;
    };

    this.log = function (text, textColor) {
        var last = Logger.lastUsed;
        !!last && !!last.id && !this.equals(last) && sys.puts('');//TODO DIRTY
        this.rawPrint(colorize(this.prepareText(text), textColor));
        Logger.lastUsed = this;
        return this;
    };

    var colorize = function (text, color) { return color + text + colors.reset; };
    this.header = function () {
        return block(context, contextColorCode) +
               block(new Date().format(this.dateFormat), colors[this.timeColor]);
    };
    var block = function (text, color) { return '[' + colorize(text, color) + '] '; };

    this.rawPrint = function (text) {
        console.log(this.header() + text);
    };

    this.info   = function (text) { return this.log(text, colors.white); };
    this.debug  = function (text) { return this.showDebug ? this.log(text, colors.cyan) : this; };
    this.error  = function (text) { return this.log(text, colors.bold.red); };
    this.warn   = function (text) { return this.log(text, colors.yellow); };

    this.buffered = function (id) {
        if (typeof(id) == 'undefined') id = 'buffer';
        var mama = new Logger(context, contextColor);
        mama.id = id;
        mama.oldRawPrint = mama.rawPrint;
        mama.rawPrint = function (text) {
            var last = Logger.lastUsed;
            if (!this.equals(last)) {
                sys.print(this.header() + colorize('|' + id + '|', colors.bold.white) + ' ');
            }
            sys.print(text + ' ');
        };
        return mama;
    };

    this.equals = function (logger) {
        return !!logger && context == logger.context && (!!this.id == !!logger.id) && (!this.id || this.id == logger.id);
    };

    this.dateFormat = "HH:MM:ss dd.mm";
    this.showDebug = false;
    this.appendDateTime = false;
    this.timeColor = 'cyan';
};

Logger.padding = 0;
Logger.lastUsed = null;

exports.forContext = function (context, color) { return new Logger(context, color); };
exports.setPadding = function (padding) { Logger.padding = Math.max(padding, Logger.padding); };
