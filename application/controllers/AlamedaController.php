<?php

class AlamedaController extends Zend_Controller_Action {
	
	public function init()
	{
		
	}	
	
	public function indexAction()
	{			
		$this->_redirect('alameda/listar');
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
		$alameda = new Model_DbTable_Alameda();
		$contar = 30;
		if(!empty($value)){				
		    $contar = $alameda->contarAlameda($field,$value);		
		}		
		$dadosAlameda = $alameda->listarAlameda($start,$limit,$sort,$dir,$field,$value);
		echo '{rows:',Zend_Json::encode($dadosAlameda),',totalCount: ',$contar,'}';		
	}
		
	public function buscarAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true); 		 	
 			
 		try{ 			
 			$id = $this->_request->alameda_id; 		 		
 		    $alameda = new Model_DbTable_Alameda();
 		    $dadosAlameda = $alameda->buscarAlameda('alameda_id',$id);
 		    echo '{success: true,data:',Zend_Json::encode(current($dadosAlameda)),'}';	
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

		$alameda = new Model_DbTable_Alameda();
		$pkalameda = $this->_request->alameda_id;
		
		try{
			if(is_array($pkalameda)){
				foreach($pkalameda as $valor){
					$dadosAlameda = $alameda->find($valor)->current();
					$dadosAlameda->delete();
				}
			}else{
				$dadosAlameda = $alameda->find($pkalameda)->current();
				$dadosAlameda->delete();
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
		
		$alameda = new Model_DbTable_Alameda();
		$funcoes = new Model_Function_Geral();		
	    try {
	    	//-- converte para maiscula
	    	foreach($post as $campo=> $valor){	    		
	    		$post[$campo] = strtoupper(trim($valor));
	    	}   	
	    	$post['usuario_login'] = $funcoes->userAtivo();
	    	if($post['alameda_id']==0){
	    		$alameda->insert($post);   		
	    	}else{
	    		$alameda->update($post,"alameda_id = {$post['alameda_id']}");	    		
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
 		    $alameda = new Model_DbTable_Alameda(); 		    
 		    $dadosAlameda = $alameda->todoAlameda();
 		    echo Zend_Json::encode($dadosAlameda); 		    
		}catch(Exception $e){
			echo '{success: false}';
			// Zend_Debug::dump($e);
		}
	}
}
?>

