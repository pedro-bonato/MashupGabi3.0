// Arquivo auth.js (Versão Final)

// ========================================================================
// FUNÇÃO QUE A QLIK CHAMA QUANDO PRECISA DE LOGIN
// ========================================================================
function showCustomLoginPrompt(authorize) {
  console.log("Qlik pediu confirmação. Mostrando tela de login personalizada.");

  const loginScreen = document.getElementById('login-screen');
  const loginButton = document.getElementById('login-button');

  // Mostra nossa tela de login
  loginScreen.style.display = 'flex';

  // Define o que acontece quando o nosso botão é clicado
  loginButton.onclick = () => {
    console.log("Botão de login personalizado foi clicado. Autorizando...");
    loginScreen.style.display = 'none'; // Feedback visual para o usuário
    
    // Chama a função 'authorize()' que a Qlik nos deu para iniciar o login
    authorize();
  };
}

// ========================================================================
// LÓGICA QUE RODA NO CARREGAMENTO DA PÁGINA
// (Para o caso de o usuário já estar logado)
// ========================================================================
window.addEventListener('load', async () => {
  if (window.qlik) {
    try {
      const isAuthenticated = await window.qlik.isAuthenticated();
      if (isAuthenticated) {
        console.log("Usuário já autenticado. Exibindo conteúdo.");
        document.getElementById('login-screen').style.display = 'none';
        document.querySelector('.page-header').style.display = 'block';
        document.querySelector('.wrap').style.display = 'block';
      } else {
        console.log("Usuário não autenticado. Aguardando Qlik pedir confirmação.");
      }
    } catch (error) {
      console.error("Erro ao verificar autenticação inicial:", error);
    }
  } else {
    console.error("A biblioteca Qlik não foi carregada. Verifique a CSP e a conexão.");
  }
});