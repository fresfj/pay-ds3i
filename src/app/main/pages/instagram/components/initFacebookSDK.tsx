const FACEBOOK_APP_ID = "413123871058799";

export default function initFacebookSDK(): Promise<void> {
  return new Promise((resolve) => {
    // Aguarda a inicialização do SDK do Facebook antes de iniciar o app React.
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: "v20.0",
      });

      resolve();
    };

    // Carregar o SDK do Facebook dinamicamente
    (function (d, s, id) {
      let js: HTMLScriptElement | null = d.getElementById(id) as HTMLScriptElement;
      const fjs = d.getElementsByTagName(s)[0];
      if (js) {
        return;
      }
      js = d.createElement(s) as HTMLScriptElement;
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode?.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  });
}
