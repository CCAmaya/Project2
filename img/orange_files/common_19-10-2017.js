var afterLoginModal="";
var maxTabHeight = 0;
var loggedUserId = "";
var common_debug_console = false;
var showBecomeProBanner = true;
var userHasCredit = false;
var user_has_licence = false;
var isSubscriptor = false;
var isSvgPng = false;
var currentViewing = "";

/********************************************/

$.ajaxSetup ({
    // Disable caching of AJAX responses
    cache: false,
    headers: { "cache-control": "no-cache" }
});

Date.prototype.addDays = function (days) {
    if (days) {
        var dat = new Date(this.valueOf());
        dat.setDate(dat.getDate() + days);
        return dat;
    }
};

/*********************************************/

$(function(){
    $.toggleShowPassword = function (options) {
        var settings = $.extend({
            field: "#password",
            control: "#toggle_show_password",
        }, options);

        var control = $(settings.control);
        var field = $(settings.field)

        control.bind('click', function () {
            if (control.is(':checked')) {
                field.attr('type', 'text');
            } else {
                field.attr('type', 'password');
            }
        })
    };

    getUserSubscriptionStatus("runIfSubscriptor");
    getAfterLoginJS();

    $(".tab").on("click", function(){
        $(".tab-content").each(function(i, obj){
            if($(obj).height() > maxTabHeight) maxTabHeight = $(obj).height();
        });

        $(".tab-content").hide();
        $(".tab").addClass('desactivado');
        $(this).removeClass('desactivado');
        var rel = $(this).attr('rel');
        $(".tab-content-" + rel).height(maxTabHeight);
        $(".tab-content-" + rel).show();
    });

    getUserAvatar();
    dispatchGlobalMessage();

    loadRandomIstockLink("blk__promocode-code");

    $('.v-nav__elm--hamburger-menu').hover(
        function() {
            $('.v-nav__discover-dd').toggleClass('visible');
            $('.v-nav__elm--discover').toggleClass('discover-visible');
        }
    );

    $('.v-nav__discover-dd').hover(
        function() {
            $('.v-nav__elm--discover').toggleClass('discover-visible');
        }
    );

    $('.filter-options label').click(
        function(event) {
            $('.filter-select').val($(event.target).text());
            $('.filter-select').attr('data-url', $(event.target).attr('data-url'));
            toggleOptions(event.target);
            $('.filter-options').slideUp(200, 'linear');
            $('.filter-search-container').removeClass('filter-visible');  
        }
    );

    $('input[readonly]').focus(function(){
        this.blur();
    });

    $('body').on('click',
        function(event) {
            console.log(event.isImmediatePropagationStopped());
            var filterOptions = $('.filter-select');
            if (!filterOptions.is(event.target) && filterOptions.has(event.target).length === 0 && 
                $('.filter-search-container').hasClass('filter-visible')) {
                $('.filter-options').slideUp(200, 'linear');
                $('.filter-search-container').removeClass('filter-visible');  
            }
        }
    );

    $('.filter-select').on('click',
        function(event) {
            event.stopImmediatePropagation();
            if ($('.filter-search-container').hasClass('filter-visible')) {
                $('.filter-options').slideUp(200, 'linear');  
            } else {
                $('.filter-options').slideDown(200, 'linear');
            }
            $('.filter-search-container').toggleClass('filter-visible');
            return false;            
        }
    );

});

function toggleOptions(element) {
    $(element).siblings(':hidden').toggle();
    $(element).toggle();
}

function showEditorialMessage(){
    message = "This content feature well-known brands, trademarks, logos, public personalities, and/or celebrities. It can be used only for editorial purposes (such as news, magazines, etc) or if you are an authorized reseller.  Learn more on our <a target='_blank' href='/terms-and-conditions/'>Terms & Conditions</a>.";
    title = "CONTENT FOR EDITORIAL USE ONLY";
    displayGlobalMessage(message, title);
}

function toggleOptions(element) {
    $(element).siblings(':hidden').toggle();
    $(element).toggle();
}

