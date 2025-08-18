/**
 * auth.js
 * Módulo para gerenciar o fluxo de autenticação personalizado com qlik-embed.
 */

let qlikAuthRedirect = null;

window.showCustomLoginPrompt = function(authorize) {
  console.log("Callback de confirmação do usuário recebida da qlik-embed.");
  qlikAuthRedirect = authorize;
};

/**
 * Função única para realizar a transição da UI do estado de login para o de dashboard.
 * Esconde a tela de login e mostra os contêineres principais.
 */
function switchToDashboardView() {
  const loginScreen = document.getElementById('login-screen');
  const pageHeader = document.querySelector('.page-header');
  const mainWrap = document.querySelector('.wrap');

  if (loginScreen) {
    loginScreen.style.display = 'none';
  }
  if (pageHeader) {
    pageHeader.style.display = 'flex';
  }
  if (mainWrap) {
    mainWrap.style.display = 'block';
  }
}

/**
 * Procura de forma robusta pelo token de acesso do Qlik no sessionStorage.
 * Em vez de construir a chave manualmente, ele varre o storage em busca do padrão correto.
 * @returns {string|null} O token de acesso, se encontrado; caso contrário, null.
 */
function findQlikAccessToken() {
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    // A chave do token sempre começa com este prefixo
    if (key && key.startsWith('qlik-sdk-access-token-')) {
      console.log('Token de acesso do Qlik encontrado com a chave:', key);
      return sessionStorage.getItem(key);
    }
  }
  return null;
}

document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.getElementById('login-button');
  const firstQlikEmbed = document.querySelector('qlik-embed');

  // Configura o listener do botão de login.
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

  // --- LÓGICA PRINCIPAL DE AUTENTICAÇÃO ---
  const accessToken = findQlikAccessToken();

  if (accessToken) {
    // CENÁRIO 1: Usuário JÁ ESTÁ AUTENTICADO
    console.log("Token de acesso encontrado. Trocando para a visão do dashboard.");
    
    // Realiza a troca da UI imediatamente para evitar a tela em branco ou o "piscar" da tela de login.
    switchToDashboardView();

    // O MutationObserver agora só precisa se preocupar em inicializar o carrossel.
    if (firstQlikEmbed) {
      const observer = new MutationObserver((mutationsList, obs) => {
        for (const mutation of mutationsList) {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            console.log("Renderização de conteúdo Qlik detectada. Inicializando o carrossel.");
            if (typeof window.initCarousel === 'function') {
              window.initCarousel();
            }
            obs.disconnect(); // Desconecta após o sucesso.
            return;
          }
        }
      });
      observer.observe(firstQlikEmbed, { childList: true });
    }
  } else {
    // CENÁRIO 2: Usuário PRECISA FAZER LOGIN
    // Não fazemos nada, a tela de login já está visível por padrão via CSS.
    console.log("Nenhum token de acesso encontrado. Aguardando interação do usuário.");
  }
});