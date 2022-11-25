<?php

class ContaController extends Zend_Controller_Action {
	
	public function init()
	{
						
	}	
	
	public function indexAction()
	{			
		$this->_redirect('conta/listar');
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
			$limit = 6000;
		}				
 		
 		if(!isset($sort)){
 			$sort = 'data_ultima_alteracao';
 			$dir = 'DESC';
 		}		
 		
		$conta = new Model_DbTable_Conta();
		$contar = 6000;
		if(!empty($value)){				
		    $contar = $conta->contarConta($field,$value);		
		}	
		$dadosConta = $conta->listarConta($start,$limit,$sort,$dir,$field,$value);
		echo '{rows:',Zend_Json::encode($dadosConta),',totalCount: ',$contar,'}';		
	}
		
	public function buscarAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true); 		 	
 			
 		try{ 			
 			$id = $this->_request->conta_id; 		 		
 		    $conta = new Model_DbTable_Conta();
 		    $dadosConta = $conta->buscarConta('conta_id',$id);
 		    echo '{success: true,data:',Zend_Json::encode(current($dadosConta)),'}';	
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

		$conta = new Model_DbTable_Conta();
		$pkconta = $this->_request->conta_id;
		
		try{
			if(is_array($pkconta)){
				foreach($pkconta as $valor){
					$dadosConta = $conta->find($valor)->current();
					$dadosConta->delete();
				}
			}else{
				$dadosConta = $conta->find($pkconta)->current();
				$dadosConta->delete();
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
		unset($post['action']);
		
		$conta = new Model_DbTable_Conta();
		$funcoes = new Model_Function_Geral();		
	    try {
	    	//-- converte para maiscula
	    	foreach($post as $campo=> $valor){	    		
	    		$post[$campo] = strtoupper(trim($valor));
	    	}   	
	    	$post['usuario_login'] = $funcoes->userAtivo();	    	
	    	if($post['conta_id']==0){
	    		$conta->insert($post);
	    		$pkconta = $conta->getAdapter()->lastInsertId();
	    	}else{
	    		$conta->update($post,"conta_id = {$post['conta_id']}");
	    		$pkconta = $post['conta_id'];
	    	}   	    
		    echo "{success: true,id: '{$pkconta}'}";
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
 		    $conta = new Model_DbTable_Conta(); 		    
 		    $dadosConta = $conta->todoConta();
 		    echo Zend_Json::encode($dadosConta); 		    
		}catch(Exception $e){
			echo '{success: false}';
			// Zend_Debug::dump($e);
		}
	}	
}
?>

