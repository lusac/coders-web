/* global $ */

(function (window, document, $) {
    'use strict';

    var Room = function Room() {
        this.init();
    };

    Room.prototype.init = function () {
        this.$section = $('.room__section');
        this.$editor = $('#editor-container');
        this.$output = $('.room__output-text');
        this.$divisor = $('#divisor');
        this.$run = $('.run-btn');
        this.$runElements = $('.room__header-buttons').children();
        this.documentWidth = $(document).width();

        this.splitterInit();
        this.bindEvents();
    };

    Room.prototype.splitterInit = function () {
        this.$section.split({
            orientation: 'vertical',
            position: '50%'
        });
    };

    Room.prototype.bindEvents = function () {
        var self = this;

        this.$run.on('click', function() {
            self.runCode();
        });
    };

    Room.prototype.runCode = function () {
        var code = editor.aceEditor.getValue(),
            language = editor.getLanguage();

        this.$runElements.toggleClass('active');
        webSocket.socket.emit('begin_run');

        if (language !== 'javascript') {
            var url = 'http://' + document.domain + ':' + location.port + '/room/run',
                data = {'code': code, 'runner': language};

            console.log('Sending: ' + data.runner);

            editor.aceEditor.setReadOnly(true);

            $.post(url, data, function(data) {
                console.log('Run - success');
                webSocket.socket.emit('end_run', data);
            })
            .fail(function() {
                console.log('Run - Error');
            });
        }
        else {
            console.log('Compiling: ' + language);

            try {
                webSocket.socket.emit('end_run', eval(code));
                this.$runElements.toggleClass('active');
            } catch (e) {
                webSocket.socket.emit('end_run', e.message);
            }

        }
    };

    Room.prototype.writeOutput = function (string) {
        this.$runElements.toggleClass('active');
        editor.aceEditor.setReadOnly(false);
        this.$output.html(string);
    };

    window.Room = Room;

})(window, document, $);

function shareModalStart(){
    $('#share-modal').foundation('reveal', 'open');
    update_url();
    new Clipboard('#copy-button');
}

function update_url() {
    var $shareUrl = $("#shareUrl");
    $shareUrl.val(window.location.href);
    $shareUrl.select().focus();
}

$('.share-footer').click(function() {
    shareModalStart();
});

$("#shareUrl").click(function() {
    this.select();
});
