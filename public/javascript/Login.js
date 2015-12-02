var setNameCookie = function() {
    var username = document.getElementById('name').value ;
    document.cookie = username;
    document.getElementById("submit").disabled = 'true';
    
};
var playerMessage = function(formTag,messageTag){
	document.getElementById(messageTag).innerHTML = "Wating for other Player to join the Game";
    document.forms[formTag].submit();
};

