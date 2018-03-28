var bsObj = {};
$(function(){


});

function setUpBlueSnap(token){

	bsObj = {
		hostedPaymentFields: {
			ccn: "ccn",
			cvv: "cvv",
			exp: "exp" 
		},
		onFieldEventHandler: {
			onFocus: function(tagId) { 
                // Handle focus 
	            if (tagId == "ccn") {
                    //$( "#card-check" ).attr("src", "/img/assets/bluesnap_ready.svg").show();
	            } else if (tagId == "exp") {
                    //$( "#date-check" ).attr("src", "/img/assets/bluesnap_ready.svg").show();
	            } else if (tagId == "cvv") {
                    //$( "#cvv-check" ).attr("src", "/img/assets/bluesnap_ready.svg").show();
	            }  
            },
            onBlur: function(tagId) {
                // Handle blur  
	            if (tagId == "ccn") {
                    //$( "#card-check" ).attr("src", "/img/assets/bluesnap_ready.svg").show();
	            } else if (tagId == "exp") {
                    //$( "#date-check" ).attr("src", "/img/assets/bluesnap_ready.svg").show(); 
	            } else if (tagId == "cvv") {
                    //$( "#cvv-check" ).attr("src", "/img/assets/bluesnap_ready.svg").show();
	            }
            },
            onError: function(tagId, errorCode) { 
                /* error codes:
                    "001" --> "Please enter a valid credit card number";            
                    "002" --> "Please enter the CVV/CVC of your card";          
                    "003" --> "Please enter your credit card's expiration date";            
                    "004" --> "Session expired please refresh page to continue";            
                    "005" --> "Internal server error please try again later";           
                */
	            if (tagId == "ccn" && errorCode == "001") {
					//$( "#card-help" ).text('Please enter a valid credit card number');
                    $( "#card-check" ).attr("src", "/img/assets/bluesnap_wrong.svg").show();
	            } else if (tagId == "exp" && errorCode == "003") {
                    $( "#date-check" ).attr("src", "/img/assets/bluesnap_wrong.svg").show();
                    //$( "#date-help" ).text('Please enter the expiration date (MM/YYYY)');
	            } else if (tagId == "cvv" && errorCode == "002" ) {
                    $( "#cvv-check" ).attr("src", "/img/assets/bluesnap_wrong.svg").show();
                    //$( "#cvv-help" ).text('Please enter the CVV/CVC of your card');
	            }
            },
			onEmpty: function(tagId, errorCode) { 
	            if (tagId == "ccn" && errorCode == "001") {
					$( "#card-help" ).text('');
                    $( "#card-check" ).hide().attr("src", "");
					$('#card-logo').attr("src", "https://files.readme.io/d1a25b4-generic-card.png");
	            } else if (tagId == "exp" && errorCode == "003") {
                    $( "#date-check" ).hide().attr("src", "");
                    $( "#date-help" ).text('');
	            } else if (tagId == "cvv" && errorCode == "002" ) {
                    $( "#cvv-check" ).hide().attr("src", "");
                    $( "#cvv-help" ).text('');
	            }
            },
            onType: function(tagId, cardType) {
                //console.log("detected card type: " + cardType);
	            if (cardType == "AmericanExpress") { 
	            	$('#card-logo').attr("src", "https://files.readme.io/97e7acc-Amex.png");
	            } else if (cardType == "CarteBleue") { 
	            	$('#card-logo').attr("src", "https://files.readme.io/5da1081-cb.png");
	            } else if (cardType == "DinersClub") { 
	            	$('#card-logo').attr("src", "https://files.readme.io/8c73810-Diners_Club.png");
	            } else if (cardType == "Discover") { 
	            	$('#card-logo').attr("src", "https://files.readme.io/caea86d-Discover.png");
	            } else if (cardType == "JCB") { 
	            	$('#card-logo').attr("src", "https://files.readme.io/e076aed-JCB.png");
	            } else if (cardType == "MaestroUK") { 
	            	$('#card-logo').attr("src", "https://files.readme.io/daeabbd-Maestro.png");
	            } else if (cardType == "MasterCard") { 
	            	$('#card-logo').attr("src", "https://files.readme.io/5b7b3de-Mastercard.png");
	            } else if (cardType == "Solo") { 
	            	$('#card-logo').attr("src", "https://sandbox.bluesnap.com/services/hosted-payment-fields/cc-types/solo.png");
	            } else if (cardType == "Visa") { 
	            	$('#card-logo').attr("src", "https://files.readme.io/9018c4f-Visa.png");
	            }
            },
			onValid: function(tagId) {
                // Handle a change in validation
	            if (tagId == "ccn") {
                    $( "#card-check" ).attr("src", "/img/assets/bluesnap_ok.svg").show();
					$( "#card-help" ).text('');
	            } else if (tagId == "exp") {
                    $( "#date-check" ).attr("src", "/img/assets/bluesnap_ok.svg").show();
                    $( "#date-help" ).text('');
	            } else if (tagId == "cvv") {
                    $( "#cvv-check" ).attr("src", "/img/assets/bluesnap_ok.svg").show();
                    $( "#cvv-help" ).text('');
	            }
            }
		},                                    
        //styling is optional
        style: {
            // Styling all Hosted Payment Field inputs
            "input": {
                "font-size": "15px",
	            //"font-family": "Helvetica Neue,Helvetica,Arial,sans-serif",
	            "line-height": "1.0",
	            "color": "#000"
            },
            
            // Styling a specific field
            "#ccn": {
                //"height": "50"
            },
            
            // Styling Hosted Payment Field input state
            ":focus": {
                "color": "#000"
            }
        },
        ccnPlaceHolder: "4111222233334444", 
        cvvPlaceHolder: "123", 
        expPlaceHolder: "MM/YYYY"
    };
	bluesnap.hostedPaymentFieldsCreation (token, bsObj);
};

function submitPaymentData(){     
	console.info("submiting");
    bluesnap.submitCredentials( function(cardData){
       console.log('the card type is ' + cardData.ccType + ', last 4 digits are ' + cardData.last4Digits + ', exp is ' + cardData.exp + ' and issuing Country is ' + cardData.issuingCountry + ', after that I can call final submit');
       $('#dvLoading').fadeIn();
       console.log("the card type is: " + loggedUserId);
       if(loggedUserId != "") processBluesnapPayment();
    });
} 

function processBluesnapPayment(){

    toggleValidatingBlur();
    $.ajax({
        url:    '/ajax/vexels-api/process-payment/',
        type:     'post',
        data:     $('#bluesnap-form').serialize(),
        beforeSend: function(request) {
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        },
        statusCode: {
              404: function() {
                console.log('Could not contact server.');
              },
              500: function() {
                console.log('A server-side error has occurred.');
              }
        },
        success:  function(data) {
            console.log(JSON.stringify(data));
            //console.log(JSON.stringify(data.data[0]));
            //console.log(JSON.stringify(data.data[0].description)); 
            var desc = "";
            if(data.result == "fail"){
                if(data.data[0].description){
                    desc = data.data[0].description;
                } else{
                    desc = data.data;
                }
                console.log(desc);
                alert(desc);
            } else if(data.result == "success"){
                window.location.href = data.data.redirect_url;
            } else{
                alert("Unknown error, please contact admin.");
            }
            toggleValidatingBlur();
            $('#dvLoading').fadeOut();   
        },
        fail:     function(error){
            console.info(JSON.stringify(error));
        }
    });
}