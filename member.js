// FB Graph API
const FB_APP_ID = "284650289333471";
const FB_JS_SDK_VERSION = "v7.0";

// load FB JS SDK
window.fbAsyncInit = function () {
  FB.init({
    appId: FB_APP_ID,
    cookie: true,
    xfbml: true,
    version: FB_JS_SDK_VERSION,
  });
};

(function (d, s, id) {
  var js,
    fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
    return;
  }
  js = d.createElement(s);
  js.id = id;
  js.src = "https://connect.facebook.net/zh_TW/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
})(document, "script", "facebook-jssdk");

// require permission
const loginPermission = "public_profile, email";

// add button click event to profile page
const member = document.querySelector(".member");
const mobileMember = document.querySelector(".sidebar__member");
[member, mobileMember].forEach((btn) =>
  btn.addEventListener("click", () => {
    fbcheckLoginStatus(
      (authResponse) => (window.location = "./profile.html"),
      () =>
        fbLogin(
          loginPermission,
          (authResponse) => (window.location = "./profile.html"),
          () => console.log("User cancelled login or did not fully authorize.")
        )
    );
  })
);

function fbcheckLoginStatus(callbackIfConnected, callbackIfNotConnected) {
  FB.getLoginStatus((response) => {
    if (response.status === "connected") {
      callbackIfConnected(response.authResponse);
    } else {
      callbackIfNotConnected();
    }
  });
}

function fbLogin(loginPermission, callbackIfLogin, callbackIfNotLogin) {
  FB.login(
    (response) => {
      if (response.authResponse) {
        callbackIfLogin(response.authResponse);
      } else {
        callbackIfNotLogin();
      }
    },
    { scope: loginPermission }
  );
}

// sing in with FB access token, get API access token from server and save it to local storage
function userFBSignin(FBAccessToken, successCallback) {
  postData(
    `https://${HOST_NAME}/api/${API_VERSION}/user/signin`,
    { provider: "facebook", access_token: FBAccessToken },
    (response) => {
      successCallback(response);
    },
    (error) =>
      console.log(`Error: ${error.status} Error Message: ${error.statusText}`),
    { "Content-Type": "application/json" }
  );
}
