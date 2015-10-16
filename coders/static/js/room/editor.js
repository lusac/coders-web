/* global $ */

(function (window, document, $) {
    'use strict';

    var Editor = function Editor() {
        this.aceEditor;
        this.id = this.guid();
        this.canSend = true;

        this.init();
        this.bindEvents();
    };

    Editor.prototype.init = function () {
        var JavaScriptMode = ace.require("ace/mode/javascript").Mode;
        var content = $("#editor").attr("data-content")

        this.aceEditor = ace.edit("editor");
        this.aceEditor.$blockScrolling = Infinity
        this.aceEditor.setShowPrintMargin(false);
        this.aceEditor.setOption('wrap', 'free');
        this.aceEditor.setTheme("ace/theme/monokai");
        this.aceEditor.session.setMode(new JavaScriptMode());
        this.aceEditor.setValue(content);
    };

    Editor.prototype.bindEvents = function () {
        var self = this;

        this.aceEditor.getSession().on('change', function(e) {
            if (self.canSend) {
                var msg = {
                    'id': self.id,
                    'type': 'code',
                    'text': self.aceEditor.getValue()
                }
                webSocket.socket.emit('broad', msg);
            }
        });
    };

    Editor.prototype.guid = function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                       .toString(16)
                       .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
               s4() + '-' + s4() + s4() + s4();
    }

    window.Editor = Editor;

})(window, document, $);