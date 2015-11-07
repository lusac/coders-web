(function auto_type() {
	new TypingText(document.getElementById("intro"));
	TypingText.runAll();
})();

function create_room(){
    window.location.href = '/room/create';
}