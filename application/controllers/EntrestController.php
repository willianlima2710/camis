	<?php

class EntrestController extends Zend_Controller_Action {
	
	public function init()
	{
						
	}	
	
	public function indexAction()
	{			
		$this->_redirect('entrest/listar');
	}
			
	public function listarAction()
	{
		// Desativando renderiza��o do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderiza��o da view
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
 		
		$entrest = new Model_DbTable_Entrest();
		$contar = 30;
		if(!empty($value)){				
		    $contar = $entrest->contarEntrest($field,$value);		
		}		
		$dadosEntrest = $entrest->listarEntrest($start,$limit,$sort,$dir,$field,$value);
		echo '{rows:',Zend_Json::encode($dadosEntrest),',totalCount: ',$contar,'}';		
	}
		
	public function buscarAction()
	{
		// Desativando renderiza��o do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderiza��o da view
 		$this->_helper->_viewRenderer->setNoRender(true); 		 	
 			
 		try{ 			
 			$id = (int)$this->_request->entrest_id; 		 		
 		    $entrest = new Model_DbTable_Entrest();
 		    $funcoes = new Model_Function_Geral(); 		    
 		    
 		    $dadosEntrest = $entrest->buscarEntrest('entrest_id',$id);
 		    $dadosEntrest = current($dadosEntrest);
 		    
 		    $dadosEntrest['entrest_data'] = $funcoes->databrGeral($dadosEntrest['entrest_data']);
 		    $dadosEntrest['entrest_emissao'] = $funcoes->databrGeral($dadosEntrest['entrest_emissao']);
 		    
 		    echo '{success: true,data:',Zend_Json::encode($dadosEntrest),'}';	
		}catch(Exception $e){
			echo '{success: false}';
			// Zend_Debug::dump($e);
		} 		     			
	}
	
	public function excluirAction()	
	{
		// Desativando renderiza��o do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderiza��o da view
 		$this->_helper->_viewRenderer->setNoRender(true); 

		$entrest = new Model_DbTable_Entrest();
		$pkEntrest = $this->_request->entrest_id;
		
		try{
			if(is_array($pkEntrest)){
				foreach($pkEntrest as $valor){
					$dadosEntrest = $entrest->find((int)$valor)->current();
					$dadosEntrest->delete();
				}
			}else{
				$dadosEntrest = $entrest->find((int)$pkEntrest)->current();
				$dadosEntrest->delete();
			};
		    echo '{success: true}';
		}catch(Exception $e) {
			echo '{success: false}';
			// Zend_Debug::dump($e);
		}
	}
	   
