/* global $ */

(function (window, document, $) {
    'use strict';

    var WebSocket = function WebSocket() {
        this.init();
        this.bindEvents();
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
        });

        this.socket.on('rw', function(data) {
            var currentData = editor.aceEditor.getValue();

            if (typeof(data) == 'object') {
                if (editor.id != data.id && data.type == 'code') {
                    editor.canSend = false;
                    editor.aceEditor.setValue(data.text);
                    editor.canSend = true;
                }
            }
        });
    };

    window.WebSocket = WebSocket;

})(window, document, $);

webSocket = new WebSocket();