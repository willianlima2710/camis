<?php

class HistoricoController extends Zend_Controller_Action {
	
	public function init()
	{
						
	}	
	
	public function indexAction()
	{			
		$this->_redirect('historico/listar');
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
 		
		$historico = new Model_DbTable_Historico();
		$contar = 30;
		if(!empty($value)){				
		    $contar = $historico->contarHistorico($field,$value);		
		}	
		$dadosHistorico = $historico->listarHistorico($start,$limit,$sort,$dir,$field,$value);
		echo '{rows:',Zend_Json::encode($dadosHistorico),',totalCount: ',$contar,'}';		
	}
		
	public function buscarAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true); 		 	
 			
 		try{ 			
 			$id = $this->_request->historico_id; 		 		
 		    $historico = new Model_DbTable_Historico();
 		    $dadosHistorico = $historico->buscarHistorico('historico_id',$id);
 		    echo '{success: true,data:',Zend_Json::encode(current($dadosHistorico)),'}';	
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

		$historico = new Model_DbTable_Historico();
		$pkhistorico = $this->_request->historico_id;
		
		try{
			if(is_array($pkhistorico)){
				foreach($pkhistorico as $valor){
					$dadosHistorico = $historico->find($valor)->current();
					$dadosHistorico->delete();
				}
			}else{
				$dadosHistorico = $historico->find($pkhistorico)->current();
				$dadosHistorico->delete();
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
		
		$historico = new Model_DbTable_Historico();
		$funcoes = new Model_Function_Geral();		
	    try {
	    	//-- converte para maiscula
	    	foreach($post as $campo=> $valor){	    		
	    		$post[$campo] = strtoupper(trim($valor));
	    	}
	    	$post['usuario_login'] = $funcoes->userAtivo();   	
	    	if($post['historico_id']==0){
	    		$historico->insert($post);   		
	    	}else{
	    		$historico->update($post,"historico_id = {$post['historico_id']}");	    		
	    	}   	    
		    echo '{success: true}';
		} catch(Exception $e) {
			echo '{success: false}';
			//Zend_Debug::dump($e);
		}  				
	}     
}
?>

