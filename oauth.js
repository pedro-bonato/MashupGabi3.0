// Conteúdo para o arquivo auth.js

window.onload = async () => {
  // Pega a referência dos elementos na página
  const loadingIndicator = document.getElementById('loading-indicator');
  const mainContent = document.querySelector('.wrap');

  // Adicionamos o 'header' para poder escondê-lo também
  const header = document.querySelector('.page-header');

  if (window.qlik) {
    try {
      const isAuthenticated = await window.qlik.isAuthenticated();
      
      if (isAuthenticated) {
        // Se JÁ ESTÁ AUTENTICADO:
        console.log("Usuário já autenticado. Exibindo conteúdo.");
        // 1. Esconde o indicador de carregamento
        loadingIndicator.style.display = 'none';
        // 2. Mostra o conteúdo principal e o cabeçalho
        header.style.display = 'block'; // ou 'flex', dependendo do seu CSS
        mainContent.style.display = 'block'; 
      } else {
        // Se NÃO ESTÁ AUTENTICADO:
        console.log("Usuário não autenticado. Redirecionando para login...");
        // O indicador de carregamento continua visível, mas o header fica escondido
        header.style.display = 'none';
        // Redireciona para a página de login do Qlik
        window.qlik.login();
      }
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
      loadingIndicator.textContent = 'Ocorreu um erro ao tentar autenticar.';
    }
  } else {
    // Atraso para dar mais uma chance da biblioteca carregar
    setTimeout(() => {
      if (!window.qlik) {
        console.error("Biblioteca Qlik Embed não foi carregada.");
        loadingIndicator.textContent = 'Erro ao carregar os componentes.';
      } else {
        // Se carregou nesse meio tempo, tenta a autenticação novamente
         window.location.reload();
      }
    }, 1000); // Espera 1 segundo
  }
};