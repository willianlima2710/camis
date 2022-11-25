<?php
	set_include_path('../framework');
	
	// Define o caminho do diret�rio da aplica��o
	defined('APPLICATION_PATH')
		|| define('APPLICATION_PATH', realpath(dirname(__FILE__) . '/application'));

 	
	// Define o ambiente da aplica��o
	defined('APPLICATION_ENV')
		|| define('APPLICATION_ENV', (getenv('APPLICATION_ENV') ? getenv('APPLICATION_ENV') : 'production'));
		
	/** 
	 * Zend_Application 
	 * Fornece recursos que facilitam a reutiliza��o de codigo (banco de dados, configura��es) 
	 * Tamb�m outras funcionalidade como o carregamento semi-automatico de classes.
	* */
	require_once 'Zend/Application.php';
	
	// Cria a aplica��o, o bootstrap e executa
	$application = new Zend_Application(
		APPLICATION_ENV, 
		APPLICATION_PATH . '/configs/application.ini'
	);	
	
	$application->bootstrap();
	$application->run();