var shared = { position: {  my: 'bottom middle', at: 'top middle', adjust: { y: -2 } }, style: { classes: 'ui-tooltip-dark ui-tooltip-rounded simple_tips', tip: { width: 12, height: 6 }}};
//var apiLatest = new api_photos();
//var apiIStockVertical = new api_photos();
//var apiSimilar = new api_photos();
var automatedNext = null;
var urlPay = "";
var urlCancel = "";

$(document).ready(function(){
	
	//var urlPay = $("#formPaypal").find('input[name="return"]').val();
	//var urlCancel = $("#formPaypal").find('input[name="cancel_return"]').val();

	console.log("isolated preview loaded");

	$(".down_other_format").click(function(){
		$("#download-btn").find('input[name="type"]').val($(this).data('format'));
		
		//console.log($(this).data('format'));
		switch($(this).data('format')) {
		    case "svg":
		        ga('send', 'event', 'pngdownload', 'SVG', 'download');
		        break;
		    case "eps":
		        ga('send', 'event', 'pngdownload', 'EPS', 'download');
		        break;
		    case "psd":
		        ga('send', 'event', 'pngdownload', 'PSD', 'download');
		        break;
		    case "base64":
		        ga('send', 'event', 'pngdownload', 'B64', 'download');
		        break;
		} 

		if(userhasLicence != "yes"){
	    	console.log("user has NO licence, opening modal");
	    	$("#download-btn").modal("open");
	    } else{
	    	console.log("user has licence, downloading");
	    	$("#formFree").attr('target', '');
			$("#formFree").submit();
	    }	
	});

	$(".download-file a").click(function(){
	    $("#download-btn").find('input[name="type"]').val('png');
	    var size = $(this).parents("li").find("input.size-down").val();

	    if(size < 16 || size > 5000){
	    	
	    	$(".alert-danger").slideDown();
	    }else{
	    	$(".alert-danger").slideUp();
	    	//form free
	      	$("#formFree").find('input[name="size"]').val(size);
	    	
	    	switch(size) {
			    case 24:
			        ga('send', 'event', 'pngdownload', 'PNG', '24');
			        break;
			    case 150:
			        ga('send', 'event', 'pngdownload', 'PNG', '150');
			        break;
			    case 256:
			        ga('send', 'event', 'pngdownload', 'PNG', '256');
			        break;
			    default:
			        ga('send', 'event', 'pngdownload', 'PNG', 'custom');
			        break;
			}

	    	//paypal	    	
	    	$("#formPaypal").find('input[name="return"]').val( urlPay + "/"+size + "/" + $("#download-btn").find('input[name="type"]').val() );

	    	if(userhasLicence != "yes"){
	    		console.log("user has NO licence, opening modal");
				console.log("Type: " + $("#freeType").val());	
				console.log("Size: " + $("#freeSize").val());

	    		$("#download-btn").modal("open");
	    		listenCopy();
	    	} else{
	    		console.log("user has licence, downloading");
	    		$("#formFree").attr('target', '');
	    		$("#formFree").submit();
	    	}
	    }
	});

	$(".free-download").click(function(){
		$("#formFree").submit();
	});


	$(".more_details").click(function(){
		$("#dinamic_credit_code").val($('.code-input[name="code"]').val());
		$(".text-look").html("It'll will look like this:" + $('.code-input[name="code"]').val());
	});


	listenDownload();
    var listKeywords = [];
    $('.tag').each(function(){
        listKeywords.push($(this).html());
    });
    
    var filterRelated = [125365,listKeywords[0]];

	$('.main_head3').addClass('force-transp-bg').css('border-top', '1px solid #DDD');
	$('.like_link').click(function(){
		//if($('input[name="already_like"]').val() == '0'){
			$.post('/ajax/vectors/like/', {id: $('input[name="id"]').val() },
				function(resp){
					if(resp.msg == 'ok'){
						$('#cant_likes').text(parseInt($('#cant_likes').text()) + 1);
						$('.like_hover').remove();
					} else if(resp.msg == 'html'){
						$.fancybox({
							'scrolling'         : 'no',
							'autoDimensions'    : false,
							'transitionIn'      : 'none',
							'transitionOut'     : 'none',
							'padding'			: 5,
							'content'			: resp.html
						});
					}
				}
			);
		//}
	});
    $('.head_base3').on('click', '.message-close', function(){ $('.cart-message-container').slideUp(300, function(){$(this).remove()})});
	$('.fancybox').fancybox({ 
		padding: 0,
		afterShow:function(current, previous){
			//afterFancyPreview();
			$('.fancybox-inner').find('img.fancybox-image').attr("rel", "license");			
			$('.fancybox-inner').find('img.fancybox-image').attr("href", "http:\/\/creativecommons.org\/licenses\/by-sa\/3.0\/");
			$('.fancybox-inner').find('img.fancybox-image').attr("alt", $('.fancybox').find('img').attr("title"));
			$('.fancybox-inner').find('img.fancybox-image').attr("title", $('.fancybox').find('img').attr("title"));
		}
	});
	$('.flag_btn, .collection_link, .licences, .exifInfo').click(function(){
		var href = $(this).attr('rel');
		fancyObj = {
				'scrolling'         : 'no',
				'autoDimensions'    : false,
				'transitionIn'      : 'none',
				'transitionOut'     : 'none',
				'type'              : 'ajax',
				'href'              : href,
				'padding': 5
			};
		$.fancybox(fancyObj);
	});

	//loadComments();
    $('.how-to-credit').click(howToCredit);
	$('.image-button-free').click(freeDownload);
	$('.image-button-buyable').click(buyImage);
	$('.send-friend').click(sendToAFriend);

	$('a.sTip').each(function() { $(this).qtip({ content: { text: '<div style="text-align:center"><img src="/img/common/loading.gif" alt="Loading..." class="previewLoader" /></div>', ajax: { url: $(this).attr('rel') }, title: { 			text: ' ', button: true } }, position: { my: 'top right', at: 'left middle', adjust: { x: 0, y: 10 }, viewport: $(window) }, show: 'click', hide: { event: 'click unfocus', }, style: { classes: 'ui-tooltip-light2 ui-tooltip-rounded ui-tooltip-shadow', tip: { corner: false } }, events: { hide: function(event, api) { $('.ui-state-default').attr('style', 'display: none !important'); }, show: function(event, api){ $('.ui-state-default').attr('style', 'display: block !important'); } } }); });



	var description = $('.bodyDescription').text();
	if(description.length > 75){
		$('.bodyDescription').hide();
		$('.firstLineDescription').text(description.substring(0,73)+'...');
		//$('.bodyDescription').
		$('.firstLineDescription').before("<span class='moreDesc' style='float:right;margin-top: -5px;'>+</span>");
		$('.moreDesc').click(function(){
			$('.bodyDescription').slideToggle( "swing", function() {
				if($('.firstLineDescription').is(":visible")){
					$('.firstLineDescription').hide();
				}else{
					$('.firstLineDescription').show();
				}
			});
		});
	}

    var referer = document.referrer;
	$.post("/ajax/download-vector/check-referal/", { "referer" : referer },function(resp){console.log("opa")});
    
});

