/* PLUGINS  */
(function ($) {
    $.toggleShowPassword = function (options) {
        var settings = $.extend({
            field: "#password",
            control: "#toggle_show_password",
        }, options);

        var control = $(settings.control);
        var field = $(settings.field)

        control.bind('click', function () {
            if (control.is(':checked')) {
                field.prop('type', 'text');
            } else {
                field.prop('type', 'password');
            }
        })
    };
}(jQuery));

/**
 * @todo Revisar que de todo esto se puede borrar
 */
$(document).ready(function() {
	$('.back-to-top').click(function(){
		$('html, body').animate({
	    	scrollTop: $("#header").offset().top
	    }, 1000, "easeInOutQuart" );
	});

    /*
    ESTE ES EL ISTOCK FLOTATNTE
    if(Math.round(Math.random() * 10) % 2){
        $.get('/ajax/banners/istock-promo/', function(resp){
            if(resp.msg == 'ok')
                $('body').append(resp.html);
        });

        $('body').on('click', '.istock-close', function(){
            $('.istock-banner').fadeOut(300, function(){
                $(this).remove();
            })
        });
    }*/

	if($.cookie('rememberMe') == 1){
		$('input[name="remember_me"]').attr('checked', 'checked');
		$('input[name="username"]').val($.cookie('rememberUser'));
	}

	$('#flogin').submit(function(){
		if($('input[name="remember_me"]').attr('checked') && $('input[name="username"]').val() != ''){
			$.cookie('rememberUser', $('input[name="username"]').val(), { expires: 30, path: '/' });
			$.cookie('rememberMe', 1, { expires: 30, path: '/' });
		}
	});
	//remember_me
	// +++++++++++++++ TOOLTIP +++++++++++++++++//
	var shared = {
	   position: {
		  my: 'bottom middle', 
		  at: 'top middle',
		  adjust: {
			 y: -2
		  }
	   },
	   style: {
		  classes: 'ui-tooltip-dark ui-tooltip-rounded simple_tips',
		  tip: {
			 width: 12,
			 height: 6
		  }
		  //,delay: 0
	   }
	};
	//=============================//
	// for followers lightbox remove button
	$('.showTip[title]').qtip( $.extend({}, shared, {
	   
	}))
	// Remove the previous tooltips data
	.removeData('qtip')
	//
	.qtip(
    {
		  //id: 'modal', // Since we're only creating one modal, give it an ID so we can style it
		  content: {
			 text: $('#confirm')
		  },
		  position: {
			 my: 'center', // ...at the center of the viewport
			 at: 'center',
			 target: $(window)
		  },
		  show: {
			 event: 'click', // Show it on click...
			 solo: true, // ...and hide all other tooltips...
			 modal: {
				 on: false
				 //,blur: false
			  }
		  },
		  hide: 'unfocus',
		  style: 'ui-tooltip-dark ui-tooltip-rounded8',
		  events: { render: function (event, api) { $('.myCloseButton').click(api.hide) }/*, hide: function(event, api) { api.destroy(); }*/}
		  
    });
	//=============================//
	// for regular title tips
	$('.simpleTip[title]').qtip( $.extend({}, shared, {
	   
	}));
	// for home donate/support
	$('.downTip').qtip({	   
	   position: {
			my: 'bottom middle',  // Position my top left...
			at: 'middle middle',
			viewport: $(window) // Keep it on-screen at all times if possible
	   },
	   hide: {
		 event: 'mouseleave',
		 fixed: true // Helps to prevent the tooltip from hiding ocassionally when tracking!
	  },
	   style: {
		  classes: 'ui-tooltip-dark ui-tooltip-rounded simple_tips',
		  tip: {
			 //corner: left,
			 width: 6,
			 height: 12
		  }
	  }
	});
	// for home donate/support
	$('.infoTip').qtip({
	   content: $('#tip1_content'),
	   position: {
			my: 'left middle',  // Position my top left...
			target: 'mouse',
			adjust: { mouse: false },
			viewport: $(window), // Keep it on-screen at all times if possible
			adjust: {
				x: 20,  y: 10
			}
	   },
	   hide: {
		 event: 'mouseleave',
		 fixed: true // Helps to prevent the tooltip from hiding ocassionally when tracking!
	  },
	   style: {
		  classes: 'ui-tooltip-dark ui-tooltip-rounded simple_tips',
		  tip: {
			 //corner: left,
			 width: 6,
			 height: 12
		  }
	  }
	});

	//=============================//
	// for share.php tips
	$(".shareTip").each(function(i) {
		   content1 = $("#" + this.id + "_content");
		   $(this).qtip({
			   content: content1,
			   position: {
				  my: 'top left', 
				  at: 'right middle',
				  adjust: {
					 x: 5,
					 y: -10
				  }
			   },
			   style: {
				  classes: 'ui-tooltip-light ui-tooltip-rounded simple_tips ui-tooltip-shadow',
				  tip: {
					 corner: false
				  }
				  //delay: 0
			   }
			  // events: { render: function (event, api) { $('.closeBtn').click(api.hide) }}
		   });
	});
	//=============================//
	// for login form in the header
	$('.loginTip').qtip({
	   content: $('#login_box'),
	   position: {
		  my: 'top right', 
		  at: 'middle middle',
		  adjust: {
			 x: 40,y: 20
		  }
	   },
	   show: 'click',
	   hide: 'click unfocus',
	   style: {
		  classes: 'ui-tooltip-custom ui-tooltip-rounded simple_tips',
		  tip: {
			 corner: false
		  }
		  //delay: 0
	   }
	});

	
	//=============================//
	// for footer "contact us"
	$(".footerTip").each(function(i) {
		   content1 = $("#contact_us_content");
		   //alert(JSON.stringify(content1));
		   $(this).qtip({
			   content: content1,
			   position: {
				  my: 'bottom center', 
				  at: 'top middle',
				  adjust: {
					 x: 0,
					 y: -5
				  }
			   },
			   show: 'click',
			   hide: {
			   		event: 'click unfocus'
			   },
			   style: {
				  classes: 'ui-tooltip-dark2 ui-tooltip-rounded13 ui-tooltip-shadow',
				  tip: {
					 corner: true,
					 offset: 90
				  }
				  //delay: 0
			   	},
			   	events: { render: function (event, api) { $('.close_contactus').click(api.hide) }}
		   });
	});
	
	$('#contactus-form').submit(function(e){
		e.preventDefault();		
		var error = false;
		console.log("name: " + $(this).find('input[name="name"]').val());
		if($(this).find('input[name="name"]').val() == ''){
			error = true
			$(this).find('input[name="name"]').addClass('err-msg-sec')
				.click(function(){ $(this).removeClass('err-msg-sec'); })
				.focusin(function(){$(this).removeClass('err-msg-sec'); });
		}
		console.log("subject: " + $(this).find('input[name="subject"]').val());
		if($(this).find('input[name="subject"]').val() == ''){
			error = true
			$(this).find('input[name="subject"]').addClass('err-msg-sec')
				.click(function(){ $(this).removeClass('err-msg-sec'); })
				.focusin(function(){$(this).removeClass('err-msg-sec'); });
		}
		var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

		console.log("emailcontact: " + $(this).find('input[name="emailcontact"]').val());
		if($(this).find('input[name="emailcontact"]').val() == '' || !emailPattern.test($(this).find('input[name="emailcontact"]').val())){
			error = true
			$(this).find('input[name="emailcontact"]').addClass('err-msg-sec')
				.click(function(){ $(this).removeClass('err-msg-sec'); })
				.focusin(function(){$(this).removeClass('err-msg-sec'); });
		}
		console.log("message: " + $(this).find('textarea[name="message"]').val());
		if($(this).find('textarea[name="message"]').val() == ''){
			error = true
			$(this).find('textarea[name="message"]').addClass('err-msg-sec')
				.click(function(){ $(this).removeClass('err-msg-sec'); })
				.focusin(function(){$(this).removeClass('err-msg-sec'); });
		}

		if(!error){
			var data = { 
					name: $(this).find('input[name="name"]').val(),
					email: $(this).find('input[name="emailcontact"]').val(),
					subject: $(this).find('input[name="subject"]').val(),
					message: $(this).find('textarea[name="message"]').val()
				};
			$.post('/ajax/contact-us/', data, 
				function(resp){
					if(resp.msg == 'ok'){
						$('#contactus-form').find('input[name="name"]').val('');
						$('#contactus-form').find('input[name="emailcontact"]').val('');
						$('#contactus-form').find('input[name="subject"]').val('');
						$('#contactus-form').find('textarea[name="message"]').val('');
						$('.close_contactus').click();
						alert($("#message_sent").val());
						console.log("contact message sent");
					}
				}
			)
		} else{
			//alert("error");
			console.log("error validating contact form");
		}
		
		return false;
	});
	// NEWSLETTERS //
	$('#nl-form').submit(function(e){
		e.preventDefault();
		var error = false;
		var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
		if($(this).find('input[name="email"]').val() == '' || !emailPattern.test($(this).find('input[name="email"]').val())){
			error = true
			$(this).find('input[name="email"]').addClass('err-msg-sec')
				.click(function(){ $(this).removeClass('err-msg-sec'); })
				.focusin(function(){$(this).removeClass('err-msg-sec'); });
		}

		if(!error){
			$.post('/ajax/newsletter/', { email: $(this).find('input[name="email"]').val() }, 
				function(resp){
					if(resp.msg == 'ok'){
						$('#nl-form').fadeOut(300, function(){ $('#display_msg').fadeIn(300); });
					} else {
						$('#nl-form').fadeOut(300, function(){ $('#display_err').fadeIn(300); });
					}
 				}
			)
		}
		return false;
	});

	// +++++++++++++++ FANCYBOX +++++++++++++++++//
	
	$("#messages1").fancybox({
		'width'				: 630,
		'height'			: 660,
		'scrolling'			: 'no',
		'autoDimensions'	: false,
		'transitionIn'		: 'none',
		'transitionOut'		: 'none',
		'type'				: 'iframe',
		'padding': 5
	});
	
	$("#registration").fancybox({
		'width'				: 480,
		'height'			: 205,
		'scrolling'			: 'no',
		'autoDimensions'	: false,
		'transitionIn'		: 'none',
		'transitionOut'		: 'none',
		'type'				: 'iframe',
		'padding': 5
	});
	
	$(".editInfo").click(function(){
		var href = $(this).attr('rel');
		$.fancybox({
			'scrolling'			: 'no',
			'autoDimensions'	: false,
			'transitionIn'		: 'none',
			'transitionOut'		: 'none',
			'type'				: 'ajax',
			'href'				: href,
			'padding': 5
		});
	});
	
	// ++++++++++++++++++++ DropDownCheckList ++++++++++++++++++++++ //
	$("#s1").dropdownchecklist( { emptyText: "Select Category", width: 395, maxDropHeight: 245 } );
	$("#s2, #sign_up").dropdownchecklist( { emptyText: "Select Ocupation", width: 248, maxDropHeight: 160 } );
	$("#s3").dropdownchecklist( { emptyText: "Select from categories", width: 555, maxDropHeight: 160 } );
	$("#s8").dropdownchecklist( { emptyText: "Please Select...", width: 349, maxDropHeight: 160 } );
	// ++++++++++++++++++++ IMAGE DROPDOWN MENU ++++++++++++++++++++ //
	try {
		oHandler = $(".mydds").msDropDown().data("dd");
		//oHandler.visible(true);
		//alert($.msDropDown.version);
		//$.msDropDown.create("body select");
		//$("#ver").html($.msDropDown.version);
	} catch(e) {
		alert("Error: "+e.message);
	}
	//Multiple skin on same page
	//$("#selectbox1").msDropDown({mainCSS:'dd3'}); //my_dd is your main CSS
	$("#selectbox1, #selectbox2").msDropDown(); //dd is default;
	$("#selectbox3").msDropDown({mainCSS:'dd3'});
	$("#selectbox4, #selectbox4b, .selectbox4, #selectbox5, #select_signup, #select_search").msDropDown({mainCSS:'dd4'});
	$("#select_search").msDropDown({mainCSS:'dd5'});
	// ++++++++++++++++++++ CYCLE PLUGIN++++++++++++++++++++++++++++ //
	/*
	$('.pet_box').cycle({
		fx: 'fade', // choose your transition type, ex: fade, scrollUp, shuffle, etc...
		speed:  400,
		timeout: 400,
		speedIn:  400,
		speedOut:  900
	});
	*/
	$('.search_btn').click(wordSearch);
	$('#form_search').submit(wordSearch);
});

