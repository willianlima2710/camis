<?php

class PagparController extends Zend_Controller_Action {
	
	public function init()
	{
						
	}	
	
	public function indexAction()
	{			
		$this->_redirect('pagpar/listar');
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
 		
		$pagpar = new Model_DbTable_Pagpar();
		$contar = 30;
		if(!empty($value)){				
		    $contar = $pagpar->contarPagpar($field,$value);		
		}	
		$dadosPagpar = $pagpar->listarPagpar($start,$limit,$sort,$dir,$field,$value);
		echo '{rows:',Zend_Json::encode($dadosPagpar),',totalCount: ',$contar,'}';		
	}
		
	public function buscarAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true); 		 	
 			
 		try{ 			
 			$id = $this->_request->pagpar_id; 		 		
 		    $pagpar = new Model_DbTable_Pagpar();
 		    $funcoes = new Model_Function_Geral();
 		     		    
 		    $dadosPagpar = $pagpar->buscarPagpar('pagpar_id',$id);
 		    $dadosPagpar = current($dadosPagpar);
 		    $dadosPagpar['pagpar_data_vencto'] = $funcoes->databrGeral($dadosPagpar['pagpar_data_vencto']);
 		       		    
 		    echo '{success: true,data:',Zend_Json::encode($dadosPagpar),'}';	
		}catch(Exception $e){
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
	
		$pagpar = new Model_DbTable_Pagpar();
		$funcoes = new Model_Function_Geral();
		try {
			//-- converte para maiscula
			foreach($post as $campo=> $valor){
				$post[$campo] = strtoupper(trim($valor));
			}
			//$post["fornecedor_desc"] = substr($post['fornecedor_desc'],0,strrpos($post['fornecedor_desc'],"-")-1);
			$post["pagpar_data_vencto"] = $funcoes->dataeuaGeral($post["pagpar_data_vencto"]);
			$post['usuario_login'] = $funcoes->userAtivo();
			if($post['pagpar_id']==0){
				$pagpar->insert($post);
			}else{
				$pagpar->update($post,"pagpar_id = {$post['pagpar_id']}");
			}
			echo '{success: true}';
		} catch(Exception $e) {
			echo '{success: false}';
			Zend_Debug::dump($e);
		}
	}
	
	   
	public function baixarAction()
	{		
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true);
 		 
		$post = $this->_request->getPost();
		unset($post['action']);
		
		$pagpar = new Model_DbTable_Pagpar();
		$ctapag = new Model_DbTable_Ctapag();
		$caixa = new Model_DbTable_Caixa();
		$funcoes = new Model_Function_Geral();
						
	    try {
	    	$data = date('Y-m-d');
	    	
	    	//-- converte para maiscula
	    	foreach($post as $campo=> $valor){	    		
	    		$post[$campo] = strtoupper(trim($valor));
	    	}   	
	    	$post['pagpar_instatus'] = '1';
	    	$post["pagpar_data_vencto"] = $funcoes->dataeuaGeral($post["pagpar_data_vencto"]);	    	
	    	$post["pagpar_data_pagto"] = $funcoes->dataeuaGeral($post["pagpar_data_pagto"]);
	    	$post['usuario_login'] = $funcoes->userAtivo();
	    	
	    	if($post['pagpar_id']==0){
	    		$pagpar->insert($post);   		
	    	}else{
	    		$pagpar->update($post,"pagpar_id = {$post['pagpar_id']}");

	    		//Busca o cabeçalho do contas a pagar
	    		$dadosCtapag = $ctapag->find($post['ctapag_id'])->current();
	    		 
	    		/************************************************
		    	 * lança no movimento de caixa
		    	 */
		    	$mesano = substr($data,5,2).substr($data,0,4);
		    	$dadosCaixa = array(
		    	'jazigo_codigo'=>'',
		    	'empresa_id'=>$dadosCtapag['empresa_id'],
		    	'locfor_id'=>$dadosCtapag['fornecedor_id'],
		    	'banco_id'=>$post['banco_id'],
		    	'conta_id'=>$post['conta_id'],
		    	'caixa_historico'=>$post['pagpar_historico'],
		    	'caixa_obs'=>$post['pagpar_observacao'],
		    	'caixa_documento'=>$dadosCtapag['ctapag_documento'],
		    	'caixa_data_movto'=>$post["pagpar_data_pagto"],
		    	'caixa_valor'=> $post['pagpar_valor'],
		    	'caixa_intipo'=>'1',
		    	'caixa_mesano'=>$mesano,
		    	'locfor_desc'=>$dadosCtapag['fornecedor_desc'],
	   			'usuario_login'=>$funcoes->userAtivo()
		    	);    	
		    	$caixa->insert($dadosCaixa);

		    	//-- atualiza o contas a pagar
		    	$saldo = $dadosCtapag['ctapag_saldo'] - $post['pagpar_valor'];
		    	 
		    	$dadosCtapag = array(
		    	'ctapag_saldo'=>$saldo,
		    	'ctapag_instatus'=>$saldo==0 ? '1' : '0'
		    	);
		    	$ctapag->update($dadosCtapag,"ctapag_id = {$post['ctapag_id']}");   		
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
 		    $pagpar = new Model_DbTable_Pagpar(); 		    
 		    $dadosPagpar = $pagpar->todoPagpar();
 		    echo Zend_Json::encode($dadosPagpar); 		    
		}catch(Exception $e){
			echo '{success: false}';
			// Zend_Debug::dump($e);
		}
	}	
}
?>

