var prefix = window.location.pathname.substr( 0, window.location.pathname.toLowerCase().lastIndexOf( "/extensions" ) + 1 );
var config = {
	host: window.location.hostname,
	prefix: prefix,
	port: window.location.port,
	isSecure: window.location.protocol === "https:"
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
	var app = qlik.openApp('teste3.qvf', config);

	// Renderiza os objetos do Qlik nas divs correspondentes
	// getObject(id_da_div_no_html, id_do_objeto_no_qlik)
	app.getObject('QV01', 'mEbcM'); 	// index
	app.getObject('QV02', 'mEbcM'); 	// index
	app.getObject('QV03', 'mEbcM'); 	// index
	app.getObject('QV04', 'YXEg'); 		// index
	app.getObject('QV05', 'YXEg');		// index
	app.getObject('QV06', 'YXEg'); 		// index
	app.getObject('QV07', 'kmpTfTm'); 	// pagina 1
	app.getObject('QV08', 'pPARBrj'); 	// pagina 1


    // Adicione mais objetos aqui se necessário
	// app.getObject('QV02', 'ID_DO_SEU_SEGUNDO_GRAFICO');
	// app.getObject('QV03', 'ID_DO_SEU_TERCEIRO_GRAFICO');

} );