// Arquivo auth.js (Versão Final e Robusta)

/**
 * Esta função é um "vigia". Ela fica verificando se window.qlik existe.
 * Ela só prossegue quando encontra, ou desiste após 5 segundos.
 * @returns {Promise<boolean>}
 */
function waitForQlik() {
  return new Promise((resolve, reject) => {
    let counter = 0;
    const interval = setInterval(() => {
      // Se encontrou o objeto qlik, para de procurar e avisa que deu certo.
      if (window.qlik) {
        clearInterval(interval);
        resolve(true);
      }
      // Se não encontrou após 100 tentativas (5 segundos), desiste.
      counter++;
      if (counter >= 100) {
        clearInterval(interval);
        reject(new Error("Timeout: A biblioteca da Qlik demorou muito para carregar."));
      }
    }, 50); // Verifica a cada 50 milissegundos
  });
}

// ========================================================================
// FUNÇÃO QUE A QLIK CHAMA QUANDO PRECISA DE LOGIN
// (Esta parte não muda)
// ========================================================================
function showCustomLoginPrompt(authorize) {
  console.log("Qlik pediu confirmação. Preparando o botão de login.");
  const loginScreen = document.getElementById('login-screen');
  const loginButton = document.getElementById('login-button');

  loginScreen.style.display = 'flex';

  loginButton.onclick = () => {
    console.log("Botão de login personalizado foi clicado. Autorizando...");
    loginScreen.style.display = 'none';
    authorize();
  };
}

// ========================================================================
// LÓGICA PRINCIPAL QUE RODA APÓS O CARREGAMENTO DA PÁGINA
// (Agora usando nosso "vigia")
// ========================================================================
window.addEventListener('load', async () => {
  console.log("Página carregada. Aguardando a biblioteca Qlik...");

  try {
    // 1. Espera pacientemente a biblioteca Qlik ficar pronta.
    await waitForQlik();
    console.log("Biblioteca Qlik está pronta!");

    // 2. Agora que temos certeza que window.qlik existe, continuamos.
    const isAuthenticated = await window.qlik.isAuthenticated();
    
    if (isAuthenticated) {
      // SE O USUÁRIO ESTÁ LOGADO: Mostra o conteúdo.
      console.log("Usuário autenticado. Exibindo conteúdo principal.");
      document.getElementById('login-screen').style.display = 'none';
      document.querySelector('.page-header').style.display = 'block';
      document.querySelector('.wrap').style.display = 'block';
    } else {
      // SE O USUÁRIO NÃO ESTÁ LOGADO: Mostra a tela de login.
      console.log("Usuário não autenticado. Exibindo tela de login.");
      document.getElementById('login-screen').style.display = 'flex';
    }
  } catch (error) {
    // Se o "vigia" desistir ou outro erro acontecer, mostramos no console.
    console.error("Erro no processo de inicialização:", error);
    document.getElementById('login-screen').innerHTML = "<h1>Erro crítico ao carregar a aplicação.</h1>";
    document.getElementById('login-screen').style.display = 'flex';
  }
});