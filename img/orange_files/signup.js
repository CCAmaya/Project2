$(document).ready(function(){
	
	$.validator.setDefaults({
	    highlight: function(input) {
	        $(input).addClass("err-msg");
	    },
	    unhighlight: function(input) {
	        $(input).removeClass("err-msg");
	    }
	});

	$('#signup_form').validate({
        rules: {
            firstname: "required",
            lastname: "required",
            username_join: { 
            	required: true, 
            	rangelength	: [5, 20]
            },
            email: {
                required: true,
                email: true
            },			
            password: "required",
            're-password': { 
				required: true ,
				equalTo: '#password'
            }
        },
        messages: {
            firstname: "",
            lastname: "",
            username_join: "",
            email: {
                required: '',
                email: ''
            },			
            password: "",
            're-password': { 
				required: '',
				equalTo: ''
            } 
        }        
	});

	/*$('#email').one( "focusout", function(){
		var email = $(this).val();
		var ob = $(this);
		$.post('/ajax/signup/check-email/', {'email': email}, function(resp){
			resp = $.parseJSON(resp);
			if(resp.res == 1){
				ob.removeClass('err-msg');
			}else{
				ob.addClass('err-msg');
			}
		});
	});*/
	
	$('#username_join').keypress(function(e){
		if($(this).val().length > 19){
			event.preventDefault();
			return false;
		}
		var key = e.which;
	    var keychar = String.fromCharCode(key).toLowerCase();
	    
	    //Control keys
	    if ((key==null) || (key==0) || (key==8) || (key==9) || (key==13) || (key==27) )
	         return true;
	
	    if ((("abcdefghijklmnopqrstuvwxyz0123456789_").indexOf(keychar) == -1)) 
	       event.preventDefault();   

	});
	
	

});

function checkEmail(input){
	console.log("validating: " + $(input).val());

	if(!isEmail($.trim($(input).val()))){
		console.log("JS email validation - wrong email");
		$('#emailjoin-ok').hide();
		$('#emailjoin').html('').hide();
		$('#emailjoin-nok').hide();
		$('#emailjoin-format').show();
		return;
	}

	if($(input).val().length >= 6){
		console.log('checking: ' + $(input).val());

		$('#emailjoin').html('<img src="/img/common/loading.gif">');
		$.post('/ajax/signup/check-email-signup/', { 'e': $.trim($(input).val()) }, 
			function(resp){
				console.log(resp);
				if(resp){
					if(resp.msg == "nok"){
						$('#emailjoin-ok').hide();
						$('#emailjoin').html('').hide();
						$('#emailjoin-format').hide();
						$('#emailjoin-nok').show();
						console.log("Email is not ok");
					} else {
						$('#emailjoin-nok').hide();
						$('#emailjoin').html('').hide();
						$('#emailjoin-format').hide();
						$('#emailjoin-ok').show();
						console.log("Email is ok");
					}
				}
			}
		);
	}
}

function isEmail(email) {
	var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return regex.test(email);
}

function checkUserName(username){
	var input = "#username_join";
	if(!username || username == ''){
		username = $(input).val()
	}
	console.log("username: " + username);
	if(username.length >= 5 && username.length <= 100){
		console.log('checking: ' + username);

		$('#uname').html('<img src="/img/common/loading.gif" />');
		$.post('/ajax/signup/check-username/', { 'n': $.trim(username) }, 
			function(resp){
				console.log(resp);
				if(resp){
					if(resp.msg == 'nok'){
						$('#uname-ok').hide();
						$('#uname').html('').hide();
						$('#uname-nok').show();
					} else {
						$('#uname-nok').hide();
						$('#uname').html('').hide();
						$('#uname-ok').show();
					}
				}
			}
		);
	} else{
		console.log('username must be between 5 and 100 chars');	
		$('#uname-ok').hide();
		$('#uname').html('').hide();
		$('#uname-nok').show();	
	}
}
	
