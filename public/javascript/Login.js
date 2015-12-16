var requestForUpdate = function(){
	$.get('update',function(data){
		if(JSON.parse(data).isStarted == true)
			window.location.href = '/bluffGame.html';
	})
};
var requestToJoinIngame = function(){
	var username = $('#name').val();
	$.post('joingame',username,function(data){
		$('#message').html(data);
		if(JSON.parse(data).isStarted == true)
			window.location.href = '/bluffGame.html';
	})
};

var onReady = function(){
	$("#submit1").click(requestToJoinIngame)
	var interval = setInterval(requestForUpdate,5000)
}
$(document).ready(onReady);
