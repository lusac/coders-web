/* global $ */

(function (window, document, $) {
    'use strict';

    var Room = function Room() {
        this.init();
    };

    Room.prototype.init = function () {
        this.$editor = $('#editor');
        this.$output = $('#output');
        this.$divisor = $('#divisor');

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
    };

    Room.prototype.resizing = function () {
        var documentWidth = $(document).width(),
            divisorPosition = this.$divisor.position().left;

        this.$editor.css('width', divisorPosition)
        this.$editor.find('.ace_content').css('width', divisorPosition);
        this.$output.css('width', documentWidth - divisorPosition);
    };

    window.Room = Room;

})(window, document, $);

function start_modal(){

    var id = "#modal-window";

    var windowHeight = $(document).height();
    var windowWidth = $(window).width();

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

