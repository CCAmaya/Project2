var lang = 'www';
var OAUTHURL    =   'https://accounts.google.com/o/oauth2/auth?';
var VALIDURL    =   'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=';
var SCOPE       =   'openid%20email';//'https://www.googleapis.com/auth/userinfo.profile';
var CLIENTID    =   '783622841560-l4qgl23hnfapr336p7l2tvhtnhr2pllv.apps.googleusercontent.com';
var REDIRECT    =   'https://' + lang + '.vexels.com/googcallback.php';
var TYPE        =   'token';
var _url        =   OAUTHURL + 'scope=' + SCOPE + '&client_id=' + CLIENTID + '&redirect_uri=' + REDIRECT + '&response_type=' + TYPE;
var LOGOUTURL   =   "https://www.google.com/accounts/Logout";
var API_KEY     =   "AIzaSyCbGnzl6vb4QEPgr4pjNN-c8nJYkpkwclk";
var PROFILE_PICTURE_URL = "getGoogleProfilePictureUrl.php";
var acToken;
var tokenType;
var expiresIn;
var user;
var loggedIn = false;
var logInWin;
var afterLoginFunction = "";
var isGoogleRegistry = false;
var callbackURLResult = "";
var google_debug_console = false;

document.domain = 'vexels.com';

function google_login() {    
    if(google_debug_console) ("logging in with Google");
    //Set_Cookie("vexelsgooglelogin", "googleloginsuccess", 0, "/", ".vexels.com");
    logInWin = window.open(_url, "googlecallback", 'width=400, height=400'); 
    if(google_debug_console) console.log(logInWin);
    if(google_debug_console) console.log("pop up opened");
    getLogInResult();
}

function getLogInResult(){
    var pollTimer = window.setInterval(function() { 
        try {
            if(google_debug_console) console.log(logInWin.document.URL);
            if(google_debug_console) console.log(logInWin);
            if(google_debug_console) console.log("REDIRECT: " + REDIRECT);
            //if (logInWin.document.URL.indexOf(REDIRECT) != -1) {
            if(callbackURLResult != ""){
                window.clearInterval(pollTimer);
                var url =   callbackURLResult;//logInWin.document.URL;
                //alert(url);
                acToken =   gup(url, 'access_token');
                tokenType = gup(url, 'token_type');
                expiresIn = gup(url, 'expires_in');

                if(google_debug_console) console.log("acToken: " + acToken + ", tokenType: " + tokenType + ", expiresIn: " + expiresIn);               
                logInWin.close();
                validateGoogleToken(acToken);
            }
        } catch(e) {
          //alert(e);
            console.info(e);
        }
    }, 1000);
}

function validateGoogleToken(token) {
  $.ajax({
      url: VALIDURL + token,
      data: null,
      success: function(responseText){  
        if(google_debug_console) console.log(responseText);
        getGoogleUserInfo();
      },  
      dataType: "jsonp"  
  });
}

function gup(url, name) {
    name = name.replace(/[[]/,"\[").replace(/[]]/,"\]");
    var regexS = "[\?&#]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( url );
    if( results == null )
        return "";
    else
        return results[1];
}

function getGoogleUserInfo() {
    $.ajax({
        url: 'https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + acToken,
        data: null,
        success: function(resp) {
            user = resp;
            console.info(resp);
        
            var lang = $('input[name="lang"]').val();

            user.user_id = user.id;
            user.id_plus = user.id;
            user.username = user.email;
            user.username_login = user.email;
            user.username_join = user.email;
            user.lang = lang;

            doGoogleLogIn(user);
        },
        dataType: "jsonp"
    });
}

function googleLogOut(){
  $("#googleLogout").html("<iframe name='googlelogOutIframe' id='googlelogOutIframe' style='display:none'></iframe>");
  $("#googlelogOutIframe").attr("src", LOGOUTURL);
  loggedIn = false;
}

function doGoogleLogIn(user){

    if(isGoogleRegistry){
        if(google_debug_console) console.log("Doing google registry");
        if(google_debug_console) console.log(user);
        var url = "/ajax/signup/";
    } else{//is Login
        if(google_debug_console) console.log("Doing google login");
        user = {'user_id': user.user_id, 'type_user_id': 'google', 'username_login': user.email, 'username': user.email}
        var url = "/ajax/login/";
    }
    //if(google_debug_console) console.log(url);

    $.ajax({
        url:        url,
        type:       'post',
        dataType:   'json',
        data:       user,
        statusCode: {
              404: function() {
                if(google_debug_console) console.log('Could not contact server.');
              },
              500: function() {
                if(google_debug_console) console.log('A server-side error has occurred.');
              }
        },
        success:  function(data) {
            if(google_debug_console) console.log(data);
            var message = data.msg;

            if(data.opt == "do-login"){
                if(google_debug_console) console.log("Already registered, logging in");
                isGoogleRegistry = false;
                getGoogleUserInfo();
            } else{               
                if(data.res == "-1"){
                    if(google_debug_console) console.log("can not login, registering");
                    isGoogleRegistry = true;
                    getGoogleUserInfo();
                } else{
                    if(google_debug_console) console.log("Success, reloading");
                    window.location.reload();
                } 
            }            
        },
        fail:     function(error){
            alert("error connecting");
            console.info(JSON.stringify(error));
        }
    });

}

function Set_Cookie( name, value, expires, path, domain, secure ){

    // set time, it's in milliseconds
    var today = new Date();
    today.setTime( today.getTime() );

    /*
    if the expires variable is set, make the correct
    expires time, the current script below will set
    it for x number of days, to make it for hours,
    delete * 24, for minutes, delete * 60 * 24
    */
    if ( expires ){
        expires = expires * 1000 * 60 * 60 * 24;
    }
    var expires_date = new Date( today.getTime() + (expires) );

    document.cookie = name + "=" +escape( value ) +
    ( ( expires ) ? ";expires=" + expires_date.toGMTString() : "" ) +
    ( ( path ) ? ";path=" + path : "" ) +
    ( ( domain ) ? ";domain=" + domain : "" ) +
    ( ( secure ) ? ";secure" : "" );

} 