<?php

class CtapagController extends Zend_Controller_Action {
	
	public function init()
	{
						
	}	
	
	public function indexAction()
	{			
		$this->_redirect('ctapag/listar');
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
 		
		$ctapag = new Model_DbTable_Ctapag();
		$contar = 30;
		if(!empty($value)){				
		    $contar = $ctapag->contarCtapag($field,$value);		
		}		
		$dadosCtapag = $ctapag->listarCtapag($start,$limit,$sort,$dir,$field,$value);		
		echo '{rows:',Zend_Json::encode($dadosCtapag),',totalCount: ',$contar,'}';
	}
		
	public function buscarAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true); 		 	
 			
 		try{ 			
 			$id = $this->_request->ctapag_id; 		 		
 		    $ctapag = new Model_DbTable_Ctapag();
 		    $funcoes = new Model_Function_Geral();
 		    
 		    $dadosCtapag = $ctapag->buscarCtapag('ctapag_id',$id);
 		    $dadosCtapag = current($dadosCtapag);
 		    echo '{success: true,data:',Zend_Json::encode($dadosCtapag),'}';	
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

		$ctapag = new Model_DbTable_Ctapag();
		$funcoes = new Model_Function_Geral();
		$pkctapag = $this->_request->ctapag_id;
				
		try{
			// inciar transação
	    	$db = $this->getInvokeArg('bootstrap')->getDb();    	
	    	$db->beginTransaction();
			
			if(is_array($pkctapag)){
				foreach($pkctapag as $valor){
					$dadosCtapag = $ctapag->find($valor)->current();
					$dadosCtapag->delete();
				}
			}else{
				$dadosCtapag = $ctapag->find($pkctapag)->current();
				$dadosCtapag->delete();
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
		
		$ctapag = new Model_DbTable_Ctapag();
		$pagpar = new Model_DbTable_Pagpar();
		$empresa = new Model_DbTable_Empresa();
		$caixa = new Model_DbTable_Caixa();		
		$funcoes = new Model_Function_Geral();
		$operacao = new Model_DbTable_Operacao();		
		
		try {	   	
			// incial transação
	    	$db = $this->getInvokeArg('bootstrap')->getDb();    	
	    	$db->beginTransaction();
	    	
	    	$post = $this->_request->getPost();
	    	 
	    	// busca os dados da empresa e os parametros
	    	$dadosEmpresa = current($empresa->buscarEmpresa());	    	 	
	    	$data = date('Y-m-d');
	    	
    	    /* ************************************************************
     	     * gera o contas a pagar - mov_ctapag
	    	*/	    	
	    	$dadosCtapag = array(	    	
	    	'fornecedor_id'=>$post['fornecedor_id'], 
	    	'empresa_id'=>$dadosEmpresa['empresa_id'],
	    	'operacao_id'=>$post['operacao_id'],
	    	'conta_id'=>$dadosEmpresa['conta_id'],	    	    	
	    	'ctapag_documento'=>$post['ctapag_documento'],
	    	'ctapag_data_emissao'=>$data,
	    	'ctapag_data_base'=>$data,
	    	'ctapag_ano'=>date('Y'),
	    	'fornecedor_desc'=>$post['fornecedor_desc'],
	    	'ctapag_instatus'=>'0',
	    	'ctapag_observacao'=>$post['ctapag_observacao'],
	    	'usuario_login'=>$funcoes->userAtivo()
	    	);
	    	$ctapag->insert($dadosCtapag);
	    	$pkctapag = $ctapag->getAdapter()->lastInsertId();
	    	
	    	/* ************************************************************
     	     * gera as parcelas do contas a pagar - mov_pagpar
     	    */	    	
	    	$formarec = $this->_request->formarec;
	    	$formarec = $funcoes->SubAjax($formarec);
	    	
	    	$newformarec = array();  	    	
	    	$parcela = 1;
	    	$total = 0;
	    	$pago = 0;   	
	    	
	    	for ($row = 0; $row < count($formarec); $row++)
	    	{
	    		/* ************************************************************
	        	 * monta array mov_venda_rec
	         	*/    		
	    		foreach($formarec[$row] as $key => $value)
	    		{
	    			switch($key) {
	    				case 1: $newformarec['formarec_id'] = $value;
	    				case 5: $newformarec['pagpar_data_vencto'] = $funcoes->dataeuaGeral($value);
	    				case 9: $newformarec['pagpar_valor'] = $value;
	    				case 11: $newformarec['pagpar_pago'] = $value;
	    				case 13: $newformarec['pagpar_data_pagto'] = $funcoes->dataeuaGeral($value);
	    				case 17: $newformarec['pagpar_agencia'] = $value;	    				 				
	    				case 19: $newformarec['pagpar_conta'] = $value;
	    				case 21: $newformarec['pagpar_banco'] = $value;	    				
	    				case 23: $newformarec['pagpar_cheque'] = $value;
	    				case 25: $newformarec['pagpar_parcela'] = $value;
	    			}	    				    						
	    		}	    		
	    		$newformarec['ctapag_id'] = $pkctapag;
	    		$newformarec['fornecedor_id'] = $dadosCtapag['fornecedor_id'];
	    		$newformarec['ctapag_documento'] = $dadosCtapag['ctapag_documento'];
	    		$newformarec['operacao_id'] = $dadosCtapag['operacao_id'];
	    		$newformarec['fornecedor_desc'] = $dadosCtapag['fornecedor_desc'];	    			    			    		
	    		$newformarec['usuario_login'] = $dadosCtapag['usuario_login']; 		    				    		
	
	    		$dadosPagpar = array(
	    		'fornecedor_id'=>$newformarec['fornecedor_id'],
	    		'empresa_id'=>$dadosEmpresa['empresa_id'],
	    		'ctapag_documento'=>$newformarec['ctapag_documento'],
	    		'ctapag_id'=>$newformarec['ctapag_id'],	    		
	    		'formarec_id'=>$newformarec['formarec_id'],
	    		'locpagto_id'=>$dadosEmpresa['locpagto_id'],
	    		'operacao_id'=>$newformarec['operacao_id'],
	    		'fornecedor_desc'=>$newformarec['fornecedor_desc'],
	    		'pagpar_data_emissao'=>$data,
	    		'pagpar_data_vencto'=>$newformarec['pagpar_data_vencto'], 
	    		'pagpar_valor'=>$newformarec['pagpar_valor'],
	    		'pagpar_pago'=>$newformarec['pagpar_pago'],
	    		'pagpar_data_pagto'=>$newformarec['pagpar_data_pagto'],
	    		'pagpar_agencia'=>$newformarec['pagpar_agencia'],
	    		'pagpar_conta'=>$newformarec['pagpar_conta'],
	    		'pagpar_banco'=>$newformarec['pagpar_banco'],
	    		'pagpar_cheque'=>$newformarec['pagpar_cheque'],
	    		'pagpar_parcela'=>$newformarec['pagpar_parcela'],	    		
	    		'pagpar_instatus'=>$newformarec['pagpar_pago']>0 ? '1' : '0',
	    		'pagpar_ano'=>date('Y'),	    			    		
	    		'usuario_login'=>$newformarec['usuario_login']
	    		);
	    		$pagpar->insert($dadosPagpar);
	    			    		
	    		if($newformarec['pagpar_pago']>0){	
	    			$mesano = substr($data,5,2).substr($data,0,4);
	    			$dadosOperacao = $operacao->find($newformarec['operacao_id'])->current();
	    			  			 
	    			$dadosCaixa = array(
   					'banco_id'=>$dadosOperacao['banco_id'],
   					'jazigo_codigo'=>'',
   					'empresa_id'=>$dadosEmpresa['empresa_id'],
   					'locfor_id'=>$newformarec['fornecedor_id'],   					
	    			'conta_id'=>$dadosOperacao['conta_id'],
	    			'caixa_historico'=>$dadosCtapag['ctapag_observacao'],    			
	    			'caixa_documento'=>$newformarec['ctapag_documento'],  			
	    			'caixa_data_movto'=>$data,
	    			'caixa_valor'=>$newformarec['pagpar_valor'],
   					'caixa_intipo'=>'1',
	    			'caixa_mesano'=>$mesano,	    			
	    			'locfor_desc'=>$newformarec['fornecedor_desc'],
	    			'usuario_login'=>$newformarec['usuario_login']
	    			);
	    			$caixa->insert($dadosCaixa);    			
	    		}    			    		
	    				    		
	    		$parcela++;
	    		$total += $newformarec['pagpar_valor'];
	    		$pago += $newformarec['pagpar_pago'];    		
	    	}   	
	    		    	
	    	/* ************************************************************
     	     * atualiza o contas a pagar
     	    */
	    	$saldo = $total-$pago;
	    	$dadosCtapag = array(	    	
	    	'ctapag_valor'=>$total,
	    	'ctapag_saldo'=>$saldo,
	    	'ctapag_instatus'=>$saldo==0 ? '1' : '0'
	    	);
	    	$ctapag->update($dadosCtapag,"ctapag_id = {$pkctapag}");	    	
			
		   	$db->commit();
	    	echo '{success: true}';    	
		} catch(Exception $e) {  		    
			$db->rollBack();			
			echo '{success: false}';
			Zend_Debug::dump($e);						
		}		
	}
}
?>

