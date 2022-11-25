<?php

define('FPDF_FONTPATH', '../framework/fpdf/font/');
require_once('../framework/fpdf/fpdf.php'); 

class ContratoController extends Zend_Controller_Action {
	
	public function init()
	{
		
	}	
	
	public function indexAction()
	{			
		$this->_redirect('contrato/listar');
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
 		
		$contrato = new Model_DbTable_Contrato();
		$contar = 30;
		if(!empty($value)){				
		    $contar = $contrato->contarContrato($field,$value);		
		}		
		$dadosContrato = $contrato->listarContrato($start,$limit,$sort,$dir,$field,$value);
		echo '{rows:',Zend_Json::encode($dadosContrato),',totalCount: ',$contar,'}';		
	}
		
	public function buscarAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true); 		 	
 			
 		try{ 			
 			$id = $this->_request->contrato_id; 		 		
 		    $contrato = new Model_DbTable_Contrato();
 		    $dadosContrato = $contrato->buscarContrato('contrato_id',$id);
 		    echo '{success: true,data:',Zend_Json::encode(current($dadosContrato)),'}';	
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

		$contrato = new Model_DbTable_Contrato();
		$pkcontrato = $this->_request->contrato_id;
		
		try{
			if(is_array($pkcontrato)){
				foreach($pkcontrato as $valor){
					$dadosContrato = $contrato->find($valor)->current();
					$dadosContrato->delete();
				}
			}else{
				$dadosContrato = $contrato->find($pkcontrato)->current();
				$dadosContrato->delete();
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
		unset($post['separ1']);
		
		$contrato = new Model_DbTable_Contrato();
		$funcoes = new Model_Function_Geral();		
	    try {
	    	//-- converte para maiscula
	    	foreach($post as $campo=> $valor){	    		
	    		$post[$campo] = strtoupper(trim($valor));
	    	}   	
	    	$post['contrato_numero'] = empty($post['contrato_numero']) ? '0' : $post['contrato_numero'];  
	    	$post['contrato_data_cadastro'] = $funcoes->dataeuaGeral($post['contrato_data_cadastro']);	    	
	    	$post['contrato_proximo_vencto'] = $funcoes->dataeuaGeral($post['contrato_proximo_vencto']);
	    	$post['usuario_login'] = $funcoes->userAtivo();
	    	if($post['contrato_id']==0){
	    		$contrato->insert($post);
	    		$pkcontrato = $contrato->getAdapter()->lastInsertId();   		
	    	}else{
	    		$contrato->update($post,"contrato_id = {$post['contrato_id']}");
	    		$pkcontrato = $post['contrato_id'];	    		
	    	}   	    
		    echo "{success: true,contrato_id: $pkcontrato}";
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
 		    $contrato = new Model_DbTable_Contrato(); 		    
 		    $dadosContrato = $contrato->todoContrato();
 		    echo Zend_Json::encode($dadosContrato); 		    
		}catch(Exception $e){
			echo '{success: false}';
			// Zend_Debug::dump($e);
		}
	}
	
	public function imprimirAction()
	{
				// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true);
 		
 		$funcoes = new Model_Function_Geral(); 		        
 		try {			
 			$value = $this->_request->value;
            $arquivo = './public/tmp/'.$value.'.PDF';   		    
		    echo "<iframe src=$arquivo style=border:0 width=100% height=100%'></iframe>";		
 		}catch(Exception $e){
			Zend_Debug::dump($e);
		}
	}
}
?>

