/**
 * auth.js
 * Módulo para gerenciar o fluxo de autenticação personalizado com qlik-embed.
 */

let qlikAuthRedirect = null;

window.showCustomLoginPrompt = function(authorize) {
  console.log("Callback de confirmação do usuário recebida da qlik-embed.");
  qlikAuthRedirect = authorize;
};

function showMainContent() {
  const pageHeader = document.querySelector('.page-header');
  const mainWrap = document.querySelector('.wrap');
  
  if (pageHeader) pageHeader.style.display = 'flex';
  if (mainWrap) mainWrap.style.display = 'block';

  if (typeof window.initCarousel === 'function') {
    console.log("UI principal visível. Inicializando o carrossel...");
    window.initCarousel();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const loginScreen = document.getElementById('login-screen');
  const loginButton = document.getElementById('login-button');
  const firstQlikEmbed = document.querySelector('qlik-embed');

  const host = "https://msryx1okj1jicf6.us.qlikcloud.com";
  const clientId = "09d86c449ca034586e04fb47e3b5703e";
  const tokenKey = `qlik-sdk-access-token-${host}-${clientId}`;
  const accessToken = sessionStorage.getItem(tokenKey);

  // Configura o event listener para o botão de login.
  if (loginButton) {
    loginButton.addEventListener('click', () => {
      console.log("Botão de login personalizado foi clicado.");
      if (typeof qlikAuthRedirect === 'function') {
        console.log("Iniciando o fluxo de autorização do Qlik.");
        qlikAuthRedirect();
      } else {
        console.error("A função de autorização do Qlik não está disponível.");
      }
    });
  }

  // --- INÍCIO DA CORREÇÃO LÓGICA ---
  if (accessToken) {
    // CENÁRIO 1: Usuário JÁ ESTÁ AUTENTICADO
    console.log("Token de acesso encontrado. Ocultando a tela de login.");
    if (loginScreen) {
      loginScreen.style.display = 'none';
    }

    // Apenas neste cenário ativamos o MutationObserver para esperar a renderização.
    if (firstQlikEmbed) {
      const observer = new MutationObserver((mutationsList, obs) => {
        for (const mutation of mutationsList) {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            console.log("Renderização de conteúdo Qlik detectada. Exibindo o dashboard.");
            showMainContent();
            obs.disconnect();
            return;
          }
        }
      });
      observer.observe(firstQlikEmbed, { childList: true });
    }
  } else {
    // CENÁRIO 2: Usuário PRECISA FAZER LOGIN
    // A tela de login já está visível por padrão via CSS.
    // Não fazemos nada e apenas esperamos o clique no botão.
    // O MutationObserver NÃO é ativado.
    console.log("Nenhum token de acesso encontrado. Aguardando interação do usuário.");
  }
  // --- FIM DA CORREÇÃO LÓGICA ---
});