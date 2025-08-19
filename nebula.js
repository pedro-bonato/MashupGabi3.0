// nebula.js (VERSÃO CORRIGIDA FINAL)

// ALTERADO: Usando um CDN (esm.sh) que é compatível com módulos e não causa erro de CORS.
import { embed } from "https://esm.sh/@nebula.js/stardust";
import enigma from "https://esm.sh/enigma.js";

// CORRIGIDO: Voltamos a usar 'fetch' para carregar o schema, que é a forma correta no navegador.
const schema = await (await fetch("https://unpkg.com/enigma.js/schemas/12.612.0.json")).json();

const appId = "e84c7d4c-b8c1-40a6-b3c2-1df068af26fc";
const qlikHost = "msryx1okj1jicf6.us.qlikcloud.com";

// Função para abrir popup de login e obter token
async function iniciarAutorizacao() {
  return new Promise((resolve, reject) => {
    const authWindow = window.open(
      `https://${qlikHost}/login?redirect_uri=${window.location.origin}/auth-callback.html`,
      "_blank",
      "width=600,height=600"
    );

    const listener = (event) => {
      if (event.origin === window.location.origin && event.data?.qlikToken) {
        window.removeEventListener("message", listener);
        authWindow.close();
        resolve(event.data.qlikToken);
      }
    };

    window.addEventListener("message", listener);
  });
}

// Verifica token ou faz login
async function obterToken() {
  let token = sessionStorage.getItem("qlik-token");
  if (!token) {
    token = await iniciarAutorizacao();
    sessionStorage.setItem("qlik-token", token);
  }
  return token;
}

// Inicializa Nebula com Enigma
async function iniciarNebula(token) {
  try {
    const session = enigma.create({
      schema,
      url: `wss://${qlikHost}/app/${appId}`,
      createSocket: (url) =>
        new WebSocket(url, {
          headers: { Authorization: `Bearer ${token}` },
        }),
    });

    const global = await session.open();
    const app = await global.openDoc(appId);

    const n = embed(app);

    // Lembre-se de usar os IDs corretos dos seus objetos Qlik
    n.render({ element: document.getElementById("chart1"), id: "AUAXLqT" });
    n.render({ element: document.getElementById("chart2"), id: "XXXXXXX" });
    n.render({ element: document.getElementById("chart3"), id: "YYYYYYY" });
    n.render({ element: document.getElementById("chart4"), id: "ZZZZZZZ" });

  } catch (err) {
    console.error("Erro carregando Nebula:", err);
    document.body.innerHTML = `<h1>Ocorreu um erro ao conectar com o Qlik</h1><pre>${err.message}</pre>`;
  }
}

// Executa fluxo
(async () => {
  try {
    const token = await obterToken();
    await iniciarNebula(token);
  } catch (error) {
    console.error("Falha no fluxo de autenticação:", error);
  }
})();