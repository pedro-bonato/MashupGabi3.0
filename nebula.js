// nebula_integration.js

// Importamos a função 'embed' do Nebula, como antes.
import { embed } from "https://esm.sh/@nebula.js/stardust";

// --- CONFIGURAÇÃO PARA OS OBJETOS NEBULA ---
// Defina aqui qual App e Objeto você quer renderizar com Nebula.
// Usei os mesmos do <qlik-embed> que substituímos como exemplo.
const NEBULA_APP_ID = "e84c7d4c-b8c1-40a6-b3c2-1df068af26fc";
const NEBULA_OBJECT_ID = "AUAXLqT";
const NEBULA_TARGET_DIV_ID = "nebula-gestao-recursos";

// A função principal que será executada
async function runNebula() {
  try {
    console.log("Aguardando o serviço Qlik Embed ficar pronto...");

    // 1. Espera a biblioteca qlik-embed (carregada no head) ficar pronta e autenticada.
    // O 'qlik' é um objeto global que a biblioteca cria.
    const qlik = await window.qlik.getService();

    console.log("Serviço Qlik pronto. Abrindo o app para o Nebula...");
    
    // 2. Com o serviço autenticado, pedimos para ele abrir uma conexão com o app específico
    // que queremos usar para os nossos gráficos Nebula.
    const app = await qlik.openApp(NEBULA_APP_ID);

    console.log("App aberto com sucesso. Entregando para o Nebula.js.");

    // 3. Com o objeto 'app' em mãos, o resto é o fluxo padrão do Nebula.
    const n = embed(app);

    // 4. Renderiza o objeto desejado na nossa <div> alvo.
    n.render({
      element: document.getElementById(NEBULA_TARGET_DIV_ID),
      id: NEBULA_OBJECT_ID,
    });

    console.log(`Gráfico ${NEBULA_OBJECT_ID} renderizado com Nebula!`);

  } catch (error) {
    console.error("Ocorreu um erro ao integrar o Nebula.js:", error);
  }
}

// Inicia todo o processo.
runNebula();