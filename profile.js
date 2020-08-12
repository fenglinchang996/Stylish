function getUserInfo() {
  fbcheckLoginStatus(
    (authResponse) => {
      userFBSignin(authResponse.accessToken, (response) => {
        const access_token = response.data.access_token;
        getData(
          `https://${HOST_NAME}/api/${API_VERSION}/user/profile`,
          (result) => {
            const user = result.data;
            renderUserInfo(user.name, user.email);
            renderUserPic(user.picture);
          },
          (error) =>
            console.log(
              `Error: ${error.status} Error Message: ${error.statusText}`
            ),
          { Authorization: `Bearer ${access_token}` }
        );
      });
    },
    () => console.log("User do not login with facebook")
  );
}

function renderUserInfo(name, email) {
  const userName = document.querySelector(".user-name");
  userName.textContent = name;
  const userEmail = document.querySelector(".user-email");
  userEmail.textContent = email;
}

function renderUserPic(url) {
  const userPicture = document.querySelector(".user-picture");
  let userPictureImg = document.createElement("img");
  userPictureImg.src = url;
  userPicture.appendChild(userPictureImg);
}

window.fbAsyncInit = function () {
  FB.init({
    appId: FB_APP_ID,
    cookie: true,
    xfbml: true,
    version: FB_JS_SDK_VERSION,
  });
  getUserInfo();
};
