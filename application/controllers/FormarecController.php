<?php

class FormarecController extends Zend_Controller_Action {
	
	public function init()
	{
						
	}	
	
	public function indexAction()
	{			
		$this->_redirect('formarec/listar');
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
 		
		$formarec = new Model_DbTable_Formarec();
		$contar = 30;
		if(!empty($value)){				
		    $contar = $formarec->contarFormarec($field,$value);		
		}		
		$dadosFormarec = $formarec->listarFormarec($start,$limit,$sort,$dir,$field,$value);
		echo '{rows:',Zend_Json::encode($dadosFormarec),',totalCount: ',$contar,'}';		
	}
		
	public function buscarAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true); 		 	
 			
 		try{ 			
 			$id = $this->_request->formarec_id; 		 		
 		    $formarec = new Model_DbTable_Formarec();
 		    $dadosFormarec = $formarec->buscarFormarec('formarec_id',$id);
 		    echo '{success: true,data:',Zend_Json::encode(current($dadosFormarec)),'}';	
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

		$formarec = new Model_DbTable_Formarec();
		$pkformarec = $this->_request->formarec_id;
		
		try{
			if(is_array($pkformarec)){
				foreach($pkformarec as $valor){
					$dadosFormarec = $formarec->find($valor)->current();
					$dadosFormarec->delete();
				}
			}else{
				$dadosFormarec = $formarec->find($pkformarec)->current();
				$dadosFormarec->delete();
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
		
		$formarec = new Model_DbTable_Formarec();
		$funcoes = new Model_Function_Geral();		
	    try {
	    	//-- converte para maiscula
	    	foreach($post as $campo=> $valor){	    		
	    		$post[$campo] = strtoupper(trim($valor));
	    	}
	    	$post['usuario_login'] = $funcoes->userAtivo();
	    	$post['formarec_inavista'] = !isset($post['formarec_inavista']) ? 0 : $post['formarec_inavista'];
	    	   	
	    	if($post['formarec_id']==0){
	    		$formarec->insert($post);   		
	    	}else{
	    		$formarec->update($post,"formarec_id = {$post['formarec_id']}");	    		
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
 		    $formarec = new Model_DbTable_Formarec(); 		    
 		    $dadosFormarec = $formarec->todoCbo();
 		    echo Zend_Json::encode($dadosFormarec); 		    
		}catch(Exception $e){
			echo '{success: false}';
			// Zend_Debug::dump($e);
		}
	}	
}
?>

