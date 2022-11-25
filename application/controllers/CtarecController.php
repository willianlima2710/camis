<?php

class CtarecController extends Zend_Controller_Action {
	
	public function init()
	{
						
	}	
	
	public function indexAction()
	{			
		$this->_redirect('ctarec/listar');
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
 		
		$ctarec = new Model_DbTable_Ctarec();
		$contar = 30;
		if(!empty($value)){				
		    $contar = $ctarec->contarCtarec($field,$value);		
		}		
		$dadosCtarec = $ctarec->listarCtarec($start,$limit,$sort,$dir,$field,$value);		
		echo '{rows:',Zend_Json::encode($dadosCtarec),',totalCount: ',$contar,'}';
	}
		
	public function buscarAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true); 		 	
 			
 		try{ 			
 			$id = $this->_request->ctarec_id; 		 		
 		    $ctarec = new Model_DbTable_Ctarec();
 		    $funcoes = new Model_Function_Geral();
 		    
 		    $dadosCtarec = $ctarec->buscarCtarec('ctarec_id',$id);
 		    $dadosCtarec = current($dadosCtarec);
 		    echo '{success: true,data:',Zend_Json::encode($dadosCtarec),'}';	
		}catch(Exception $e){
			echo '{success: false}';
			Zend_Debug::dump($e);
		} 		     			
	}
	
	public function excluirAction()	
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true); 

		$ctarec = new Model_DbTable_Ctarec();
		$funcoes = new Model_Function_Geral();		
		$pkctarec = $this->_request->ctarec_id;
		
		try{
			// inciar transação
	    	$db = $this->getInvokeArg('bootstrap')->getDb();    	
	    	$db->beginTransaction();
			
			if(is_array($pkctarec)){
				foreach($pkctarec as $valor){			
					$dadosCtarec = $ctarec->find($valor)->current();
					$funcoes->excluircaixaCtarec($dadosCtarec);					
	    	        $dadosCtarec->delete();
				}				
			}else{
				$dadosCtarec = $ctarec->find($pkctarec)->current();
				$funcoes->excluircaixaCtarec($dadosCtarec);
				$dadosCtarec->delete();
			};
		    
			$db->commit();
			echo '{success: true}';		    
		}catch(Exception $e) {
			$db->rollBack();
			echo '{success: false}';
			Zend_Debug::dump($e);
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
		
		$ctarec = new Model_DbTable_Ctarec();
		$funcoes = new Model_Function_Geral();		
	    try {
	    	//-- converte para maiscula
	    	foreach($post as $campo=> $valor){	    		
	    		$post[$campo] = strtoupper(trim($valor));
	    	}
	    	$post['usuario_login'] = $funcoes->userAtivo();
	    	if($post['ctarec_id']==0){
	    		$ctarec->insert($post);   		
	    	}else{
	    		$ctarec->update($post,"ctarec_id = {$post['ctarec_id']}");	    		
	    	}   	    
		    echo '{success: true}';
		} catch(Exception $e) {
			echo '{success: false}';
			Zend_Debug::dump($e);
		}  				
	}	
}
?>

