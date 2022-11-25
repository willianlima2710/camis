<?php

class FornecedorController extends Zend_Controller_Action {
	
	public function init()
	{
						
	}	
	
	public function indexAction()
	{			
		$this->_redirect('fornecedor/listar');
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
 		
		$fornecedor = new Model_DbTable_Fornecedor();
		$contar = 30;
		if(!empty($value)){				
		    $contar = $fornecedor->contarFornecedor($field,$value);		
		}		
		$dadosFornecedor = $fornecedor->listarFornecedor($start,$limit,$sort,$dir,$field,$value);
		echo '{rows:',Zend_Json::encode($dadosFornecedor),',totalCount: ',$contar,'}';		
	}
		
	public function buscarAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true); 		 	
 			
 		try{ 			
 			$id = $this->_request->fornecedor_id; 		 		
 		    $fornecedor = new Model_DbTable_Fornecedor();
 		    $dadosFornecedor = $fornecedor->buscarFornecedor('fornecedor_id',$id);
 		    echo '{success: true,data:',Zend_Json::encode(current($dadosFornecedor)),'}';	
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

		$fornecedor = new Model_DbTable_Fornecedor();
		$pkfornecedor = $this->_request->fornecedor_id;
		
		try{
			if(is_array($pkfornecedor)){
				foreach($pkfornecedor as $valor){
					$dadosFornecedor = $fornecedor->find($valor)->current();
					$dadosFornecedor->delete();
				}
			}else{
				$dadosFornecedor = $fornecedor->find($pkfornecedor)->current();
				$dadosFornecedor->delete();
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
		
		$fornecedor = new Model_DbTable_Fornecedor();
		$funcoes = new Model_Function_Geral();		
	    try {
	    	//-- converte para maiscula
	    	foreach($post as $campo=> $valor){	    		
	    		$post[$campo] = strtoupper(trim($valor));
	    	}   	
	    	$post['usuario_login'] = $funcoes->userAtivo();
	    	if($post['fornecedor_id']==0){
	    		$fornecedor->insert($post);   		
	    	}else{
	    		$fornecedor->update($post,"fornecedor_id = {$post['fornecedor_id']}");	    		
	    	}   	    
		    echo '{success: true}';
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
 		    $fornecedor = new Model_DbTable_Fornecedor(); 		    
 		    $dadosFornecedor = $fornecedor->todoFornecedor();
 		    echo Zend_Json::encode($dadosFornecedor); 		    
		}catch(Exception $e){
			echo '{success: false}';
			// Zend_Debug::dump($e);
		}
	}

    public function autocompleteAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true);
 		
 		$value = $this->_request->value;
 		
 		if(!empty($value)){
 			$fornecedor = new Model_DbTable_Fornecedor();
 			$dadosFornecedor = $fornecedor->autocompleteFornecedor($value);
 			echo '{rows:',Zend_Json::encode($dadosFornecedor),'}';
 		}else{
 			echo '{success: false}';
 		} 				
	}
}
?>

