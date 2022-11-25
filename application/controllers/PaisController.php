<?php

class PaisController extends Zend_Controller_Action {
	
	public function init()
	{
						
	}	
	
	public function indexAction()
	{			
		$this->_redirect('pais/listar');
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
 		
		$pais = new Model_DbTable_Pais();
		$contar = 30;
		if(!empty($value)){				
		    $contar = $pais->contarPais($field,$value);		
		}		
		$dadosPais = $pais->listarPais($start,$limit,$sort,$dir,$field,$value);
		echo '{rows:',Zend_Json::encode($dadosPais),',totalCount: ',$contar,'}';		
	}
		
	public function buscarAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true); 		 	
 			
 		try{ 			
 			$id = $this->_request->pais_id; 		 		
 		    $pais = new Model_DbTable_Pais();
 		    $dadosPais = $pais->buscarPais('pais_id',$id);
 		    echo '{success: true,data:',Zend_Json::encode(current($dadosPais)),'}';	
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

		$pais = new Model_DbTable_Pais();
		$pkpais = $this->_request->pais_id;
		
		try{
			if(is_array($pkpais)){
				foreach($pkpais as $valor){
					$dadosPais = $pais->find($valor)->current();
					$dadosPais->delete();
				}
			}else{
				$dadosPais = $pais->find($pkpais)->current();
				$dadosPais->delete();
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
		
		$pais = new Model_DbTable_Pais();
		$funcoes = new Model_Function_Geral();		
	    try {
	    	//-- converte para maiscula
	    	foreach($post as $campo=> $valor){	    		
	    		$post[$campo] = strtoupper(trim($valor));
	    	}
	    	$post['usuario_login'] = $funcoes->userAtivo();   	
	    	if($post['pais_id']==0){
	    		$pais->insert($post);   		
	    	}else{
	    		$pais->update($post,"pais_id = {$post['pais_id']}");	    		
	    	}   	    
		    echo '{success: true}';
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
 		    $pais = new Model_DbTable_Pais(); 		    
 		    $dadosPais = $pais->todoPais();
 		    echo Zend_Json::encode($dadosPais);	
		}catch(Exception $e){
			echo '{success: false}';
			// Zend_Debug::dump($e);
		}
	}
	
}
?>

