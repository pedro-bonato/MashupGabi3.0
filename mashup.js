var prefix = window.location.pathname.substr( 0, window.location.pathname.toLowerCase().lastIndexOf( "/extensions" ) + 1 );
var config = {
	host: "msryx1okj1jicf6.us.qlikcloud.com",
	prefix: "",
	port: 443,
	isSecure: window.location.protocol === "https:",
	webIntegrationId: "sg3OPX-nsZk-Q6Omi9THVDtbVdbHnb9C"

};
require.config( {
	baseUrl: ( config.isSecure ? "https://" : "http://" ) + config.host + (config.port ? ":" + config.port : "") + config.prefix + "resources"
} );

require( ["js/qlik"], function ( qlik ) {
	// Você pode adicionar um callback para erros aqui se precisar
	// qlik.on( "error", function ( error ) {
	// 	console.error(error);
	// } );

	// Abre o seu aplicativo Qlik
	var app = qlik.openApp('e84c7d4c-b8c1-40a6-b3c2-1df068af26fc', config);

	// Renderiza os objetos do Qlik nas divs correspondentes
	// getObject(id_da_div_no_html, id_do_objeto_no_qlik)
	app.getObject('QV01', 'ddbbffa8-1028-430a-9a49-99b2c0cdc098'); 	// index
	app.getObject('QV02', 'ddbbffa8-1028-430a-9a49-99b2c0cdc098'); 	// index
	app.getObject('QV03', 'ddbbffa8-1028-430a-9a49-99b2c0cdc098'); 	// index
	app.getObject('QV04', 'ddbbffa8-1028-430a-9a49-99b2c0cdc098'); 		// index
	app.getObject('QV05', 'ddbbffa8-1028-430a-9a49-99b2c0cdc098');		// index
	app.getObject('QV06', 'ddbbffa8-1028-430a-9a49-99b2c0cdc098'); 		// index
	app.getObject('QV07', 'ddbbffa8-1028-430a-9a49-99b2c0cdc098'); 	// pagina 1
	app.getObject('QV08', 'ddbbffa8-1028-430a-9a49-99b2c0cdc098'); 	// pagina 1


    // Adicione mais objetos aqui se necessário
	// app.getObject('QV02', 'ID_DO_SEU_SEGUNDO_GRAFICO');
	// app.getObject('QV03', 'ID_DO_SEU_TERCEIRO_GRAFICO');

} );