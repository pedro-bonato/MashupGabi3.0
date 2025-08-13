/*
* Mashup para Planejamento Comercial 2026
* Conectado ao ambiente Qlik Cloud e renderizando objetos
* diretamente na estrutura de cards do HTML.
*/

document.addEventListener('DOMContentLoaded', function() {

    // Configurações para conexão com seu ambiente Qlik Cloud
    const config = {
        host: "msryx1okj1jicf6.us.qlikcloud.com",
        port: 443,
        prefix: "",
        isSecure: true,
        webIntegrationId: "sg3OPX-nsZk-Q6Omi9THVDtbVdbHnb9C"
    };

    // Configura o require.js para encontrar os recursos do Qlik Cloud
    require.config({
        baseUrl: `https://${config.host}/resources`,
        paths: {
            "qlik": `https://${config.host}/resources/js/qlik`
        }
    });

    // Inicia a aplicação
    require(["qlik"], function (qlik) {

        // Tratamento de erros
        qlik.on("error", function (error) {
            console.error("Erro do Qlik:", error);
        });

        // Mapeamento dos IDs das divs no HTML para os IDs dos objetos no Qlik
        const objectMappings = {
            "QV01": "ddbbffa8-1028-430a-9a49-99b2c0cdc098",
            "QV02": "ddbbffa8-1028-430a-9a49-99b2c0cdc098",
            "QV03": "ddbbffa8-1028-430a-9a49-99b2c0cdc098",
            "QV04": "ddbbffa8-1028-430a-9a49-99b2c0cdc098",
            "QV05": "ddbbffa8-1028-430a-9a49-99b2c0cdc098",
            "QV06": "ddbbffa8-1028-430a-9a49-99b2c0cdc098"
        };

        // ID do seu aplicativo no Qlik Cloud
        const appId = "e84c7d4c-b8c1-40a6-b3c2-1df068af26fc";
        
        // Abre o aplicativo Qlik
        const app = qlik.openApp(appId, config);

        // Renderiza cada objeto no seu respectivo container
        for (const divId in objectMappings) {
            const objectId = objectMappings[divId];
            if (document.getElementById(divId)) {
                app.getObject(divId, objectId, { noInteraction: true });
            }
        }
    });
});