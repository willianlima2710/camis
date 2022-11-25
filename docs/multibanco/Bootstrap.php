<?php

/**
 * Classe de bootstrap
 * 
 * @uses    Zend_Application_Bootstrap_Bootstrap
 */
class Bootstrap extends Zend_Application_Bootstrap_Bootstrap
{		
    /**
     * Bootstrap autoloader recurso para carregar as classes automatica
     * 
     * @return Zend_Application_Module_Autoloader
     */
	
    protected function _initAutoload()
    {
    	$autoloader = Zend_Loader_Autoloader::getInstance();
		$autoloader->setFallbackAutoloader(true);
		
        $autoloader = new Zend_Application_Module_Autoloader(array(
            'namespace' => '',
            'basePath'  => dirname(__FILE__),
        ));                        
       return $autoloader;
    }
    /**
     * Bootstrap doctype recurso para definir o tipo das telas e suas configura��es
     * 
     * @return void
     */
    protected function _initDoctype()
    {
    	$this->bootstrap('layout');
        $layout = $this->getResource('layout');
        $view = $layout->getView();   		
        
        $this->bootstrap('view');
        $view = $this->getResource('view');
        
    }
    /**
	 * Retorna a estancia da conex�o com o banco de dados
	 * @return Zend_DbAdapter
	*/
    public function _initDbAdapter()
    {
    	$session = new Zend_Session_Namespace('myapp');
    	Zend_Registry::set('session', $session);
    	
    	$resource = $this->getPluginResource('multidb');
    	$resource->init();
    	
        $db1 = $resource->getDb('camis');
        $db2 = $resource->getDb('gardinis');
        
        $session = Zend_Registry::get('session');        
        $session->dbApp = $db1;
        $session->dbBB = $db2;        
    }
    public function getDb($strDb) 
	{
		$session = Zend_Registry::get('session');
		switch($strDb){
			case 'camis':				
				$session->dbCC = $session->dbApp; 
				break;       
            case 'gardinis':
                $session->dbCC = $session->dbBB;
                break;
        }
        return $session->dbCC;       
    }    
	/**
	 * Retorna o diretorio real do document root
	 * @return string
	 */
    public function getRootDir()
	{
		return realpath(dirname( dirname(__FILE__) ));
	}
	
    /**
     * Retorna a base dos arquivos, caminho absoluto
     * @param string Chave do arquivo config.ini para obter os arquivos do sistema
     * @return Zend_Config
     */
	public function getBaseDir($type='filesystem')
    {
        return (object) $this->getOption($type);
    }    
}