function likeVector(idUser, idVector, action){//action => 1=LIKE, 0=UNLIKE

    $.ajax({
        url:    '/ajax/vexels-api/like-vector/',
        type:     'post',
        async: false,
        data:     {idUser: idUser, idVector: idVector, action: action},
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

        },
        fail:     function(error){
            console.info(JSON.stringify(error));
        }
    });
}

function loadRandomIstockLink(container){

    console.log("loadRandomIstockLink for: " + container);

    if (!$("." + container).length){
        console.log(container + " does not exist");
        return;
    }

    $.ajax({
        url:    '/ajax/vexels-api/get-random-istock-link/',
        type:     'post',
        async: false,
        data:     {container: container},
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
            //$("#" + data.container).html(data.link);
            //blk__promocode-code
            $("." + data.container + " a").prop("href", data.link);
        },
        fail:     function(error){
            console.info(JSON.stringify(error));
        }
    });
}

function validateVectorLicence(idVector, callback_success, callback_fail){

    console.log("checking licence for vector: " + idVector);

    $.ajax({
        url:    '/ajax/vexels-api/has-logged-user-licence/',
        type:     'post',
        async: false,
        data:     {idVector: idVector, callback_success: callback_success, callback_fail: callback_fail},
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
            //console.log(JSON.stringify(data));
            executeFunctionByName(data.callbackFunction, window, []);
        },
        fail:     function(error){
            console.info(JSON.stringify(error));
        }
    });
}

function checkSessionNoCredit(){

    console.log("checking session no credit");

    $.ajax({
        url:    '/ajax/vexels-api/check-session-no-credit/',
        type:     'post',
        async: false,
        data:     {},
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
            if(data.userHasNoCredit){
                var message = "You have not enough credit. Please upgrade your acount.";
                var title = "Notification!!";
                displayGlobalMessage(message, title);
            }
        },
        fail:     function(error){
            console.info(JSON.stringify(error));
        }
    });
}

function checkUserCredit(callback_success, callback_fail){

    console.log("checking user credit");

    $.ajax({
        url:    '/ajax/vexels-api/check-user-credit/',
        type:     'post',
        async: false,
        data:     {callback_success: callback_success, callback_fail: callback_fail},
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
            executeFunctionByName(data.callbackFunction, window, [])
            userHasCredit = data.hasCredit;
        },
        fail:     function(error){
            console.info(JSON.stringify(error));
        }
    });
}

function getUserSubscriptionStatus(callback_success, callback_fail){

    console.log("checking subscrition status");

    $.ajax({
        url:    '/ajax/vexels-api/get-user-subscription-status/',
        type:     'post',
        async: false,
        data:     {callback_success: callback_success, callback_fail: callback_fail},
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
            if(data.isSubscriptor){
                executeFunctionByName(data.callbackFunction, window, [])
            } else{
                runIfNOTSubscriptor();
            }
        },
        fail:     function(error){
            console.info(JSON.stringify(error));
        }
    });

}

function runIfNOTSubscriptor(){
    console.log("showing shutter");
    $(".no-pro-content").show();
}

function runIfSubscriptor(){
    console.log("hidding shutter");
    $(".no-pro-content").hide();
}

function setLastViewedVector(idVector){

    $.ajax({
        url:    '/ajax/vexels-api/set-last-viewed-vector/',
        type:     'post',
        data:     {idVector: idVector},
        beforeSend: function(request) {
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        },
        statusCode: {
              404: function() {
                if(common_debug_console) console.log('Could not contact server.');
              },
              500: function() {
                if(common_debug_console) console.log('A server-side error has occurred.');
              }
        },
        success:  function(data) {
            if(common_debug_console) console.log(JSON.stringify(data));
        },
        fail:     function(error){
            console.info(JSON.stringify(error));
        }
    });
}

