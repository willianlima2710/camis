<?php

class LocpagtoController extends Zend_Controller_Action {
	
	public function init()
	{
						
	}	
	
	public function indexAction()
	{			
		$this->_redirect('locpagto/listar');
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
 		
		$locpagto = new Model_DbTable_Locpagto();
		$contar = 30;
		if(!empty($value)){				
		    $contar = $locpagto->contarLocpagto($field,$value);		
		}		
		$dadosLocpagto = $locpagto->listarLocpagto($start,$limit,$sort,$dir,$field,$value);
		echo '{rows:',Zend_Json::encode($dadosLocpagto),',totalCount: ',$contar,'}';		
	}
		
	public function buscarAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true); 		 	
 			
 		try{ 			
 			$id = $this->_request->locpagto_id; 		 		
 		    $locpagto = new Model_DbTable_Locpagto();
 		    $dadosLocpagto = $locpagto->buscarLocpagto('locpagto_id',$id);
 		    echo '{success: true,data:',Zend_Json::encode(current($dadosLocpagto)),'}';	
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

		$locpagto = new Model_DbTable_Locpagto();
		$pklocpagto = $this->_request->locpagto_id;
		
		try{
			if(is_array($pklocpagto)){
				foreach($pklocpagto as $valor){
					$dadosLocpagto = $locpagto->find($valor)->current();
					$dadosLocpagto->delete();
				}
			}else{
				$dadosLocpagto = $locpagto->find($pklocpagto)->current();
				$dadosLocpagto->delete();
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
		
		$locpagto = new Model_DbTable_Locpagto();
		$funcoes = new Model_Function_Geral();		
	    try {
	    	//-- converte para maiscula
	    	foreach($post as $campo=> $valor){	    		
	    		$post[$campo] = strtoupper(trim($valor));
	    	}
	    	$post['usuario_login'] = $funcoes->userAtivo();   	
	    	if($post['locpagto_id']==0){
	    		$locpagto->insert($post);   		
	    	}else{
	    		$locpagto->update($post,"locpagto_id = {$post['locpagto_id']}");	    		
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
 		    $locpagto = new Model_DbTable_Locpagto(); 		    
 		    $dadosLocpagto = $locpagto->todoCbo();
 		    echo Zend_Json::encode($dadosLocpagto); 		    
		}catch(Exception $e){
			echo '{success: false}';
			// Zend_Debug::dump($e);
		}
	}
}
?>

