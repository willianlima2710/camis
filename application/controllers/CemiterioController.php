<?php

class CemiterioController extends Zend_Controller_Action {
	
	public function init()
	{
						
	}	
	
	public function indexAction()
	{			
		$this->_redirect('cemiterio/listar');
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
 		
		$cemiterio = new Model_DbTable_Cemiterio();
		$contar = 30;
		if(!empty($value)){				
		    $contar = $cemiterio->contarCemiterio($field,$value);		
		}		
		$dadosCemiterio = $cemiterio->listarCemiterio($start,$limit,$sort,$dir,$field,$value);
		echo '{rows:',Zend_Json::encode($dadosCemiterio),',totalCount: ',$contar,'}';		
	}
		
	public function buscarAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true); 		 	
 			
 		try{ 			
 			$id = $this->_request->cemiterio_id; 		 		
 		    $cemiterio = new Model_DbTable_Cemiterio();
 		    $dadosCemiterio = $cemiterio->buscarCemiterio('cemiterio_id',$id);
 		    echo '{success: true,data:',Zend_Json::encode(current($dadosCemiterio)),'}';	
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

		$cemiterio = new Model_DbTable_Cemiterio();
		$pkcemiterio = $this->_request->cemiterio_id;
		
		try{
			if(is_array($pkcemiterio)){
				foreach($pkcemiterio as $valor){
					$dadosCemiterio = $cemiterio->find($valor)->current();
					$dadosCemiterio->delete();
				}
			}else{
				$dadosCemiterio = $cemiterio->find($pkcemiterio)->current();
				$dadosCemiterio->delete();
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
		
		$cemiterio = new Model_DbTable_Cemiterio();
		$funcoes = new Model_Function_Geral();		
	    try {
	    	//-- converte para maiscula
	    	foreach($post as $campo=> $valor){	    		
	    		$post[$campo] = strtoupper(trim($valor));
	    	}   	
	    	$post['usuario_login'] = $funcoes->userAtivo();
	    	if($post['cemiterio_id']==0){
	    		$cemiterio->insert($post);   		
	    	}else{
	    		$cemiterio->update($post,"cemiterio_id = {$post['cemiterio_id']}");	    		
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
 		    $cemiterio = new Model_DbTable_Cemiterio(); 		    
 		    $dadosCemiterio = $cemiterio->todoCemiterio();
 		    echo Zend_Json::encode($dadosCemiterio); 		    
		}catch(Exception $e){
			echo '{success: false}';
			// Zend_Debug::dump($e);
		}
	}
}
?>