function startPurchaseFlow(idPlan, idVector, vectorName){
    if(common_debug_console) console.log("purchasing plan: " + idPlan + " and vector: " + idVector + " - " + vectorName);
    $('#dvLoading').fadeIn();
    var args = "";
    if(idVector){
        args = idPlan + "@@@" + idVector + "@@@" + vectorName;
    } else{
        args = idPlan;
    }

    if(common_debug_console) console.log("final args: " + args);

    $.ajax({
        url:    '/ajax/vexels-api/get-bs-token/',
        type:     'post',
        data:     {args: args},
        beforeSend: function(request) {
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        },
        statusCode: {
              404: function() {
                if(common_debug_console) console.log('Could not contact server.');
              },
              500: function() {
                if(common_debug_console) console.log('A server-side error has occurred.');
              }
        },
        success:  function(data) {
            if(common_debug_console) console.log(JSON.stringify(data));
            setUpBlueSnap(data.token);
            //bluesnap.hostedPaymentFieldsCreation (data.token, bsObj);
            if(data.error == "not_logged_in"){
                if(common_debug_console) console.log("Error - Not Logged in");
                $('#dvLoading').fadeOut();
                alert("Error - Please try registering manually.");
                return false;
            }

            if(data.token == ""){
                if(common_debug_console) console.log("Error retreiving Token");
                alert("Error - Please contact Admin.");
            } else{
                $("#token_hidden").val(data.token);

                $("#bluesnap-hosted-iframe-ccn").css("height", "40px");
                $("#bluesnap-hosted-iframe-ccn").css("width", "50%");
                $("#bluesnap-hosted-iframe-ccn").css("background-color", "#FFF");

                $("#bluesnap-hosted-iframe-exp").css("height", "40px");
                $("#bluesnap-hosted-iframe-exp").css("width", "65%");
                $("#bluesnap-hosted-iframe-exp").css("background-color", "#FFF");

                $("#bluesnap-hosted-iframe-cvv").css("height", "40px");
                $("#bluesnap-hosted-iframe-cvv").css("width", "50%");
                $("#bluesnap-hosted-iframe-cvv").css("background-color", "#FFF");

                var args = data.args.split("@@@");

                $("#bluesnap-form input[name=idPlan]").val(args[0]);
                if(args[1]){
                    $("#bluesnap-form input[name=idVector]").val(args[1]);
                    $("#bluesnap-form input[name=redirectVector]").val(args[1]);
                    $("#bluesnap-form input[name=vectorName]").val(args[2]);
                }
                $("#bluesnap-form input[name=idUser]").val(data.idUser)
                if(common_debug_console) console.log("Setting idUser: " + data.idUser);
                getPlanInfo(args[0], data.idUser);
                loggedUserId = data.idUser;
                //checkIfUserSubscriptor(data.idUser, args[0]);
                //setTimeout("loadPayPalData()", 1000);

                //Since I have to do another ajax call in getPlanInfo, I do not hide the loader here.
                //$('#dvLoading').fadeOut();
            }
        },
        fail:     function(error){
            console.info(JSON.stringify(error));
        }
    });
}

function makeIStockSearchSearchPage(searchTerm, order, page, pageSize){

    console.log("Making IStock Search");
    $(".shutter_container").html(getIStockLoader('top'));

    $.ajax({
        url:    '/ajax/vexels-api/make-istock-search/',
        type:     'post',
        async: false,
        data:     {searchTerm: searchTerm, order: order, page: page, pageSize: pageSize},
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
            //console.log(JSON.stringify(data));
            if(!data.error){
                var images = data.images;
                //$(".shutter_container").html("");
                var row = "";
                var i=0;

                $.each(images, function( key, image){
                    //console.log(JSON.stringify(value));

                    if(i++==0) console.log(image);

                    row += '<div class="shutter-list-single__item shutter-list__item" data-w="' + image.width + '" data-h="' + image.height + '">';
                    row += '    <a data-id="' + image.id + '" rel="nofollow" target="_blank" href="' + image.referalLink + '" data-rel="" onclick="javascript:ga(\'send\', \'event\', \'shutter\', \'search\',\'' + image.analiticsTracker + '\'});" style="background-image:url(' + image.imageSrc + ');background-size: cover;" alt="' + image.caption + '" title="' + image.title + '">';
                    row += '   </a>';
                    row += '</div>';
                });
                console.log("Replacing shutter_container html");
                $(".shutter_container").html(row);

                //console.log("shutter_container data disabled: " + $(".shutter_container").data("disabled"));
                if($(".shutter_container").data("disabled") != "disabled"){
                    $(".shutter_container").show();
                    applyListFlex("shutter_container", "shutter-list__item", 120, 1, 1);
                } else{
                    $(".shutter_container").hide();
                    $(".shutter_container_top").hide();
                }

            } else{
                //error
                console.log(data.error);
                if($(".shutter_container").data("disabled") != "disabled"){
                    $(".shutter_container").show();
                } else{
                    $(".shutter_container").hide();
                }
            }
        },
        fail:     function(error){
            console.info(JSON.stringify(error));
        }
    });
}

