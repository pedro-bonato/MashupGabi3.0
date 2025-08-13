// Função auto-executável para encapsular nosso código
(async () => {
  // Espera o evento 'qlik-embed:loaded', que é disparado pela biblioteca
  // quando ela está pronta para ser usada. Isso evita erros de timing.
  await new Promise((resolve) => window.addEventListener("qlik-embed:loaded", resolve));

  // Configura a conexão com o Qlik Cloud
  const config = {
    host: "msryx1okj1jicf6.us.qlikcloud.com",
    clientId: "a809f137be42c7c2b91d60ca9fca46fa",
    redirectUri: "https://pedro-bonato.github.io/MashupGabi3.0/index.html",
    authType: "Oauth2",
    autoRedirect: true,
    // ID do aplicativo que contém os objetos
    appId: "e84c7d4c-b8c1-40a6-b3c2-1df068af26fc", 
  };

  // Inicializa a biblioteca, que lida com o login e o redirecionamento
  const qlikEmbed = await window.qlikEmbed(config);
  
  // Manda a biblioteca renderizar todos os objetos no HTML
  // que possuem o atributo "data-qlik-obj-id"
  qlikEmbed.render();
  
})();