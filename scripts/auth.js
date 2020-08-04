'use strict';

var googleProfileUserLoader = (function() {

  var STATE_START=1;
  var STATE_ACQUIRING_AUTHTOKEN=2;
  var STATE_AUTHTOKEN_ACQUIRED=3;

  var state = STATE_START;

  var signin_button, revoke_button;

 function disableButton(button) {
    button.setAttribute('disabled', 'disabled');
    button.style.display="none";
  }

  function enableButton(button) {
    button.removeAttribute('disabled');
    button.style.display="block";
  }

  function changeState(newState) {
    state = newState;
    switch (state) {
      case STATE_START:
        enableButton(signin_button);
        disableButton(revoke_button);
        break;
      case STATE_ACQUIRING_AUTHTOKEN:
      	showSnackbar('Please Wait...');
        console.log('Acquiring token...');
        disableButton(signin_button);
        disableButton(revoke_button);
        break;
      case STATE_AUTHTOKEN_ACQUIRED:
      	showSnackbar('Signed In.');
        disableButton(signin_button);
        enableButton(revoke_button);
        break;
    }
  }

  
  // OnClick event handlers for the buttons.

  /**
    Retrieves a valid token. Since this is initiated by the user
    clicking in the Sign In button, we want it to be interactive -
    ie, when no token is found, the auth window is presented to the user.
    Observe that the token does not need to be cached by the app.
    Chrome caches tokens and takes care of renewing when it is expired.
    In that sense, getAuthToken only goes to the server if there is
    no cached token or if it is expired. If you want to force a new
    token (for example when user changes the password on the service)
    you need to call removeCachedAuthToken()
  **/
  function interactiveSignIn() {
    changeState(STATE_ACQUIRING_AUTHTOKEN);

    // @corecode_begin getAuthToken
    // @description This is the normal flow for authentication/authorization
    // on Google properties. You need to add the oauth2 client_id and scopes
    // to the app manifest. The interactive param indicates if a new window
    // will be opened when the user is not yet authenticated or not.
    // @see http://developer.chrome.com/apps/app_identity.html
    // @see http://developer.chrome.com/apps/identity.html#method-getAuthToken
    chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
      if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError);
        changeState(STATE_START);
      } else {
        console.log('Token acquired:'+token+
          '. See chrome://identity-internals for details.');
        changeState(STATE_AUTHTOKEN_ACQUIRED);
      }
    });
    // @corecode_end getAuthToken
  }

  function revokeToken() {
    chrome.identity.getAuthToken({ 'interactive': false },
      function(current_token) {
        if (!chrome.runtime.lastError) {

          // @corecode_begin removeAndRevokeAuthToken
          // @corecode_begin removeCachedAuthToken
          // Remove the local cached token
          chrome.identity.removeCachedAuthToken({ token: current_token },
            function() {});
          // @corecode_end removeCachedAuthToken

          // Make a request to revoke token in the server
          var xhr = new XMLHttpRequest();
          xhr.open('GET', 'https://accounts.google.com/o/oauth2/revoke?token=' +
                   current_token);
          xhr.send();
          // @corecode_end removeAndRevokeAuthToken
          showSnackbar("Logged Out.");
          // Update the user interface accordingly
          console.log('Token revoked and removed from cache. '+
            'Check chrome://identity-internals to confirm.');
        }
    });
  }

  return {
    onload: function () {
      signin_button = document.getElementById('authorize_button');
      signin_button.addEventListener('click', interactiveSignIn);

      revoke_button = document.getElementById('signout_button');
      revoke_button.addEventListener('click', revokeToken);

    }
  };

})();

window.onload = googleProfileUserLoader.onload;