function getIStockLoader(position){
    if(position == "top"){
        return '<span style="padding: 0 3px; color: blue; font-weight:bold; display: inline-block;">Loading...</span>';
    } else if(position == "side"){
        return '<span style="padding: 0 3px; color: white; font-weight:bold; display: inline-block;">Loading...</span>';
    } else{
        return '<span style="padding: 0 3px; color: blue; font-weight:bold; display: inline-block;">Loading...</span>';
    }
}

function makeIStockSearchSideFrame(searchTerm, order, page, pageSize, parentVectorId){

    console.log("Making IStock Search");
    $(".shutter-list").html(getIStockLoader('side'));

    $.ajax({
        url:    '/ajax/vexels-api/make-istock-search/',
        type:     'post',
        data:     {searchTerm: searchTerm, order: order, page: page, pageSize: pageSize, parentVectorId: parentVectorId},
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
            //console.log(JSON.stringify(data));
            if(!data.error){
                var images = data.images;
                //$(".shutter-list").html("");
                var row = "";

                $.each(images, function( key, image){
                    //console.log(JSON.stringify(image));

                    row += '<a data-id="' + image.id + '" alt="' + image.caption + '" title="' + image.title + '" rel="nofollow" target="_blank" class="shutter-list__item " ';
                    row += 'href="' + image.referalLink + '" data-rel="" data-w="' + image.width + '" data-h="' + image.height + '" ';
                    row += 'onclick="javascript:ga(\'send\', \'event\', \'shutter\', \'vectors\', \'' + image.analiticsTracker + '\');" ';
                    row += 'style="background-image: url(' + image.imageSrc + '); background-size: cover; width: 189px; height: 189px; display: block;">    ';
                    row += '</a>';

                });
                var searchUrl = 'http://www.istockphoto.com/photos/' + data.usedSearchTerm + '?phrase=' + data.usedSearchTerm + '&excludenudity=true&sort=best';
                var seeMore = data.randomLink;//"http://istockphoto.7eer.net/c/411244/258824/4205?u=" + searchUrl;
                seeMore = '<a href="' + seeMore + '" class="seemore-button btn btn--dark btn--ftr" target="_blank">+ See  More</a>';
                $(".content-istock").append(seeMore);

                $(".shutter-list").html(row);

                //console.log("shutter_container data disabled: " + $(".shutter_container").data("disabled"));
                if($(".shutter-list").data("disabled") != "disabled"){
                    $(".shutter-list").show();
                    console.log("isSvgPng: " + isSvgPng);
                    applyListFlex("shutter-list", "shutter-list__item", 190, 1, null);

                    if(isSvgPng){
                        applyListFlex("isolated-list", "featured-list__item", 190, 1, null);
                    } else{
                        applyListFlex("featured-list", "featured-list__item", 260, 1, null);
                    }
                } else{
                    $(".shutter-list").hide();
                }

            } else{
                //error
                //console.log("shutter_container data disabled: " + $(".shutter_container").data("disabled"));
                if($(".shutter-list").data("disabled") != "disabled"){
                    $(".shutter-list").show();
                } else{
                    $(".shutter-list").hide();
                }
            }
        },
        fail:     function(error){
            console.info(JSON.stringify(error));
        }
    });
}

function applyListFlex(containerClass, elementClass, height, truncate, rows){
    //console.log("reordering: " + containerClass + ", height: " + height);

    if(rows != null){
        $("." + containerClass).each(function() {
            $(this).flexImages({
                //rowHeight: height,
                truncate: truncate,
                maxRows: rows,
                container: "." + elementClass
            })
        });
    } else{
        $("." + containerClass).each(function() {
            $(this).flexImages({
                rowHeight: height,
                truncate: truncate,
                container: "." + elementClass
            })
        });
    }
}

