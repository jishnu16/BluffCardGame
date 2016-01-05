var requestForUpdate = function(){
	$.get('update',function(data){
		var message = JSON.parse(data)
		if(message && message.isStarted == true)
			window.location.href = '/bluffGame.html';
	})
};
var requestToJoinGame = function(){
	var username = $('#name').val();
	var name = {name:username};
	$.post('joingame',name,function(data){
		$('#message').html(data);
		if(JSON.parse(data).isStarted == true)
			window.location.href = '/bluffGame.html';
	})
};

var onReady = function(){
	$("[type='submit']").click(requestToJoinGame)
	setInterval(requestForUpdate,5000)
}
$(document).ready(onReady);
