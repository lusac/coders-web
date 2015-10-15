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