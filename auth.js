/**
 * auth.js
 * Módulo para gerenciar o fluxo de autenticação personalizado com qlik-embed.
 */

let qlikAuthRedirect = null;

window.showCustomLoginPrompt = function(authorize) {
  console.log("Callback de confirmação do usuário recebida da qlik-embed.");
  qlikAuthRedirect = authorize;
};