/**
 * auth.js
 * Módulo para gerenciar o fluxo de autenticação personalizado com qlik-embed.
 * 
 * Este script implementa três funcionalidades principais:
 * 1. Verifica a existência de um token de acesso no sessionStorage ao carregar a página
 *    para evitar loops de redirecionamento após o login.
 * 2. Captura o gatilho de autorização fornecido pela qlik-embed através da função global
 *    `showCustomLoginPrompt` e o associa a um botão de login personalizado.
 * 3. Monitora a renderização do conteúdo Qlik após a autenticação para realizar a transição
 *    da UI, ocultando a tela de login e exibindo o dashboard principal.
 */

// Variável de escopo superior para armazenar a função de callback de autorização da Qlik.
let qlikAuthRedirect = null;

/**
 * Função global que é invocada pela biblioteca qlik-embed.
 * O nome desta função deve corresponder ao valor do atributo `data-auth-redirect-user-confirmation`.
 * @param {function} authorize - A função de callback fornecida pela qlik-embed para iniciar o fluxo de autenticação.
 */
window.showCustomLoginPrompt = function(authorize) {
  console.log("Callback de confirmação do usuário recebida da qlik-embed.");
  qlikAuthRedirect = authorize;
};

/**
 * Função para gerenciar a transição da UI, exibindo os elementos principais da página.
 */
function showMainContent() {
  const pageHeader = document.querySelector('.page-header');
  const mainWrap = document.querySelector('.wrap');
  
  if (pageHeader) pageHeader.style.display = 'flex';
  if (mainWrap) mainWrap.style.display = 'block';
}

// Aguarda o carregamento completo do DOM.
document.addEventListener('DOMContentLoaded', () => {
  const loginScreen = document.getElementById('login-screen');
  const loginButton = document.getElementById('login-button');
  const firstQlikEmbed = document.querySelector('qlik-embed');

  // --- INÍCIO DA CORREÇÃO DO LOOP ---
  // A chave do token é construída pela biblioteca qlik-embed usando o host e o client-id.
  // É crucial que os valores aqui sejam exatamente os mesmos da sua tag <script> de configuração.
  const host = "https://msryx1okj1jicf6.us.qlikcloud.com";
  const clientId = "09d86c449ca034586e04fb47e3b5703e";
  const tokenKey = `qlik-sdk-access-token-${host}-${clientId}`;
  const accessToken = sessionStorage.getItem(tokenKey);

  if (accessToken) {
    // Se um token de acesso já existe, o usuário está autenticado.
    // Escondemos a tela de login imediatamente para prevenir o loop e o "flash" da tela de login.
    console.log("Token de acesso encontrado no sessionStorage. Ocultando a tela de login.");
    if (loginScreen) {
      loginScreen.style.display = 'none';
    }
  }
  // --- FIM DA CORREÇÃO DO LOOP ---

  // Configura o event listener para o botão de login (só será usado se não houver token).
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

  // Configura o MutationObserver para detectar quando o conteúdo Qlik é renderizado.
  // Isso funciona tanto no primeiro login quanto em recarregamentos de página com token já existente.
  if (firstQlikEmbed) {
    const observer = new MutationObserver((mutationsList, obs) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          console.log("Renderização de conteúdo Qlik detectada. Exibindo o dashboard.");
          showMainContent();
          obs.disconnect(); // A tarefa está concluída, podemos parar de observar.
          return;
        }
      }
    });

    observer.observe(firstQlikEmbed, { childList: true });
  }
});