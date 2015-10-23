/* global $ */

(function (window, document, $) {
    'use strict';

    var Room = function Room() {
        this.init();
    };

    Room.prototype.init = function () {
        this.$editor = $('#editor-container');
        this.$output = $('#output-container');
        this.$divisor = $('#divisor');
        this.$run = $('.run-btn');
        this.$runElements = $('.room__run-buttons').children();
        this.documentWidth = $(document).width();

        this.bindEvents();
    };

    Room.prototype.bindEvents = function () {
        var self = this;

        this.$divisor.draggable({
            axis: "x",
            cursor: "col-resize",
            drag: function() {
                self.resizing();
            },
            stop: function( event, ui ) {
                var width = parseInt($(this).css("left"), 10);
                $(this).css({'right': 0, 'left': 'initial'});
            }
        });

        this.$run.on('click', function() {
            self.runCode();
        });
    };

    Room.prototype.resizing = function () {
        var documentWidth = $(document).width(),
            divisorPosition = this.$divisor.position().left - 5;

        if ((divisorPosition < 150) || (divisorPosition > documentWidth - 150))
            return;

        this.$editor.css('width', this.convertToPercentage(divisorPosition));
        this.$editor.find('.ace_content').css('width', this.convertToPercentage(divisorPosition));
        this.$output.css('width', this.convertToPercentage(this.documentWidth - divisorPosition));

        throttledEditorResize();
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

    Room.prototype.convertToPercentage = function (width) {
        return (width * 100) / this.documentWidth + '%';
    };

    window.Room = Room;

})(window, document, $);

var throttledEditorResize = (function() {
    var timeWindow = 150;
    var lastExecution = new Date((new Date()).getTime() - timeWindow);

    var throttledEditorResize = function () {
        editor.aceEditor.resize();
    };

    return function() {
        if ((lastExecution.getTime() + timeWindow) <= (new Date()).getTime()) {
            lastExecution = new Date();
            return throttledEditorResize.apply(this, arguments);
        }
    };
})();

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
