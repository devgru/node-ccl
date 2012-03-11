var colors = require('./colors.js'),
    util = require('util')

require('./date.format.js')

var Logger = function (context, contextColor) {
    Logger.padding = Math.max(Logger.padding, context.length)

    this.contextColorCode = contextColor ? colors.bold[contextColor] : colors.bold.white

    this.doPadding = function () {
        var ct = context
        while (ct.length < Logger.padding) {
            ct = ct.length % 2 ? ct + ' ' : ' ' + ct
        }
        context = ct
        this.context = ct
    }

    this.prepareText = function (text) {
        this.doPadding()
        if (typeof text != 'string') text = util.inspect(text, false, 0)
        return text
    }

    this.log = function (text, textColor) {
        var last = Logger.lastUsed
        !this.equals(last) && util.puts('') //TODO DIRTY
        this.rawPrint(colorize(this.prepareText(text), textColor))
        Logger.lastUsed = this
        return this
    }

    var colorize = function (text, color) { return color + text + colors.reset }
    this.header = function () {
        return block(context, this.contextColorCode) +
               (this.appendDateTime ? block(new Date().format(this.dateTimeFormat), colors.bold[this.dateTimeColor]) : '')
    }

    var block = function (text, color) { return '[' + colorize(text, color) + '] ' }

    this.rawPrint = function (text) {
        util.puts(this.header() + text)
    }

    var that = this

    this.info    = function (text) { return that.log(text, colors.white) }
    this.debug   = function (text) { return that.showDebug ? that.log(text, colors.cyan) : that }
    this.err     =
    this.error   = function (text) { return that.log(text, colors.bold.red) }
    this.warning =
    this.warn    = function (text) { return that.log(text, colors.bold.yellow) }

    this.subcontext = function (id) {
        var mama = new Logger(context, contextColor)
        mama.rawPrint = function (text) {
            util.print(this.header() + colorize('|' + id + '|', colors.bold.white) + ' ' + text)
        }
        return mama
    }
    this.buffered = function (id) {
        if (typeof(id) == 'undefined') id = 'buffer'
        var mama = new Logger(context, contextColor)
        mama.id = id
        mama.line = function() {
            Logger.lastUsed = {id: ' '}
            return this
        }
        mama.rawPrint = function (text) {
            var last = Logger.lastUsed
            if (!this.equals(last)) {
                util.print(this.header())
            }
            util.print(colorize('|' + id + '|', colors.bold.white) + ' ')
            util.print(text + ' ')
        }
        return mama
    }

    this.equals = function (logger) {
        return !!logger && context == logger.context
    }

}

Logger.prototype = Logger.default = module.exports.default = {
    showDebug: false,
    appendDateTime: false,
    dateTimeFormat: 'HH:MM:ss dd.mm',
    dateTimeColor: 'cyan'
}

Logger.padding = 0
Logger.lastUsed = null

module.exports.colors = colors

module.exports.forContext = function (context, color) { return new Logger(context, color) }
module.exports.setPadding = function (padding) { Logger.padding = Math.max(padding, Logger.padding) }