function checkSubscriptionStatus(){

    console.log("checking subscrition status");

    $.ajax({
        url:    '/ajax/vexels-api/has-logged-user-licence/',
        type:     'post',
        data:     {idVector: currentViewing},
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
            //console.log(JSON.stringify(data));
            console.log("showBecomeProBanner: " + showBecomeProBanner);
            if(data.isSubscriptor || data.hasLicence){
                console.log("here I do NOT show the banner");
                $("#sticky-Left-Banner").hide();
            } else{
                console.log("here I show the banner");
                if(showBecomeProBanner) $("#sticky-Left-Banner").show();
            }

            if(data.isSubscriptor){
                $("#is_subscriptor").val("yes");
            }
        },
        fail:     function(error){
            console.info(JSON.stringify(error));
        }
    });

}

function dispatchGlobalMessage(){

    console.log("retreiving global message");

    $.ajax({
        url:    '/ajax/vexels-api/global-message/',
        type:     'post',
        data:     {},
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
            console.log("global message: " + JSON.stringify(data));
            if(data.global_message != ""){
                var title = "Message";
                if(data.global_message_title != "") title = data.global_message_title;
                displayGlobalMessage(data.global_message, title);
            }
        },
        fail:     function(error){
            console.info(JSON.stringify(error));
        }
    });

}

function displayGlobalMessage(message, title){
    console.log("Global Message: " + message + ", title: " + title);
    $("#message_title").html(title);
    $("#message_content").html(message);
    $("#message-modal").modal("show");
    //alert(message);
}

function checkIfUserSubscriptor(idUser, idPlan){

    $('#dvLoading').fadeIn();
    if(common_debug_console) console.log("checking already owned for idUser: " + idUser + ", and idPlan: " + idPlan);

    $.ajax({
        url:    '/ajax/vexels-api/is-user-subscriptor/',
        type:     'post',
        data:     {idUser: idUser, idPlan: idPlan},
        beforeSend: function(request) {
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        },
        statusCode: {
              404: function() {
                if(common_debug_console) console.log('Could not contact server.');
              },
              500: function() {
                if(common_debug_console) console.log('A server-side error has occurred.');
              }
        },
        success:  function(data) {
            if(common_debug_console) console.log(JSON.stringify(data));
            if(data.isSubscriptor){
                if(common_debug_console) console.log("User already has licence for this vector");
                setAfterLoginJS("", "");
                setTimeout('window.location.reload()', 2000);
            } else{
                loadPayPalData();
                $("#purchase-step-1").modal('show');
            }
            $('#dvLoading').fadeOut();
        },
        fail:     function(error){
            console.info(JSON.stringify(error));
        }
    });

}

function setTransactionResult(result, redirect_url){
    if(common_debug_console) console.log(result + " - " + redirect_url);
    $('#dvLoading').fadeOut();
    if(result == 'success'){
        window.location.href = redirect_url;//$("#url_download").attr("href");
    } else{
        alert(result);
    }

}

function processPayment(){
    if(common_debug_console) console.log("processing payment");
    if($("#idPlan").val() != ""){
        submitPaymentData();
    } else{
        if(common_debug_console) console.log("Plan id is missing.");
        alert("An error has ocurred. Please try again later.");
    }
}

function forceLoginForPurchase(idPlan, idVector, vectorName){
    if(common_debug_console) console.log("forceing login for purchasing plan: " + idPlan + " and vector: " + idVector + " - " + vectorName);
    $(".modal").modal('hide');
    //setAfterLoginModal("purchase-step-1");
    setAfterLoginJS("startPurchaseFlow", idPlan+"@@@"+idVector+"@@@"+vectorName);
    $("#v-join").modal('show');

}

