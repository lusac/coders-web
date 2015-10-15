/* global $ */

(function (window, document, $) {
    'use strict';

    var Editor = function Editor() {
        this.init();
    };

    Editor.prototype.init = function () {
        var JavaScriptMode = ace.require("ace/mode/javascript").Mode;

        this.editor = ace.edit("editor");
        this.editor.setShowPrintMargin(false);
        this.editor.setOption('wrap', 'free');
        this.editor.setTheme("ace/theme/monokai");
        this.editor.session.setMode(new JavaScriptMode());
    };

    window.Editor = Editor;

})(window, document, $);