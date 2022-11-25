<?php

class TpcontratoController extends Zend_Controller_Action {
	
	public function init()
	{
		
	}	
	
	public function indexAction()
	{			
		$this->_redirect('tpcontrato/listar');
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
 		
		$tpcontrato = new Model_DbTable_Tpcontrato();
		$contar = 30;
		if(!empty($value)){				
		    $contar = $tpcontrato->contarTpcontrato($field,$value);		
		}		
		$dadosTpcontrato = $tpcontrato->listarTpcontrato($start,$limit,$sort,$dir,$field,$value);
		echo '{rows:',Zend_Json::encode($dadosTpcontrato),',totalCount: ',$contar,'}';		
	}
		
	public function buscarAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true); 		 	
 			
 		try{ 			
 			$id = $this->_request->tpcontrato_id; 		 		
 		    $tpcontrato = new Model_DbTable_Tpcontrato();
 		    $dadosTpcontrato = $tpcontrato->buscarTpcontrato('tpcontrato_id',$id);
 		    echo '{success: true,data:',Zend_Json::encode(current($dadosTpcontrato)),'}';	
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

		$tpcontrato = new Model_DbTable_Tpcontrato();
		$pktpcontrato = $this->_request->tpcontrato_id;
		
		try{
			if(is_array($pktpcontrato)){
				foreach($pktpcontrato as $valor){
					$dadosTpcontrato = $tpcontrato->find($valor)->current();
					$dadosTpcontrato->delete();
				}
			}else{
				$dadosTpcontrato = $tpcontrato->find($pktpcontrato)->current();
				$dadosTpcontrato->delete();
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
		
		$tpcontrato = new Model_DbTable_Tpcontrato();
		$funcoes = new Model_Function_Geral();		
	    try {
	    	//-- converte para maiscula
	    	foreach($post as $campo=> $valor){	    		
	    		$post[$campo] = strtoupper(trim($valor));
	    	}   	
	    	$post['usuario_login'] = $funcoes->userAtivo();
	    	if($post['tpcontrato_id']==0){
	    		$tpcontrato->insert($post);   		
	    	}else{
	    		$tpcontrato->update($post,"tpcontrato_id = {$post['tpcontrato_id']}");	    		
	    	}   	    
		    echo '{success: true}';
		} catch(Exception $e) {
			echo '{success: false}';
			Zend_Debug::dump($e);
		}  				
	}

    public function todoAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true); 		 	
 			
 		try{	 		
 		    $tpcontrato = new Model_DbTable_Tpcontrato(); 		    
 		    $dadosTpcontrato = $tpcontrato->todoTpcontrato();
 		    echo Zend_Json::encode($dadosTpcontrato); 		    
		}catch(Exception $e){
			echo '{success: false}';
			// Zend_Debug::dump($e);
		}
	}
}
?>

