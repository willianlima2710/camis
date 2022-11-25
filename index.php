<?php
	set_include_path('../framework');
	
	// Define o caminho do diretório da aplicação
	defined('APPLICATION_PATH')
		|| define('APPLICATION_PATH', realpath(dirname(__FILE__) . '/application'));

 	
	// Define o ambiente da aplicação
	defined('APPLICATION_ENV')
		|| define('APPLICATION_ENV', (getenv('APPLICATION_ENV') ? getenv('APPLICATION_ENV') : 'production'));
		
	/** 
	 * Zend_Application 
	 * Fornece recursos que facilitam a reutilização de codigo (banco de dados, configurações) 
	 * Também outras funcionalidade como o carregamento semi-automatico de classes.
	* */
	require_once 'Zend/Application.php';
	
	// Cria a aplicação, o bootstrap e executa
	$application = new Zend_Application(
		APPLICATION_ENV, 
		APPLICATION_PATH . '/configs/application.ini'
	);	
	
	$application->bootstrap();
	$application->run();