	public function salvarAction()
	{		
		// Desativando renderiza��o do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderiza��o da view
 		$this->_helper->_viewRenderer->setNoRender(true);
 		 
		$post = $this->_request->getPost();
		unset($post['action']);
		
		$entrest = new Model_DbTable_Entrest();
		$entrestprod = new Model_DbTable_Entrestprod();
		$empresa = new Model_DbTable_Empresa();
		$fornecedor = new Model_DbTable_Fornecedor();
		$prodserv = new Model_DbTable_Prodserv();		
		$funcoes = new Model_Function_Geral();
	    try {
	    	//-- converte para maiscula
	    	foreach($post as $campo=> $valor){	    		
	    		$post[$campo] = strtoupper(trim($valor));
	    	}
	    	$post['usuario_login'] = $funcoes->userAtivo();    	
	    	
	    	$dadosEmpresa = $empresa->find((int)$post['empresa_id'])->current();
	    	$dadosFornecedor = $fornecedor->find((int)$post['fornecedor_id'])->current();
	    	
	    	// incial transa��o
	    	$db = $this->getInvokeArg('bootstrap')->getDb();    	
	    	$db->beginTransaction();
	    	
	    	//valida os valores
	    	$post['entrest_frete'] = empty($post['entrest_frete']) ? 0 : $post['entrest_frete'];   
	    	$post['entrest_seguro'] = empty($post['entrest_seguro']) ? 0 : $post['entrest_seguro'];  
	    	$post['entrest_despesa'] = empty($post['entrest_despesa']) ? 0 : $post['entrest_despesa'];	    		    	
	    	
	    	/* ************************************************************
     	     * inclui o cabecalho da entrest mov_entrest
     	    */  	
	    	$dadosEntrest = array(
	    	'fornecedor_id'=>$dadosFornecedor['fornecedor_id'],
	    	'empresa_id'=>$dadosEmpresa['empresa_id'],
	    	'notafis_numero'=>$post['notafis_numero'],
	    	'entrest_intipo'=>'0',
	    	'fornecedor_desc'=>$dadosFornecedor['fornecedor_desc'],
	    	'fornecedor_cpfcnpj'=>$dadosFornecedor['fornecedor_cpfcnpj'],
	    	'fornecedor_endereco'=>$dadosFornecedor['fornecedor_endereco'],
	    	'fornecedor_numero'=>$dadosFornecedor['fornecedor_numero'],
	    	'fornecedor_complem'=>$dadosFornecedor['fornecedor_complem'],
	    	'fornecedor_bairro'=>$dadosFornecedor['fornecedor_bairro'],
	    	'fornecedor_cidade'=>$dadosFornecedor['fornecedor_cidade'],
	    	'fornecedor_cep'=>$dadosFornecedor['fornecedor_cep'],
	    	'estado_sigla'=>$dadosFornecedor['estado_sigla'],
	    	'pais_sigla'=>$dadosFornecedor['pais_sigla'],
	    	'fornecedor_telefone'=>$dadosFornecedor['fornecedor_telefone'],
	    	'entrest_data'=>$funcoes->dataeuaGeral($post['entrest_data']),
	    	'entrest_emissao'=>$funcoes->dataeuaGeral($post['entrest_emissao']),
	    	'entrest_hora'=>$post['entrest_hora'],
	    	'entrest_serie'=>$post['entrest_serie'],
	    	'entrest_base_icms'=>0,
	    	'entrest_valor_icms'=>0,
	    	'entrest_base_icms_subst'=>0,
	    	'entrest_valor_icms_subst'=>0,
	    	'entrest_base_ipi'=>0,
	    	'entrest_total_prod'=>0,
	    	'entrest_desconto'=>0,
	    	'entrest_total'=>0,
	    	'entrest_frete'=>0,
	    	'entrest_seguro'=>0,
	    	'entrest_despesa'=>0,
	    	'entrest_ipi'=>0,
	    	'entrest_pis'=>0,
	    	'entrest_cofins'=>0,
	    	'entrest_observacao'=>$post['entrest_observacao'],
	    	'entrest_pedido'=>$post['entrest_pedido'],
	    	'usuario_login'=>$post['usuario_login']  	
	    	);	    		    	
    		if($post['entrest_id']==0){
    			$entrest->insert($dadosEntrest);
    		    $pkentrest = $entrest->getAdapter()->lastInsertId();			
    		}else{
    			$entrest->update($dadosEntrest,"entrest_id = {$post['entrest_id']}");
    			$pkentrest = $post['entrest_id'];
    		}   		
    		

	    	/* ************************************************************
     	     * inclui os prodservs mov_entrest_prod
     	    */ 
    		
    		//exclui os prodservs da entrest
	    	$condicao = array(
	        'entrest_id = ?'=>$pkentrest,
	        'fornecedor_id = ?'=>$dadosEntrest['fornecedor_id'],
	        'empresa_id = ?'=>$dadosEntrest['empresa_id'],
	    	'notafis_numero = ?'=>$dadosEntrest['notafis_numero'],
	    	'entrest_intipo = ?'=>$dadosEntrest['entrest_intipo'],
	        );
	        $entrestprod->delete($condicao);
	           		
    		$total = 0;
    		$jsonentrestprod = $this->_request->entrestprod;    		
    		for ($row = 0; $row < count($jsonentrestprod,COUNT_RECURSIVE); $row++)
    		{    			
    			$json = json_decode($jsonentrestprod[$row]);    			
    			
    		    $dadosEntrestprod = array(
    		    'entrest_id'=>$pkentrest,
    		    'fornecedor_id'=>$dadosEntrest['fornecedor_id'],
    		    'empresa_id'=>$dadosEntrest['empresa_id'],
    		    'notafis_numero'=>$dadosEntrest['notafis_numero'],
    		    'entrest_intipo'=>$dadosEntrest['entrest_intipo'],
    		    'prodserv_id'=>$json->prodserv_id,
    		    'prodserv_desc'=>$json->prodserv_desc,
    		    'unidade_sigla'=>'UN',
    		    'entrestprod_quantidade'=>$json->entrestprod_quantidade,
    		    'entrestprod_valor'=>$json->entrestprod_valor,
    		    'entrestprod_desconto'=>0,
    		    'entrestprod_total'=>$json->entrestprod_total,    		    
    		    'entrestprod_perc_icms'=>0,
    		    'entrestprod_perc_ipi'=>0,
    		    'entrestprod_valor_icms'=>0,
    		    'entrestprod_valor_ipi'=>0,
    		    'entrestprod_base_icms'=>0,
    		    'entrestprod_base_ipi'=>0,
    		    'entrestprod_icms_subst'=>0,
    		    'entrestprod_base_icms_subst'=>0,
    		    'usuario_login'=>$post['usuario_login']
    		    );    		    
    		    $entrestprod->insert($dadosEntrestprod);    			
    		    $totprod += $dadosEntrestprod['entrestprod_total'];
    		    
    		    //-- atualiza o estoque    		    
    		    $dadosProdserv = $prodserv->find($dadosEntrestprod['prodserv_id'])->current();
    		    $saldo = $dadosProdserv['prodserv_saldo'] + $dadosEntrestprod['entrestprod_quantidade'];
    		    
    		    $dadosProdserv = array(
				'prodserv_saldo'=>$saldo,
				'prodserv_valor'=>$dadosEntrestprod['entrestprod_valor']
    		    );    		    
    		    $prodserv->update($dadosProdserv,"prodserv_id = {$dadosEntrestprod['prodserv_id']}");    		    
    		}
	    	
	    	/* ************************************************************
     	     * atualiza o cabe�alho de entrests
     	    */
    		$totgeral += $post['entrest_frete']+$post['entrest_seguro']+$post['entrest_despesa']+$totprod;    		
	    	$dadosEntrest = array(	    	
	    	'entrest_total'=>$totgeral,
	    	'entrest_total_prod'=>$totprod	    		    	
	    	);    	
	    	$entrest->update($dadosEntrest,"entrest_id = {$pkentrest}");      		
	    	
    		$db->commit();    		
		    echo "{success: true,id: '{$pkentrest}'}";
		} catch(Exception $e) {
			$db->rollBack();
			echo '{success: false}';
			Zend_Debug::dump($e);
		}  				
	}
	public function lancarAction()
	{
		// Desativando renderiza��o do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderiza��o da view
 		$this->_helper->_viewRenderer->setNoRender(true);
 		 
		$post = $this->_request->getPost();
		unset($post['lancar']);
		
		$pagpar = new Model_DbTable_Pagpar();
		$funcoes = new Model_Function_Geral();	
	    try {
	    	
	    	$post['usuario_login'] = $funcoes->userAtivo();
	    	$parcela = 1;
	    	
	    	// incia transa��o
	    	$db = $this->getInvokeArg('bootstrap')->getDb();    	
	    	$db->beginTransaction();

	    	$jsonentrestparc =  $this->_request->entrestparc;
	    	for ($row = 0; $row < count($jsonentrestparc,COUNT_RECURSIVE); $row++)
	    	{
	    		$json = json_decode($jsonentrestparc[$row]);

	    		$dadosPagpar = array(
	    		'fornecedor_id'=>$post['fornecedor_id'],
	    		'empresa_id'=>$post['empresa_id'],
	    		'ctapag_documento'=>$json->entrest_documento,
	    		'ctapag_id'=>1,	    		
	    		'formarec_id'=>3,
	    		'locpagto_id'=>2,
	    		'operacao_id'=>5,
	    		'fornecedor_desc'=>$post['fornecedor_desc'],
	    		'banco_id'=>$post['empresa_id'],
	    		'conta_id'=>37,				
	    		'pagpar_data_emissao'=>date('Y/m/d'),
	    		'pagpar_data_vencto'=>$funcoes->dataeuaGeral($json->entrest_vencimento),
	    		'pagpar_data_doc'=>$funcoes->dataeuaGeral($json->entrest_vencimento),		 
	    		'pagpar_valor'=>$json->entrest_prestacao,
	    		'pagpar_pago'=>0,
	    		'pagpar_data_pagto'=>null,
	    		'pagpar_agencia'=>'',
	    		'pagpar_conta'=>'',
	    		'pagpar_banco'=>'',
	    		'pagpar_cheque'=>'',
	    		'pagpar_parcela'=>$parcela,	    		
	    		'pagpar_instatus'=>'0',
	    		'pagpar_ano'=>date('Y'),	    			    		
	    		'usuario_login'=>$post['usuario_login']
	    		);
	    		$pagpar->insert($dadosPagpar);

		    	$parcela++;	    		
	    	}
	    	
	    	$db->commit();	    	
		    echo "{success: true}";		    
		} catch(Exception $e) {
			$db->rollBack();
			echo '{success: false}';
			Zend_Debug::dump($e);
		}		
	} 
}
?>

