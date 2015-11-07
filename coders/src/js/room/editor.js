/* global $ */

(function (window, document, $) {
    'use strict';

    var Editor = function Editor() {
        this.init();
    };

    Editor.prototype.init = function () {
        this.$editor = $("#editor");
        this.$comboLanguages = $('#combo-language');
        this.id = this.guid();
        this.canSend = true;
        this.canSendLanguage = true;

        this.aceEditorInit();
        this.bindEvents();
    };

    Editor.prototype.aceEditorInit = function () {
        var content = this.$editor.attr("data-content"),
            language = this.$editor.attr("data-lang");

        this.aceEditor = ace.edit("editor");
        this.aceEditor.$blockScrolling = Infinity
        this.aceEditor.setShowPrintMargin(false);
        this.aceEditor.setOption('wrap', 'free');
        this.aceEditor.setTheme("ace/theme/monokai");
        this.$editor.css('font-size', '13px');
        this.setValue(content);
        this.setLanguageHighlight(language);
    }

    Editor.prototype.setValue = function (val) {
        this.aceEditor.setValue(val, -1);
    };

    Editor.prototype.getLanguage = function () {
        return this.$comboLanguages.val();
    }

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
                    'text': self.aceEditor.getValue()
                }
                webSocket.socket.emit('broad', msg);
            }
        });

        this.$comboLanguages.on('change', function() {
            var language = self.getLanguage();
            self.setLanguageHighlight(language);
            if (self.canSendLanguage) {
                webSocket.socket.emit('language', language);
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