/* global $ */

(function (window, document, $) {
    'use strict';

    var Editor = function Editor() {
        this.aceEditor;
        this.id = this.guid();
        this.canSend = true;
        this.$comboLanguages = $('#combo-language');

        this.init();
        this.bindEvents();
    };

    Editor.prototype.init = function () {
        var content = $("#editor").attr("data-content")

        this.aceEditor = ace.edit("editor");
        this.aceEditor.$blockScrolling = Infinity
        this.aceEditor.setShowPrintMargin(false);
        this.aceEditor.setOption('wrap', 'free');
        this.aceEditor.setTheme("ace/theme/monokai");
        this.setLanguageHighlight('javascript');
        this.aceEditor.setValue(content);
    };

    Editor.prototype.setLanguageHighlight = function (language) {
        var languageMode = ace.require('ace/mode/' + language).Mode;
        this.aceEditor.session.setMode(new languageMode());
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

        this.$comboLanguages.on('change', function() {
            var language = $(this).val();
            if (language == 'nodejs') language = 'javascript';
            self.setLanguageHighlight(language);
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