function rebuildSimpleTip(){
	$('.simpleTip[title]').qtip( $.extend({}, shared, { })).removeData('qtip').qtip({ content: { text: $('#confirm') }, position: { my: 'center',  at: 'center', target: $(window) }, show: { event: 'click', solo: true, modal: { on: false } }, hide: 'unfocus', style: 'ui-tooltip-dark ui-tooltip-rounded8', events: { render: function (event, api) { $('.myCloseButton').click(api.hide) } } });
	$('.verySimpleTip[title]').qtip( $.extend({}, shared, { })).removeData('qtip').qtip({ position: { my: 'center', at: 'center', target: $(window) }, show: { event: 'click', solo: true, modal: { on: false } }, hide: 'unfocus', style: 'ui-tooltip-dark ui-tooltip-rounded8', events: { render: function (event, api) { $('.myCloseButton').click(api.hide) } } }); 
}

function howToCredit(){
    if($(this).data('url') != ''){
        var href = $(this).data('url');
        $.fancybox({
            'scrolling'         : 'no',
            'autoDimensions'    : false,
            'transitionIn'      : 'none',
            'transitionOut'     : 'none',
            'type'              : 'ajax',
            'href'              : href,
            'padding': 5
        });
    }
}
function freeDownload(){
	if($(this).attr('data-url') != ''){
		var href = $(this).attr('data-url');
		$.fancybox({
			'scrolling'         : 'auto',
			//'autoDimensions'    : true,
			'transitionIn'      : 'none',
			'transitionOut'     : 'none',
			'type'              : 'ajax',
			'href'              : href,
			'padding': 5
		});
	}
}

function buyImage(){
	if($(this).attr('data-url') != ''){
		var href = $(this).attr('data-url');
		$.fancybox({
			'scrolling'         : 'no',
			'autoDimensions'    : false,
			'transitionIn'      : 'none',
			'transitionOut'     : 'none',
			'type'              : 'ajax',
			'href'              : href,
			'padding': 5
		});
	}
}

function buyImageCallback(buy, text){
    var divClass = 'cart-warning';
	if(buy){
		// agrego uno al numero del cart
		$('.cart-qty').text(parseInt($('.cart-qty').text()) + 1);
        divClass = 'cart-message';
	}
    $('.cart-message-container').remove();
    $('.head_base3:first').prepend('<div class="cart-message-container '+ divClass + '">'+text+'<button type="button" class="message-close">×</button></div>');

	// subo la pantalla para que vea el mensaje
	$('html, body').animate({ scrollTop: 0 }, 1000, "easeInOutQuart");
    return false;
}

function sendToAFriend(){
	if($('input[name="id"]').val() != ''){
		$.get('/ajax/vectors/send/' + $('input[name="id"]').val() + '/',
			function(resp){
				$.fancybox({
					'scrolling'			: 'no',
					'autoDimensions'	: false,
					'transitionIn'		: 'none',
					'transitionOut'		: 'none',
					'type'				: 'ajax',
					'padding'			: 5,
					'afterLoad'			: function(){ 
						this.content = resp;
					}
				});
			}
		);
	}
}

function insertReferrer(){	
	return true;
}

function listenDownload(){
	$('.clickDownload').click(function(){
		$.get("/ajax/download-vector/add-download/"+$(this).data('id')+'/', function(resp){
			
		});
	});
}

function listenCopy(){
	$('.copy_code').zclip({
        path:'/img/swf/ZeroClipboard.swf',
        copy: function(){ return $('.code-input[name="code"]').val(); },
        afterCopy:function(){
          console.log("after copy");
               //gaq.push(['_trackEvent', 'downloads', 'copy']);
                //ga('send', 'event', 'dowloads', 'copy');
           $('.copied').fadeIn(200).delay(20000).fadeOut(100);
        }
    });
}