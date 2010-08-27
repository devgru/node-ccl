/*
Copyright (c) 2009 Chris Lloyd.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

//taken from http://github.com/chrislloyd/colored.js

var colors = {
    black: 0,
    red: 1,
    green: 2,
    yellow: 3,
    blue: 4,
    magenta: 5,
    cyan: 6,
    white: 7
}


var extras = {
    bold: 1,
    underline: 4,
    reversed: 7
}

var esc = function (str) { return "\x1B[" + str + 'm'; }

this.fg = {};
this.bg = {};
this.reset = esc(0);

this.generate = function (fore, back, extra) {
    return esc(fg[fore] + ';' + bg[back] + ';' + extras[extra]);
}

for (var c in colors) {
    exports[c] = esc(colors[c] + 30);
    exports.fg[c] = exports[c];
    exports.bg[c] = esc(colors[c] + 40);
}

for (var e in extras) {
    exports[e] = [];
    for (var c in colors) {
        exports[e][c] = esc(extras[e] + ';' + this.fg[c]);
    }
}
