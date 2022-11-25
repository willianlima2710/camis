<?php

class BancoController extends Zend_Controller_Action {
	
	public function init()
	{
						
	}	
	
	public function indexAction()
	{			
		$this->_redirect('banco/listar');
	}
			
	public function listarAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true);
 		
 		$start = $this->_request->start;
 		$limit = $this->_request->limit;
 		$sort = $this->_request->sort;
 		$dir = $this->_request->dir;
 		$value = $this->_request->value;
 		$field = $this->_request->field;
 		 		
 		$start = intval($start);
		$limit = intval($limit);	
		
 		if ($start == 0){
 			$start = 0;
 		}
 		
		if($limit == 0) {
			$limit = 30;
		}				
 		
 		if(!isset($sort)){
 			$sort = 'data_ultima_alteracao';
 			$dir = 'DESC';
 		}		
 		
		$banco = new Model_DbTable_Banco();
		$bancor = 30;
		if(!empty($value)){				
		    $bancor = $banco->BancorBanco($field,$value);		
		}	
		$dadosBanco = $banco->listarBanco($start,$limit,$sort,$dir,$field,$value);
		echo '{rows:',Zend_Json::encode($dadosBanco),',totalCount: ',$bancor,'}';		
	}
		
	public function buscarAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true); 		 	
 			
 		try{ 			
 			$id = $this->_request->banco_id; 		 		
 		    $banco = new Model_DbTable_Banco();
 		    $dadosBanco = $banco->buscarBanco('banco_id',$id);
 		    echo '{success: true,data:',Zend_Json::encode(current($dadosBanco)),'}';	
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

		$banco = new Model_DbTable_Banco();
		$pkbanco = $this->_request->banco_id;
		
		try{
			if(is_array($pkbanco)){
				foreach($pkbanco as $valor){
					$dadosBanco = $banco->find($valor)->current();
					$dadosBanco->delete();
				}
			}else{
				$dadosBanco = $banco->find($pkbanco)->current();
				$dadosBanco->delete();
			};
		    echo '{success: true}';
		}catch(Exception $e) {
			echo '{success: false}';
			Zend_Debug::dump($e);
		}
	}
	   
	public function salvarAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true);
 		 
		$post = $this->_request->getPost();
		unset($post['action']);
		
		$banco = new Model_DbTable_Banco();
		$funcoes = new Model_Function_Geral();		
	    try {
	    	//-- converte para maiscula
	    	foreach($post as $campo=> $valor){	    		
	    		$post[$campo] = strtoupper(trim($valor));
	    	}   	
	    	$post['usuario_login'] = $funcoes->userAtivo();	    	
	    	if($post['banco_id']==0){	    		
	    		$banco->insert($post);
	    		$pkbanco = $banco->getAdapter()->lastInsertId();
	    	}else{
	    		$banco->update($post,"banco_id = {$post['banco_id']}");
	    		$pkbanco = $post['banco_id'];
	    	}   	    
		    echo "{success: true,id: '{$pkbanco}'}";
		} catch(Exception $e) {
			echo '{success: false}';
			//Zend_Debug::dump($e);
		}  				
	}

	public function todoAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true); 		 	
 			
 		try{	 		
 		    $banco = new Model_DbTable_Banco(); 		    
 		    $dadosBanco = $banco->todoBanco();
 		    echo Zend_Json::encode($dadosBanco); 		    
		}catch(Exception $e){
			echo '{success: false}';
			// Zend_Debug::dump($e);
		}
	}	
}
?>

