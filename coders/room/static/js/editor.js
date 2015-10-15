/* global $ */

(function (window, document, $) {
    'use strict';

    var Editor = function Editor() {
        this.init();
    };

    Editor.prototype.init = function () {
        var JavaScriptMode = ace.require("ace/mode/javascript").Mode;

        editor = ace.edit("editor");
        editor.setShowPrintMargin(false);
        editor.setOption('wrap', 'free');
        editor.setTheme("ace/theme/monokai");
        editor.session.setMode(new JavaScriptMode());
    };

    window.Editor = Editor;

})(window, document, $);