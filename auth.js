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
          authButton.style.display = "none";
          
          // Chama a função resolve() para sinalizar à biblioteca do Qlik
          // que a confirmação do usuário foi dada e o redirecionamento pode prosseguir.
          resolve();
        }, { once: true });
      });
    }