function validateUserLogIn(callback_success, args_success, callback_fail, args_fail, idVector){

    //$('#dvLoading').fadeIn();
    console.log("validateUserLogIn");
    $.ajax({
        url:    '/ajax/vexels-api/validate-login/',
        type:     'post',
        async: false,
        data:     { callback_success: callback_success, callback_fail: callback_fail, args_success: args_success , args_fail: args_fail, idVector: idVector},
        beforeSend: function(request) {
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        },
        statusCode: {
              404: function() {
                if(common_debug_console) console.log('Could not contact server.');
              },
              500: function() {
                if(common_debug_console) console.log('A server-side error has occurred.');
              }
        },
        success:  function(data) {
            //if(common_debug_console) console.log(JSON.stringify(data));
            if(data.islogged){
                loggedUserId = data.idUser;
                user_has_licence = data.user_has_licence;
                isSubscriptor = data.isSubscriptor;
                if(common_debug_console) console.log("User " + loggedUserId + " is logged in");
            } else{
                loggedUserId = "";
                if(common_debug_console) console.log("User is NOT logged in");
            }

            if(data.callback){
                var callbackFunction = data.callback;
                var args = data.args;
                executeFunctionByName(callbackFunction, window, args);
                if(common_debug_console) console.log("callback called");
            } else{
                if(common_debug_console) console.log("no callback");
            }
            //$('#dvLoading').fadeOut();
        },
        fail:     function(error){
            console.info(JSON.stringify(error));
        }
    });
}

function getUserAvatar(idUser){

    //$('#dvLoading').fadeIn();
    $.ajax({
        url:    '/ajax/vexels-api/get-user-avatar/',
        type:     'post',
        data:     { idUser: idUser },
        beforeSend: function(request) {
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        },
        statusCode: {
              404: function() {
                if(common_debug_console) console.log('Could not contact server.');
              },
              500: function() {
                if(common_debug_console) console.log('A server-side error has occurred.');
              }
        },
        success:  function(data) {
            console.log(JSON.stringify(data));
            if(data.error != "" && data.result != ""){
                $(".avatar__user").attr('src', data.result);
                $(".avatar__user").attr('alt', data.user_title);
                $(".avatar__user").attr('title', data.user_title);
            }
            //$('#dvLoading').fadeOut();
        },
        fail:     function(error){
            console.info(JSON.stringify(error));
        }
    });
}

function getPlanInfo(idPlan, idUser){

    $('#dvLoading').fadeIn();
    if(common_debug_console) console.log('geting plan info.');
    $.ajax({
        url:    '/ajax/vexels-api/get-plan-info/',
        type:     'post',
        data:     {idPlan: idPlan, idUser: idUser},
        beforeSend: function(request) {
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        },
        statusCode: {
              404: function() {
                if(common_debug_console) console.log('Could not contact server.');
              },
              500: function() {
                if(common_debug_console) console.log('A server-side error has occurred.');
              }
        },
        success:  function(data) {
            if(common_debug_console) console.log(JSON.stringify(data));
            if(data.plan){
                $("#amount").val(data.plan.cost);
                $("#amount_show").html("USD " + data.plan.cost);
                var frec = (data.plan.charge_frecuency == 'ANNUALLY')?"/year":"/month";
                if(data.plan.recurrent=="1") {
                    $("#amount_show").html( $("#amount_show").html() + frec );
                    $("#redirectVector").val('');
                }
                $("#amount_show_paypal").html($("#amount_show").html());
                $("#plan_name_paypal").html(data.plan.name);
                $('#plan').val($('#idPlan').val());

                $('#isSubscription').val('');

                //I do not remove this code on purpose.
                //Needs to be tested further
                /*if(data.plan.id != 2 && data.plan.id != 7 && data.plan.id != 8 && data.plan.id != 9){
                    $('#isSubscription').val('yes');
                } else{
                    $('#isSubscription').val('no');
                }*/

                if(data.plan.recurrent == "1"){
                    $('#isSubscription').val('yes');
                } else{
                    $('#isSubscription').val('no');
                }
                //console.log('#isSubscription: ' + $('#isSubscription').val());

                checkIfUserSubscriptor(data.idUser, data.plan.id);
            }
            $('#dvLoading').fadeOut();
        },
        fail:     function(error){
            console.info(JSON.stringify(error));
        }
    });
}

