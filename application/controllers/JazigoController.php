<?php

class JazigoController extends Zend_Controller_Action {
	
	public function init()
	{
						
	}	
	
	public function indexAction()
	{			
		$this->_redirect('jazigo/listar');
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

		try{
		
 		if ($start == 0){
 			$start = 0;
 		}
 		
		if($limit == 0) {
			$limit = 30;
		}				
 		
 		if(empty($sort)){ 			
			$sort = 'data_ultima_alteracao';
			$dir = 'DESC';
		}		
				
 		$jazigo = new Model_DbTable_Jazigo();
 		
 		$contar = 30;
		if(!empty($value)){				
		    $contar = $jazigo->contarJazigo($field,$value);		
		} 		
		$dadosJazigo = $jazigo->listarJazigo($start,$limit,$sort,$dir,$field,$value);
		echo '{rows:',Zend_Json::encode($dadosJazigo),',totalCount: ',$contar,'}';
		}catch(Exception $e){
			echo '{success: false}';
		    Zend_Debug::dump($e);
		} 
	}
		
	public function buscarAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true); 		 	
 			
 		try{ 			
 			$id = $this->_request->jazigo_id; 		 		
 		    $jazigo = new Model_DbTable_Jazigo();
 		    $dadosJazigo = $jazigo->buscarJazigo('jazigo_id',$id);
 		    echo '{success: true,data:',Zend_Json::encode(current($dadosJazigo)),'}';	
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

		$jazigo = new Model_DbTable_Jazigo();
		$pkjazigo = $this->_request->jazigo_id;
		
		try{
			if(is_array($pkjazigo)){
				foreach($pkjazigo as $valor){
					$dadosJazigo = $jazigo->find($valor)->current();
					$dadosJazigo->delete();
				}
			}else{
				$dadosJazigo = $jazigo->find($pkjazigo)->current();
				$dadosJazigo->delete();
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
		
		$jazigo = new Model_DbTable_Jazigo();
		$funcoes = new Model_Function_Geral();		
	    try {
	    	//-- converte para maiscula
	    	foreach($post as $campo=> $valor){	    		
	    		$post[$campo] = strtoupper(trim($valor));
	    	}
	    	$post["jazigo_incobranca"] = !isset($post["jazigo_incobranca"]) ? 0 : $post["jazigo_incobranca"];
	    	$post['usuario_login'] = $funcoes->userAtivo();   	
	    	if($post['jazigo_id']==0){
	    		$jazigo->insert($post);   
	    		$pkjazigo = $jazigo->getAdapter()->lastInsertId();
	    	}else{
	    		$jazigo->update($post,"jazigo_id = {$post['jazigo_id']}");
	    		$pkjazigo = $post['jazigo_id'];
	    	}   	    
		    echo "{success: true,id: '{$pkjazigo}'}";
		} catch(Exception $e) {
			echo '{success: false}';
			echo Zend_Debug::dump($e);
		}  				
	}
	
	public function autocompleteAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true);
 		
 		$value = $this->_request->value;
 		$disponivel = $this->_request->disponivel;
 		
 		if(!empty($value)){
 			$jazigo = new Model_DbTable_Jazigo();
 			$dadosJazigo = $jazigo->autocompleteJazigo($value,$disponivel);
 			echo '{rows:',Zend_Json::encode($dadosJazigo),'}';
 		}else{
 			echo '{success: false}';
 		} 				
	}
	
}
?>

