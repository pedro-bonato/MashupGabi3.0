 function iniciarAutorizacao() {
      // A função deve retornar uma Promise. A biblioteca do Qlik aguardará
      // a resolução desta Promise antes de redirecionar o usuário.
      return new Promise((resolve) => {
        const authButton = document.getElementById('auth-button');

        // Adiciona um ouvinte de evento de clique ao botão.
        // A opção { once: true } garante que o ouvinte seja removido após o primeiro clique,
        // evitando múltiplos acionamentos.
        authButton.addEventListener('click', () => {
          // Fornece feedback visual ao usuário antes do redirecionamento.
          authButton.textContent = 'Redirecionando para autorização...';
          authButton.disabled = true;
          
          // Chama a função resolve() para sinalizar à biblioteca do Qlik
          // que a confirmação do usuário foi dada e o redirecionamento pode prosseguir.
          resolve();
        }, { once: true });
      });
    }

        // Função para mostrar o conteúdo principal e esconder o botão
    function showMainContent() {
      const authContainer = document.getElementById('auth-container');
      const mainContent = document.getElementById('main-content');

      if (authContainer && mainContent) {
        // Esconde o container do botão
        authContainer.style.display = 'none';
        // Mostra o container do conteúdo principal
        mainContent.style.display = 'block';
      }
      
      // Importante: Remove o "ouvinte" do evento para que esta função não seja chamada novamente
      // para cada objeto Qlik que renderizar na página.
      document.removeEventListener('qlik-embed:render', showMainContent);
    }

    // Adiciona um "ouvinte" que espera pelo evento 'qlik-embed:render'.
    // Este evento é disparado pela biblioteca do Qlik assim que um objeto 
    // é renderizado com sucesso (o que só acontece após a autorização).
    document.addEventListener('qlik-embed:render', showMainContent);