function wordSearch(){
	var act = $('#form_search').attr('action');
	var word = $("#form_search input[name='search']").val();
	if($.trim(word) != '')
		window.location = act + 'w/' +encodeURI(word);

	return false;
}

function DoBlur(fld) { fld.style.backgroundColor='#fff'; }
function DoFocus(fld) {	fld.style.backgroundColor='#f6f0fb'; }

function DoFocus2(fld, text, color) { 
	fld.style.backgroundColor=color; 
	if(fld.value==text || fld.value=='Search message') {
		fld.value = '';
	}
}
function DoBlur2(fld, text, color) { fld.style.backgroundColor=color; if(fld.value=='' || fld.value==' ') {fld.value = text;} }

function clearText(fld) { 
	fld.value = '';
}

function show_hide(fld) {
	if (fld.style.display == "none") {
		fld.style.display = "block";
	}
	else {
		fld.style.display = "none";
	}	
}
function DoTheCheck(obj, target) {
	targetObj = document.getElementById(target);
	if(obj.checked == true && targetObj.style.display == "none") { 
		show_hide(targetObj); 
		if(target=='newCollection')
			disabledDD(oHandler, true);	
	}
	if(obj.checked == false && targetObj.style.display == "block"){ 
		show_hide(targetObj); 
		if(target=='newCollection')
			disabledDD(oHandler, false);
	}
}

