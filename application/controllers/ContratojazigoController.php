<?php

class ContratojazigoController extends Zend_Controller_Action {
	
	public function init()
	{
		
	}	
	
	public function indexAction()
	{			
		$this->_redirect('contratojazigo/listar');
	}
			
	public function listarAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true);
 		
 		$value = $this->_request->value;
 		$field = $this->_request->field;
 		$contratojazigo = new Model_DbTable_Contratojazigo();
 		$contar = $contratojazigo->contarContratojazigo($field, $value);
		$dadosContratojazigo = $contratojazigo->listarContratojazigo($field,$value);
		echo '{rows:',Zend_Json::encode($dadosContratojazigo),',totalCount: ',$contar,'}';		
	}
		
	public function buscarAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true); 		 	
 			
 		try{ 			
 			$id = $this->_request->contrato_jazigo_id; 		 		
 		    $contratojazigo = new Model_DbTable_Contratojazigo();
 		    $dadosContratojazigo = $contratojazigo->buscarContratojazigo('contrato_jazigo_id',$id);
 		    echo '{success: true,data:',Zend_Json::encode(current($dadosContratojazigo)),'}';	
		}catch(Exception $e){
			echo '{success: false}';
			// Zend_Debug::dump($e);
		} 		     			
	}
	
	public function excluirAction()	
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true); 

		$contratojazigo = new Model_DbTable_Contratojazigo();
		$pkcontratojazigo = $this->_request->contrato_jazigo_id;
		
		try{
			if(is_array($pkcontratojazigo)){
				foreach($pkcontratojazigo as $valor){
					$dadosContratojazigo = $contratojazigo->find($valor)->current();
					$dadosContratojazigo->delete();
				}
			}else{
				$dadosContratojazigo = $contratojazigo->find($pkcontratojazigo)->current();
				$dadosContratojazigo->delete();
			};
		    echo '{success: true}';
		}catch(Exception $e) {
			echo '{success: false}';
			// Zend_Debug::dump($e);
		}
	}
	   
	public function salvarAction()
	{		
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true);
 		 
		$post = $this->_request->getPost();
		$pkcontrato = $this->_request->contrato_id;	
				
		unset($post['action']);
		unset($post['locatario_desc']);

		$contratojazigo = new Model_DbTable_Contratojazigo();
		$funcoes = new Model_Function_Geral();		
	    try {
	    	//-- converte para maiscula
	    	foreach($post as $campo=> $valor){	    		
	    		$post[$campo] = strtoupper(trim($valor));
	    	}   	
	    	$post['contrato_id'] = $pkcontrato;
	    	$post['contrato_jazigo_instatus'] = '0';
	    	$post['usuario_login'] = $funcoes->userAtivo();
	    	if($post['contrato_jazigo_id']==0){
	    		$contratojazigo->insert($post);
	    		$pkcontratojazigo = $contratojazigo->getAdapter()->lastInsertId();   		
	    	}else{
	    		$contratojazigo->update($post,"contrato_jazigo_id = {$post['contrato_jazigo_id']}");
	    		$pkcontratojazigo = $post['contrato_jazigo_id'];	    		
	    	}   	    
		    echo "{success: true}";
		} catch(Exception $e) {
			echo '{success: false}';
			Zend_Debug::dump($e);
		}  				
	}

    public function todoAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true); 		 	
 			
 		try{	 		
 		    $contratojazigo = new Model_DbTable_Contratojazigo(); 		    
 		    $dadosContratojazigo = $contratojazigo->todoContratojazigo();
 		    echo Zend_Json::encode($dadosContratojazigo); 		    
		}catch(Exception $e){
			echo '{success: false}';
			// Zend_Debug::dump($e);
		}
	}
}
?>

