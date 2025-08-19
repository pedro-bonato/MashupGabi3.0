// nebula.js (VERSÃO FINAL COM POP-UP)

import { embed } from "https://esm.sh/@nebula.js/stardust";
import enigma from "https://esm.sh/enigma.js";
const schema = await (await fetch("https://unpkg.com/enigma.js/schemas/12.612.0.json")).json();

const appId = "12a47edf-0720-4f61-9cd7-209ec32eadfc"; 
const qlikHost = "msryx1okj1jicf6.us.qlikcloud.com";

// Função para abrir pop-up de login
async function iniciarAutorizacao() {
  return new Promise((resolve, reject) => {
    // ALTERAÇÃO: Construindo a URL de redirect de forma explícita e completa.
    // Isso evita qualquer ambiguidade sobre o endereço do callback.
const redirectUri = `https://pedro-bonato.github.io/MashupGabi3.0/oauth_callback.html`;

    const authUrl = `https://${qlikHost}/login?redirect_uri=${encodeURIComponent(redirectUri)}`;

    const authWindow = window.open(authUrl, "_blank", "width=600,height=600");

    const listener = (event) => {
      // Verificação de segurança: a mensagem deve vir da nossa própria origem.
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data?.qlikToken) {
        window.removeEventListener("message", listener);
        // O pop-up deve se fechar sozinho, mas garantimos aqui se necessário.
        if (authWindow) {
          authWindow.close();
        }
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
        new WebSocket(url, { headers: { Authorization: `Bearer ${token}` } }),
    });

    const global = await session.open();
    const app = await global.openDoc(appId);
    const n = embed(app);

    n.render({ element: document.getElementById("chart1"), id: "jcgWmpm" }); // Substitua os IDs
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