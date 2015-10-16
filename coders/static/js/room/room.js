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

    var id = "#janela1";

    var alturaTela = $(document).height();
    var larguraTela = $(window).width();

    //colocando o fundo preto
    $('#mascara').css({'width':larguraTela,'height':alturaTela});
    $('#mascara').fadeTo("slow",0.8);

    var left = ($(window).width() /2) - ( $(id).width() / 2 );
    var top = ($(window).height() / 2) - ( $(id).height() );

    $(id).css({'top':top,'left':left});
    $(id).show();
    update_url();
};

function update_url() {
    document.getElementById("shareUrl").value = window.location.href;
}

$("#mascara").click( function(){
    $(this).hide();
    $(".window").hide();
});

$('.fechar').click(function(){
    $("#mascara").hide();
    $(".window").hide();
});

