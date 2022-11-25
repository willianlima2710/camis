<?php

class CorcurtisController extends Zend_Controller_Action {
	
	public function init()
	{
						
	}	
	
	public function indexAction()
	{			
		$this->_redirect('corcurtis/listar');
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
 		
		$corcurtis = new Model_DbTable_Corcurtis();
		$contar = 30;
		if(!empty($value)){				
		    $contar = $corcurtis->contarCorcurtis($field,$value);		
		}		
		$dadosCorcurtis = $corcurtis->listarCorcurtis($start,$limit,$sort,$dir,$field,$value);
		echo '{rows:',Zend_Json::encode($dadosCorcurtis),',totalCount: ',$contar,'}';		
	}
		
	public function buscarAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true); 		 	
 			
 		try{ 			
 			$id = $this->_request->corcurtis_id; 		 		
 		    $corcurtis = new Model_DbTable_Corcurtis();
 		    $dadosCorcurtis = $corcurtis->buscarCorcurtis('corcurtis_id',$id);
 		    echo '{success: true,data:',Zend_Json::encode(current($dadosCorcurtis)),'}';	
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

		$corcurtis = new Model_DbTable_Corcurtis();
		$pkcorcurtis = $this->_request->corcurtis_id;
		
		try{
			if(is_array($pkcorcurtis)){
				foreach($pkcorcurtis as $valor){
					$dadosCorcurtis = $corcurtis->find($valor)->current();
					$dadosCorcurtis->delete();
				}
			}else{
				$dadosCorcurtis = $corcurtis->find($pkcorcurtis)->current();
				$dadosCorcurtis->delete();
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
		
		$corcurtis = new Model_DbTable_Corcurtis();
		$funcoes = new Model_Function_Geral();		
	    try {
	    	//-- converte para maiscula
	    	foreach($post as $campo=> $valor){	    		
	    		$post[$campo] = strtoupper(trim($valor));
	    	}   	
	    	$post['usuario_login'] = $funcoes->userAtivo();
	    	if($post['corcurtis_id']==0){
	    		$corcurtis->insert($post);   		
	    	}else{
	    		$corcurtis->update($post,"corcurtis_id = {$post['corcurtis_id']}");	    		
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
 		    $corcurtis = new Model_DbTable_Corcurtis(); 		    
 		    $dadosCorcurtis = $corcurtis->todoCorcurtis();
 		    echo Zend_Json::encode($dadosCorcurtis); 		    
		}catch(Exception $e){
			echo '{success: false}';
			// Zend_Debug::dump($e);
		}
	}	
}
?>

