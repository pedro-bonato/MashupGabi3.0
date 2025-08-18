/**
 * auth.js
 * Módulo para gerenciar o fluxo de autenticação personalizado com qlik-embed.
 * 
 * Este script implementa duas funcionalidades principais:
 * 1. Captura o gatilho de autorização fornecido pela qlik-embed através da função global
 *    `showCustomLoginPrompt` e o associa a um botão de login personalizado.
 * 2. Monitora a renderização do conteúdo Qlik após a autenticação para realizar a transição
 *    da UI, ocultando a tela de login e exibindo o dashboard principal.
 */

// Variável de escopo superior para armazenar a função de callback de autorização da Qlik.
// Isso permite que o event listener do botão acesse a função que é recebida
// de forma assíncrona pela `showCustomLoginPrompt`.
let qlikAuthRedirect = null;

/**
 * Função global que é invocada pela biblioteca qlik-embed.
 * O nome desta função deve corresponder ao valor do atributo `data-auth-redirect-user-confirmation`.
 * @param {function} authorize - A função de callback fornecida pela qlik-embed para iniciar o fluxo de autenticação.
 */
window.showCustomLoginPrompt = function(authorize) {
  console.log("Callback de confirmação do usuário recebida da qlik-embed.");
  // Armazena a função de autorização para uso posterior pelo clique do botão.
  qlikAuthRedirect = authorize;
};

/**
 * Função para gerenciar a transição da UI após a autenticação bem-sucedida.
 * Oculta a tela de login e exibe os elementos principais da página.
 */
function showMainContent() {
  const loginScreen = document.getElementById('login-screen');
  const pageHeader = document.querySelector('.page-header');
  const mainWrap = document.querySelector('.wrap');

  if (loginScreen) {
    // Utiliza uma transição suave para uma melhor experiência do usuário, se desejado.
    loginScreen.style.opacity = '0';
    setTimeout(() => {
      loginScreen.style.display = 'none';
    }, 300); // Duração corresponde a uma transição CSS
  }
  
  if (pageHeader) pageHeader.style.display = 'flex'; // ou 'block'
  if (mainWrap) mainWrap.style.display = 'block';
}

// Aguarda o carregamento completo do DOM para garantir que todos os elementos HTML estejam disponíveis.
document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.getElementById('login-button');
  const loginScreen = document.getElementById('login-screen');
  const firstQlikEmbed = document.querySelector('qlik-embed');

  // Configura o event listener para o botão de login.
  if (loginButton) {
    loginButton.addEventListener('click', () => {
      console.log("Botão de login personalizado foi clicado.");
      // Verifica se a função de redirecionamento já foi capturada.
      if (typeof qlikAuthRedirect === 'function') {
        console.log("Iniciando o fluxo de autorização do Qlik.");
        qlikAuthRedirect();
      } else {
        // Este log de erro pode ajudar a diagnosticar problemas de configuração.
        console.error("A função de autorização do Qlik não está disponível. Verifique a configuração da qlik-embed.");
      }
    });
  }

  // Se o primeiro componente qlik-embed existir, configura o MutationObserver.
  // Isso é necessário para detectar quando a renderização do conteúdo Qlik começa.
  if (firstQlikEmbed) {
    const observer = new MutationObserver((mutationsList, obs) => {
      // Itera sobre as mutações detectadas.
      for (const mutation of mutationsList) {
        // Estamos interessados especificamente na adição de nós filhos ao elemento qlik-embed.
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          console.log("Renderização de conteúdo Qlik detectada. Exibindo o dashboard.");
          // Chama a função para transicionar a UI.
          showMainContent();
          // Desconecta o observador, pois sua tarefa está concluída. Isso evita execuções desnecessárias.
          obs.disconnect();
          return; // Encerra a execução da callback.
        }
      }
    });

    // Inicia a observação no elemento qlik-embed, focando em mudanças na lista de filhos.
    observer.observe(firstQlikEmbed, { childList: true });
  }

  // Verificação inicial: se a tela de login não estiver visível por padrão,
  // pode significar que o usuário já está autenticado (token na sessão).
  // Neste caso, o MutationObserver cuidará de mostrar o conteúdo quando ele renderizar.
  // Se a tela de login estiver visível, o fluxo de clique do usuário é esperado.
  if (window.getComputedStyle(loginScreen).display!== 'none') {
      console.log("Tela de login visível. Aguardando interação do usuário.");
  }
});