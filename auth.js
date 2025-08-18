// Arquivo auth.js (Versão Final com a Correção para a Condição de Corrida)

// ========================================================================
// FUNÇÃO QUE A QLIK CHAMA QUANDO PRECISA DE LOGIN
// ========================================================================
function showCustomLoginPrompt(authorize) {
  console.log("Qlik pediu confirmação. Preparando o botão de login.");

  const loginScreen = document.getElementById('login-screen');
  const loginButton = document.getElementById('login-button');

  // Mostra nossa tela de login (caso ainda não esteja visível)
  loginScreen.style.display = 'flex';

  // Define o que acontece quando o nosso botão é clicado
  loginButton.onclick = () => {
    console.log("Botão de login personalizado foi clicado. Autorizando...");
    loginScreen.style.display = 'none'; // Feedback visual
    authorize(); // Inicia o redirecionamento para o login da Qlik
  };
}

// ========================================================================
// LÓGICA PRINCIPAL QUE RODA APÓS O CARREGAMENTO DA PÁGINA
// ========================================================================
window.addEventListener('load', () => {
  // Damos um pequeno atraso (ex: 200 milissegundos) para garantir
  // que a biblioteca da Qlik já inicializou e leu o token da sessão.
  setTimeout(async () => {
    if (window.qlik) {
      try {
        const isAuthenticated = await window.qlik.isAuthenticated();
        
        if (isAuthenticated) {
          // SE O USUÁRIO ESTÁ LOGADO: Esconde a tela de login e mostra o conteúdo.
          console.log("Usuário autenticado. Exibindo conteúdo principal.");
          document.getElementById('login-screen').style.display = 'none';
          document.querySelector('.page-header').style.display = 'block';
          document.querySelector('.wrap').style.display = 'block';
        } else {
          // SE O USUÁRIO NÃO ESTÁ LOGADO: Mostra a tela de login.
          // A Qlik irá chamar 'showCustomLoginPrompt' para ativar o botão.
          console.log("Usuário não autenticado. Exibindo tela de login.");
          document.getElementById('login-screen').style.display = 'flex';
        }
      } catch (error) {
        console.error("Erro durante a verificação de autenticação:", error);
      }
    } else {
      console.error("A biblioteca Qlik não foi carregada. Verifique a CSP e a conexão.");
    }
  }, 2000); // Atraso de 200ms
});