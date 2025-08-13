/*
* Mashup para Planejamento Comercial 2026
* Usando autenticação OAuth 2.0 com redirecionamento para a própria index.html
*/

document.addEventListener('DOMContentLoaded', function() {

    // Configurações para conexão com seu ambiente Qlik Cloud
    const config = {
        host: "msryx1okj1jicf6.us.qlikcloud.com",
        clientId: "a809f137be42c7c2b91d60ca9fca46fa", // Seu Client ID para OAuth
        redirectUri: "https://pedro-bonato.github.io/MashupGabi3.0/auth-callback.html", // A própria página
        accessTokenStorage: "session",
        autoRedirect: true,
    };

    // Configura o require.js para encontrar os recursos do Qlik Cloud
    require.config({
        baseUrl: `https://${config.host}/resources`,
        paths: {
            "qlik": `https://${config.host}/resources/js/qlik`
        }
    });

    // Função principal que renderiza os objetos do Qlik
    function renderMashup(qlik) {
        // Mapeamento dos IDs das divs no HTML para os IDs dos objetos no Qlik
        const objectMappings = {
            "QV01": "ddbbffa8-1028-430a-9a49-99b2c0cdc098", "QV02": "ddbbffa8-1028-430a-9a49-99b2c0cdc098",
            "QV03": "ddbbffa8-1028-430a-9a49-99b2c0cdc098", "QV04": "ddbbffa8-1028-430a-9a49-99b2c0cdc098",
            "QV05": "ddbbffa8-1028-430a-9a49-99b2c0cdc098", "QV06": "ddbbffa8-1028-430a-9a49-99b2c0cdc098",
            "QV07": "ddbbffa8-1028-430a-9a49-99b2c0cdc098", "QV08": "ddbbffa8-1028-430a-9a49-99b2c0cdc098"
        };
        const appId = "e84c7d4c-b8c1-40a6-b3c2-1df068af26fc";
        
        const app = qlik.openApp(appId);

        for (const divId in objectMappings) {
            if (document.getElementById(divId)) {
                app.getObject(divId, objectMappings[divId], { noInteraction: true });
            }
        }
    }

    // Lógica "Inteligente" de Autenticação
    require(["qlik"], function (qlik) {
        qlik.on("error", function (error) { console.error("Erro do Qlik:", error); });

        const urlParams = new URLSearchParams(window.location.search);

        // MODO 1: Se a URL contém o código de autenticação, finaliza o processo.
        if (urlParams.has('code') && urlParams.has('state')) {
            qlik.oauth.complete(window.location.href)
                .then(() => {
                    // Limpa a URL e recarrega a página para o modo normal
                    window.history.replaceState({}, document.title, window.location.pathname);
                    renderMashup(qlik); // Renderiza o mashup imediatamente após o login
                });
        } 
        // MODO 2: Se não, é um carregamento normal. Configura e renderiza.
        else {
            qlik.configure(config);
            // Pede os dados. Se não estiver logado, o autoRedirect levará para o login.
            renderMashup(qlik);
        }
    });
});
