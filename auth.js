// ========================================================================
// PARTE 1: A FUNÇÃO QUE A QLIK VAI CHAMAR AUTOMATICAMENTE
// O nome "showCustomLoginPrompt" deve ser o mesmo que você colocou no
// atributo data-auth-redirect-user-confirmation.
// ========================================================================
function showCustomLoginPrompt(authorize) {
  console.log("Qlik pediu confirmação do usuário. Mostrando tela de login personalizada.");

  // Pega os elementos da nossa tela de login
  const loginScreen = document.getElementById('login-screen');
  const loginButton = document.getElementById('login-button');

  // Garante que a tela de login esteja visível
  loginScreen.style.display = 'flex';

  // Define o que acontece quando NOSSO botão é clicado
  loginButton.onclick = () => {
    console.log("Botão de login personalizado foi clicado. Autorizando o redirecionamento...");
    // Esconde a tela para o usuário ver que algo aconteceu
    loginScreen.style.display = 'none';
    
    // Chama a função 'authorize()' que a Qlik nos deu.
    // ESTA É A LINHA QUE INICIA O REDIRECIONAMENTO PARA O LOGIN DA QLIK.
    authorize();
  };
}

// ========================================================================
// PARTE 2: LÓGICA PARA QUANDO A PÁGINA CARREGA
// Ainda precisamos disso para o caso de o usuário já ter uma sessão válida
// e não precisar ver a tela de login.
// ========================================================================
window.addEventListener('load', async () => {
  const loginScreen = document.getElementById('login-screen');
  const mainContent = document.querySelector('.wrap');
  const header = document.querySelector('.page-header');

  if (window.qlik) {
    const isAuthenticated = await window.qlik.isAuthenticated();
    if (isAuthenticated) {
      // Se o usuário já está logado, esconde a tela de login
      // e mostra o conteúdo principal imediatamente.
      console.log("Usuário já autenticado na entrada. Exibindo conteúdo.");
      loginScreen.style.display = 'none';
      header.style.display = 'block';
      mainContent.style.display = 'block';
    } else {
      // Se não está autenticado, não fazemos nada.
      // A própria biblioteca da Qlik irá chamar a função 'showCustomLoginPrompt'
      // quando tentar renderizar um gráfico.
      console.log("Usuário não autenticado. Aguardando a Qlik chamar o prompt.");
    }
  }
});