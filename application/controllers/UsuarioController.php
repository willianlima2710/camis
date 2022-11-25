<?php

class UsuarioController extends Zend_Controller_Action {
	
	public function todoAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true); 		 	
 			
 		try{	 		
 		    $usuario = new Model_DbTable_Usuario(); 		    
 		    $dadosUsuario = $usuario->todoUsuario();
 		    echo Zend_Json::encode($dadosUsuario); 		    
		}catch(Exception $e){
			echo '{success: false}';
			// Zend_Debug::dump($e);
		}
	}
}
?>

