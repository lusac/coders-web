/* global $ */
var webSocket;

(function (window, document, $) {
    'use strict';

    var WebSocket = function WebSocket() {
        if (webSocket === undefined){
            this.$footer = $('#footer');
            this.users = parseInt(this.$footer.attr('data-users'), 10);
            this.init();
            this.bindEvents();
        }
    };

    WebSocket.prototype.init = function () {
        this.socket = io.connect('http://' + document.domain + ':' + location.port + '/socket');
    };

    WebSocket.prototype.bindEvents = function () {
        var self = this;

        this.socket.on('connect', function() {
            self.socket.emit('joined', {});
            console.log('open socket');
        });

        this.socket.on('status', function(data) {
            console.log('status: ' + data.msg);
            $('.overlay').hide();

            if (self.users === 0) {
                start_modal();
            }

        });

        this.socket.on('rw', function(data) {
            var currentData = editor.aceEditor.getValue();

            if (typeof(data) == 'object') {
                if (editor.id != data.id && data.type == 'code') {
                    editor.canSend = false;
                    editor.setValue(data.text);
                    editor.canSend = true;
                }
            }
        });

        this.socket.on('user_in', function(data) {
            self.users++;
            self.$footer.find('.watchers-count').text(self.users + ' watcher(s)');
        });

        this.socket.on('user_out', function(data) {
            self.users--;
            self.$footer.find('.watchers-count').text(self.users + ' watcher(s)');
        });

        this.socket.on('run', function(data) {
            console.log('Output: ' + data);
            room.writeOutput(data);
        });

        this.socket.on('language', function(data) {
            console.log('Language: ' + language);
            editor.canSendLanguage = false;
            editor.setLanguageHighlight(language);
            editor.$comboLanguages.val(language);

            setTimeout(function() {
                editor.canSendLanguage = true;
            }, 500);
        });
    };

    window.WebSocket = WebSocket;

})(window, document, $);

webSocket = new WebSocket();