function message(titulo, contenido, class_ico){
	var text = '<div id="cash_out" style="width:417px;min-height:200px;overflow:auto;">';
			text +='<div class="lightbox_title_bar">';
    			text +='<div class="t_ico ' + class_ico + '"></div>';
        		text +='<h1 class="title_text">'+titulo+'</h1>';
        		text +='<div class="clear"></div>';
			text +='</div>';
			text +='<div class="clear"></div>';
			text += '<div class="lb_padding lb_cash_out">' + contenido + '</div>';
		text +='</div>';
	//text +='</div>';
	$.fancybox({
		'scrolling'			: 'no',
		'autoDimensions'	: false,
		'transitionIn'		: 'none',
		'transitionOut'		: 'none',
		'type'				: 'ajax',
		'padding'			: 5,
		'afterLoad'			: function(){ 
		this.content = text;
		}
	});
}


function setCookie(key,value)
{
	if (document.cookie.replace(/(?:(?:^|.*;\s*)key\s*\=\s*([^;]*).*$)|^.*$/, "$1") !== "true") {  
	  document.cookie = key+"="+value+"; path=/";
	}
}

function addPreviewListeners(){
    $('a.previewTip').each(function(){
        var rel = $(this).data('rel');
        if(rel != undefined && rel != ''){
            if(rel[rel.length - 1] !=  '/'){
                var listItems = rel.split('/');
                listItems.pop();
                rel = listItems.join('/') + '/';
            }
            $(this)
                .removeData('qtip')
                // We make use of the .each() loop to gain access to each element via the "this" keyword...
                .qtip({
                    content: {
                        // Set the text to an image HTML string with the correct src URL to the loading image you want to use
                        text: '<div style="text-align:center"><img src="/img/common/loading.gif" alt="Loading..." class="previewLoader"/></div>',
                        ajax: {
                            url: rel // Use the rel attribute of each element for the url to load
                        }
                    },
                    position: {
                        at: 'right center', // Position the tooltip above the link
                        my: 'left center',
                        adjust: {
                            x: 10
                        },
                        viewport: $(window), // Keep the tooltip on-screen at all times
                        effect: false // Disable positioning animation
                    },
                    show: {
                        //event: 'click',
                        solo: true // Only show one tooltip at a time
                    },
                    hide: { event: 'unfocus mouseleave' },

                    style: {
                        classes: 'ui-tooltip-preview ui-tooltip-rounded13 ui-tooltip-shadow',
                        tip: {
                            corner: false
                        }
                    }
                }
            );
        }
        if($(this).attr('href').match(/linkconnector/i) != null){
            $(this).data('promo', $(this).attr('href'));
            $(this).attr('href', 'javascript:;');
            $(this).click(function(e){
                var url = $(this).data('promo');
                e.preventDefault();
                $('body').append('<form id="redirect-banner" target="_blank"></form>');
                $('#redirect-banner')
                                    .attr('action', '/banners/istock/')
                                    .attr('method', 'post')
                                    .append('<input type="hidden" name="url" value="'+url+'" />')
                                    .submit();
                return false;
            });
        }
    });
}