function getAfterLoginModal(){

    $('#dvLoading').fadeIn();
    if(common_debug_console) console.log('geting after login modal.');
    $.ajax({
        url:    '/ajax/vexels-api/get-after-login-modal/',
        type:     'post',
        data:     {},
        beforeSend: function(request) {
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        },
        statusCode: {
              404: function() {
                if(common_debug_console) console.log('Could not contact server.');
              },
              500: function() {
                if(common_debug_console) console.log('A server-side error has occurred.');
              }
        },
        success:  function(data) {
            if(common_debug_console) console.log(JSON.stringify(data));
            if(data.after_login_modal != ""){
                $("#" + data.after_login_modal).modal('show');
                setAfterLoginModal("");
            }
            $('#dvLoading').fadeOut();
        },
        fail:     function(error){
            console.info(JSON.stringify(error));
        }
    });
}

function getAfterLoginJS(){

    //$('#dvLoading').fadeIn();
    if(common_debug_console) console.log('geting after login modal.');
    $.ajax({
        url:    '/ajax/vexels-api/get-after-login-js/',
        type:     'post',
        data:     {},
        beforeSend: function(request) {
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        },
        statusCode: {
              404: function() {
                if(common_debug_console) console.log('Could not contact server.');
              },
              500: function() {
                if(common_debug_console) console.log('A server-side error has occurred.');
              }
        },
        success:  function(data) {
            if(common_debug_console) console.log(JSON.stringify(data));
            var callbackFunction = "";
            var args = "";
            if(data.after_login_js != "" && data.after_login_js != null){
                callbackFunction = data.after_login_js;
                if(data.args != null) args = data.args;
                executeFunctionByName(callbackFunction, window, args);
                if(common_debug_console) console.log("after login callback called");
                setAfterLoginJS("", "");
            }
            $('#dvLoading').fadeOut();
        },
        fail:     function(error){
            console.info(JSON.stringify(error));
        }
    });
}

function setAfterLoginJS(fnName, parameters){

    $('#dvLoading').fadeIn();
    $.ajax({
        url:    '/ajax/vexels-api/set-after-login-js/',
        type:     'post',
        data:     {afterLoginJS: fnName, args: parameters},
        beforeSend: function(request) {
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        },
        statusCode: {
              404: function() {
                if(common_debug_console) console.log('Could not contact server.');
              },
              500: function() {
                if(common_debug_console) console.log('A server-side error has occurred.');
              }
        },
        success:  function(data) {
            if(common_debug_console) console.log(JSON.stringify(data));
            $('#dvLoading').fadeOut();
        },
        fail:     function(error){
            console.info(JSON.stringify(error));
        }
    });
}

function setAfterLoginModal(modal){

    $('#dvLoading').fadeIn();
    $.ajax({
        url:    '/ajax/vexels-api/set-after-login-modal/',
        type:     'post',
        data:     {afterLoginModal: modal},
        beforeSend: function(request) {
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        },
        statusCode: {
              404: function() {
                if(common_debug_console) console.log('Could not contact server.');
              },
              500: function() {
                if(common_debug_console) console.log('A server-side error has occurred.');
              }
        },
        success:  function(data) {
            if(common_debug_console) console.log(JSON.stringify(data));
            $('#dvLoading').fadeOut();
        },
        fail:     function(error){
            console.info(JSON.stringify(error));
        }
    });
}

function setCardHolderName(fullName){
    var tmp = fullName.split(" ");
    $("#firstName").val(tmp[0]);
    $("#lastName").val(tmp[1]);
    /*
    for(i=1;i<tmp.length;i++){
        $("#lastName").val($("#lastName").val() + tmp[i]);
    }
    */
}

function log(txt){
    if(common_debug_console) console.log(txt);
}

function executeFunctionByName(functionName, context, args) {
    if(common_debug_console) console.log("functionName: " + functionName);
    if(common_debug_console) console.log("args: " + args);

    if(args.indexOf("@@@") > 0){
        args = "'" + args.split("@@@").join("','") + "'";
    }
    if(common_debug_console) console.log("new args: " + args);

    if (functionName == '') return false;

    setTimeout(functionName + "(" + args + ")", 0);
/*
    var args = [].slice.call(arguments).splice(2);
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    for(var i = 0; i < namespaces.length; i++) {
        context = context[namespaces[i]];
    }
    return context[func].apply(this, args);*/
}