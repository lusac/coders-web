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
        this.$run = $('#run');

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
        });

        this.$run.on('click', function() {
            self.runCode();
        });
    };

    Room.prototype.resizing = function () {
        var documentWidth = $(document).width(),
            divisorPosition = this.$divisor.position().left - 5;

        if ((divisorPosition < 150) || (divisorPosition > documentWidth - 150)) {
            console.log("nao deixo");
            return false;
        }

        this.$editor.css('width', divisorPosition)
        this.$editor.find('.ace_content').css('width', divisorPosition);
        this.$output.css('width', documentWidth - divisorPosition);

        throttledEditorResize();
    };

    Room.prototype.runCode = function () {
        var self = this,
            url = 'http://' + document.domain + ':' + location.port + '/room/run',
            data = {'code': editor.aceEditor.getValue(), 'runner': editor.getLanguage()}

        console.log('Sending: ' + data.runner);

        $.post(url, data, function(data) {
            console.log('Run - success');
            self.$output.html(data);
        })
        .done(function() {
            console.log('Run - done');
        })
        .fail(function() {
            console.log('Run - Error');
        })
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

function start_modal(){

    var id = "#modal-window",
        windowHeight = $(document).height(),
        windowWidth = $(window).width();

    //colocando o fundo preto
    $('#mask').css({'width':windowWidth,'height':windowHeight});
    $('#mask').fadeTo("slow",0.8);

    var left = ($(window).width() /2) - ( $(id).width() / 2 );
    var top = ($(window).height() / 2) - ( $(id).height() );

    $(id).css({'top':top,'left':left});
    $(id).show();
    update_url();
};

function update_url() {
    document.getElementById("shareUrl").value = window.location.href;
}

$("#mask").click( function(){
    $(this).hide();
    $(".window").hide();
});

$('.close-btn').click(function(){
    $("#mask").hide();
    $(".window").hide();
});

