/* global $ */
var webSocket;

(function (window, document, $) {
    'use strict';

    var WebSocket = function WebSocket() {
        if (webSocket === undefined){
            this.users = 0;
            this.$footer = $('#footer');
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
            start_modal();

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

        this.socket.on('user_in', function(data){
            self.users++;
            self.$footer.attr('data-users', self.users);
        });

        this.socket.on('user_out', function(data){
            self.users--;
            self.$footer.attr('data-users', self.users);
        });
    };

    window.WebSocket = WebSocket;

})(window, document, $);

webSocket = new WebSocket();