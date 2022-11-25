<?php

class MorteController extends Zend_Controller_Action {
	
	public function init()
	{
						
	}	
	
	public function indexAction()
	{			
		$this->_redirect('morte/listar');
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
 		
		$morte = new Model_DbTable_Morte();
		$contar = 30;
		if(!empty($value)){				
		    $contar = $morte->contarMorte($field,$value);		
		}		
		$dadosMorte = $morte->listarMorte($start,$limit,$sort,$dir,$field,$value);
		echo '{rows:',Zend_Json::encode($dadosMorte),',totalCount: ',$contar,'}';		
	}
		
	public function buscarAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true); 		 	
 			
 		try{ 			
 			$id = $this->_request->morte_id; 		 		
 		    $morte = new Model_DbTable_Morte();
 		    $dadosMorte = $morte->buscarMorte('morte_id',$id);
 		    echo '{success: true,data:',Zend_Json::encode(current($dadosMorte)),'}';	
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

		$morte = new Model_DbTable_Morte();
		$pkmorte = $this->_request->morte_id;
		
		try{
			if(is_array($pkmorte)){
				foreach($pkmorte as $valor){
					$dadosMorte = $morte->find($valor)->current();
					$dadosMorte->delete();
				}
			}else{
				$dadosMorte = $morte->find($pkmorte)->current();
				$dadosMorte->delete();
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
		
		$morte = new Model_DbTable_Morte();
		$funcoes = new Model_Function_Geral();		
	    try {
	    	//-- converte para maiscula
	    	foreach($post as $campo=> $valor){	    		
	    		$post[$campo] = strtoupper(trim($valor));
	    	}   	
	    	$post['usuario_login'] = $funcoes->userAtivo();
	    	if($post['morte_id']==0){
	    		$morte->insert($post);
	    	}else{
	    		$morte->update($post,"morte_id = {$post['morte_id']}");
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
 		    $morte = new Model_DbTable_Morte(); 		    
 		    $dadosMorte = $morte->todoMorte();
 		    echo Zend_Json::encode($dadosMorte);	
		}catch(Exception $e){
			echo '{success: false}';
			// Zend_Debug::dump($e);
		}
	}		
}
?>

