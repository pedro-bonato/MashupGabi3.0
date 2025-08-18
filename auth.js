window.addEventListener('load', async () => {
  // Pega referência dos elementos
  const loginScreen = document.getElementById('login-screen');
  const loginButton = document.getElementById('login-button');
  const mainContent = document.querySelector('.wrap');
  const header = document.querySelector('.page-header');

  // Garante que o botão de login existe antes de adicionar o evento
  if (loginButton) {
    loginButton.addEventListener('click', () => {
      if (window.qlik) {
        window.qlik.login();
      }
    });
  }

  // Verifica se a biblioteca Qlik está pronta
  if (window.qlik) {
    try {
      const isAuthenticated = await window.qlik.isAuthenticated();
      
      if (isAuthenticated) {
        // Se JÁ ESTÁ AUTENTICADO: esconde a tela de login e mostra o conteúdo
        console.log("Usuário já autenticado. Exibindo conteúdo.");
        loginScreen.style.display = 'none';
        header.style.display = 'block'; // ou 'flex'
        mainContent.style.display = 'block'; // ou 'flex'
      } else {
        // Se NÃO ESTÁ AUTENTICADO: garante que a tela de login esteja visível
        console.log("Usuário não autenticado. Exibindo tela de login.");
        loginScreen.style.display = 'flex';
      }
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
      // Poderíamos mostrar uma mensagem de erro na tela de login aqui
    }
  } else {
    console.error("Biblioteca Qlik Embed não foi carregada.");
    // Poderíamos mostrar uma mensagem de erro na tela de login aqui
  }
});