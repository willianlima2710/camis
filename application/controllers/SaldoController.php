<?php

class SaldoController extends Zend_Controller_Action {
	
	public function init()
	{
						
	}	
	
	public function indexAction()
	{			
		$this->_redirect('saldo/listar');
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
 		
		$saldo = new Model_DbTable_Saldo();
		$contar = 30;
		if(!empty($value)){				
		    $contar = $saldo->contarSaldo($field,$value);		
		}	
		$dadosSaldo = $saldo->listarSaldo($start,$limit,$sort,$dir,$field,$value);
		echo '{rows:',Zend_Json::encode($dadosSaldo),',totalCount: ',$contar,'}';		
	}
		
	public function buscarAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true); 		 	
 			
 		try{ 			
 			$id = $this->_request->saldo_id; 		 		
 		    $saldo = new Model_DbTable_Saldo();
 		    $dadosSaldo = $saldo->buscarSaldo('saldo_id',$id);
 		    echo '{success: true,data:',Zend_Json::encode(current($dadosSaldo)),'}';	
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

		$saldo = new Model_DbTable_Saldo();
		$pksaldo = $this->_request->saldo_id;
		
		try{
			if(is_array($pksaldo)){
				foreach($pksaldo as $valor){
					$dadosSaldo = $saldo->find($valor)->current();
					$dadosSaldo->delete();
				}
			}else{
				$dadosSaldo = $saldo->find($pksaldo)->current();
				$dadosSaldo->delete();
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
		
		$saldo = new Model_DbTable_Saldo();
		$post['usuario_login'] = $funcoes->userAtivo();		
	    try {
	    	//-- converte para maiscula
	    	foreach($post as $campo=> $valor){	    		
	    		$post[$campo] = strtoupper(trim($valor));
	    	}   	
	    	$post['usuario_login'] = $funcoes->userAtivo();
	    	if($post['saldo_id']==0){
	    		$saldo->insert($post);   		
	    	}else{
	    		$saldo->update($post,"saldo_id = {$post['saldo_id']}");	    		
	    	}   	    
		    echo '{success: true}';
		} catch(Exception $e) {
			echo '{success: false}';
			//Zend_Debug::dump($e);
		}  				
	}
}
?>

