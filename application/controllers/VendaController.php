<?php

class VendaController extends Zend_Controller_Action {
	
	public function init()
	{
						
	}	
	
	public function indexAction()
	{			
		$this->_redirect('venda/listar');
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
 		
		$venda = new Model_DbTable_Venda();
		$contar = 30;
		if(!empty($value)){				
		    $contar = $venda->contarVenda($field,$value);		
		}	
		$dadosVenda = $venda->listarVenda($start,$limit,$sort,$dir,$field,$value);
		echo '{rows:',Zend_Json::encode($dadosVenda),',totalCount: ',$contar,'}';		
	}
		
	public function buscarAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true); 		 	
 			
 		try{ 			
 			$id = $this->_request->venda_id; 		 		
 		    $venda = new Model_DbTable_Venda();
 		    $dadosVenda = $venda->buscarVenda('venda_id',$id);
 		    echo '{success: true,data:',Zend_Json::encode(current($dadosVenda)),'}';	
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

		$venda = new Model_DbTable_Venda();
		$pkvenda = $this->_request->venda_id;
		
		try{
			if(is_array($pkvenda)){
				foreach($pkvenda as $valor){
					$dadosVenda = $venda->find($valor)->current();
					$dadosVenda->delete();
					
					
				}
			}else{
				$dadosVenda = $venda->find($pkvenda)->current();
				$dadosVenda->delete();
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
		
		$venda = new Model_DbTable_Venda();
		$vendapdsv = new Model_DbTable_Vendapdsv();
		$vendarec = new Model_DbTable_Vendarec();
		$ctarec = new Model_DbTable_Ctarec();
		$recpar = new Model_DbTable_Recpar();
		$empresa = new Model_DbTable_Empresa();
		$caixa = new Model_DbTable_Caixa();		
		$funcoes = new Model_Function_Geral();
		$operacao = new Model_DbTable_Operacao();
		$prodserv = new Model_DbTable_Prodserv();
	    
		try {				    	
	    	// incial transação
	    	$db = $this->getInvokeArg('bootstrap')->getDb();    	
	    	$db->beginTransaction();
	    		    	
	    	// busca os dados da empresa e os parametros
	    	$dadosEmpresa = current($empresa->buscarEmpresa());
	    	$documento = $dadosEmpresa['empresa_documento'] + 1;
	    	$post = $this->_request->getPost();
	    	$data = date('Y-m-d');	 //$funcoes->dataeuaGeral($post['venda_data']);
	    	$vencimento = $funcoes->dataeuaGeral($post['venda_data_vencimento']);
	    	$formarec = $this->_request->formarec;
	    		    	
            /* ************************************************************
	    	 * monta o arquivo de vendas
	    	*/    	
	    	$dadosVenda = array(	    	
	    	'locatario_id'=>$post['locatario_id'],
	    	'locatario_desc'=>substr($post['locatario_desc'],0,strrpos($post['locatario_desc'],"-")-1),
	    	'jazigo_codigo'=>$post['jazigo_codigo'],
	    	'operacao_id'=>$post['operacao_id'],
	    	'venda_documento'=>$documento,
	    	'venda_infaturar'=>!isset($post['venda_infaturar']) ? '0' : '1',
	    	'venda_data'=>$data,
	    	'venda_data_vencimento'=>$vencimento,
	    	'venda_sacado'=>strtoupper($post['venda_sacado']),
	    	'venda_formulario'=>strtoupper($post['venda_formulario']),						
	    	'usuario_login'=>$funcoes->userAtivo()
	    	);	    		    	
    		$venda->insert($dadosVenda);	    		
     		$pkvenda = $venda->getAdapter()->lastInsertId();

     		/* ************************************************************
     		 * busca a forma de recebimento
     		*/     		    
     		for ($row = 0; $row < count($formarec,COUNT_RECURSIVE); $row++)
     		{
     			$json = json_decode($formarec[$row]);
     		}     		 
     			    		    		   		
            /* ************************************************************
	    	 * grava ou atualiza os produtos/serviços da venda
	    	 * mov_pdsv
	    	*/     		
	    	$pdsv = $this->_request->pdsv;
	    	$pdsv = $funcoes->SubAjax($pdsv);
	    	
	    	$newpdsv = array();  	    	
	    	for ($row = 0; $row < count($pdsv); $row++)
	    	{
	    		foreach($pdsv[$row] as $key => $value)
	    		{
	    			switch($key) {
	    				case 1: $newpdsv['prodserv_id'] = $value;
	    				case 5: $newpdsv['venda_pdsv_quantidade'] = $value;
	    				case 7: $newpdsv['venda_pdsv_valor'] = $value;
	    				case 9: $newpdsv['venda_pdsv_total'] = $value; 				
	    			}	    				    						
	    		}
	    		$newpdsv['venda_id'] = $pkvenda;
	    		$newpdsv['locatario_id'] = $dadosVenda['locatario_id'];
	    		$newpdsv['jazigo_codigo'] = $dadosVenda['jazigo_codigo'];	    		
	    		$newpdsv['usuario_login'] = $dadosVenda['usuario_login'];		    		
	    		$vendapdsv->insert($newpdsv);
	    		
	    		//-- lança no caixa
	    		/*
	    		$dadosProdserv = $prodserv->find($newpdsv['prodserv_id'])->current();	    		
	    		
	    		if(count($dadosProdserv)!=0 || $json->formarec_id==1){	    				    				
	    			$mesano = substr($data,5,2).substr($data,0,4);	    			
	    			$dadosCaixa = array(
   					'banco_id'=>$dadosProdserv['banco_id'],
   					'jazigo_codigo'=>$dadosVenda['jazigo_codigo'],
  					'empresa_id'=>$dadosEmpresa['empresa_id'],
   					'locfor_id'=>$dadosVenda['locatario_id'],
   					'conta_id'=>$dadosProdserv['conta_id'],
   					'caixa_historico'=>$dadosProdserv['prodserv_desc'],
   					'caixa_obs'=>'VENDA',
   					'caixa_documento'=>$pkvenda,
   					'caixa_data_movto'=>$data,
   					'caixa_valor'=>$newpdsv['venda_pdsv_total'],
   					'caixa_intipo'=>'0',
   					'caixa_mesano'=>$mesano,
   					'locfor_desc'=>$dadosVenda['locatario_desc'],
   					'usuario_login'=>$funcoes->userAtivo()
	    			);
	    			$caixa->insert($dadosCaixa);
	    			 
    			    $funcoes->atzSaldo($dadosCaixa['banco_id'],
	    			           		   $dadosCaixa['caixa_mesano'],
	    			 		           $dadosCaixa['caixa_valor'],
	    			 		           $dadosCaixa['caixa_intipo'],
	    			 		           $dadosCaixa['usuario_login']);   			
	    		}	
	    		*/    		
	    	}  	        
	    	
            /* ************************************************************
     	     * gera o contas a receber - mov_ctarec
	    	*/
	    	$dadosCtarec = array(	    	
	    	'locatario_id'=>$dadosVenda['locatario_id'], 
	    	'jazigo_codigo'=>$dadosVenda['jazigo_codigo'],
	    	'empresa_id'=>$dadosEmpresa['empresa_id'],
	    	'operacao_id'=>$dadosVenda['operacao_id'],	
	    	'portador_id'=>$dadosEmpresa['portador_id'],
	    	'conta_id'=>$dadosEmpresa['conta_id'],    	
	    	'ctarec_documento'=>$documento,
	    	'ctarec_data_emissao'=>$data,
	    	'ctarec_data_base'=>$data,
	    	'ctarec_ano'=>date('Y'),
	    	'locatario_desc'=>$dadosVenda['locatario_desc'],
	    	'ctarec_instatus'=>'0',
	    	'usuario_login'=>$dadosVenda['usuario_login']   		
	    	);
	    	$ctarec->insert($dadosCtarec);
	    	$pkctarec = $ctarec->getAdapter()->lastInsertId();

	    	/* ************************************************************
     	     * gera as parcelas do contas a receber - mov_recpar
     	    */	    
	    	$dadosOperacao = $operacao->find($dadosVenda['operacao_id'])->current();	    	
	    	$mes = 1;	    
	    	$dia = $post['venda_dia_vencto'];	
	    	$funcoes = new Model_Function_Geral();
	    	$parcela = 1;
	    	
	    	for ($row = 0; $row < count($formarec,COUNT_RECURSIVE); $row++)
	    	{	    			    		
	    		$json = json_decode($formarec[$row]);
                
	    		if($row>=1){
	    			$vencto = date("Y-m-$dia",strtotime("+$mes month"));
	    			$mes += 1;	    				    			
	    		}else{
	    			$vencto = date("Y-m-d");
	    		} 			 	    			
	    		
	    		$dadosVendarec = array(
	    		'venda_id'=>$pkvenda,
	    		'locatario_id'=>$dadosVenda['locatario_id'],
	    		'jazigo_codigo'=>$dadosVenda['jazigo_codigo'],
	    		'formarec_id'=>$json->formarec_id,
	    		'venda_rec_data_vencto'=>$vencto,
	    		'venda_rec_valor'=>$json->venda_rec_valor,
	    		'venda_rec_pago'=>$json->venda_rec_pago,
	   			'venda_rec_data_pagto'=>($json->venda_rec_pago==0) ? null : $vencto,	    			
	    		'venda_rec_agencia'=>'',
	    		'venda_rec_conta'=>'',
	    		'venda_rec_banco'=>'',
	    		'venda_rec_cheque'=>'',
	    		'venda_rec_parcela'=>$parcela,
	    		'usuario_login'=>$dadosVenda['usuario_login']
	    		);	    		
	    		$vendarec->insert($dadosVendarec); 

	    		//vencimento e pagamento
	    		if($dadosOperacao['operacao_tempo']!=0) {
	    			if($json->formarec_id==1 || $json->formarec_id==4 || $json->formarec_id==5)  {
	    				$vencto = $vencimento;
	    				$pagto = $data;
	    			}else{
	    				$vencto = $vencimento;
	    				$pagto =  null;
	    			}
	    		}else{
	    			if($json->formarec_id==1 || $json->formarec_id==4 || $json->formarec_id==5)  {
	    				$vencto = $data;
	    				$pagto = $data;
	    			}else{
	    				$vencto = $dadosVendarec['venda_rec_data_vencto'];
	    				$pagto =  $dadosVendarec['venda_rec_data_pagto'];
	    			}    			
	    		}
	
	    		$dadosRecpar = array(
	    		'locatario_id'=>$dadosVenda['locatario_id'],
	    		'jazigo_codigo'=>$dadosVenda['jazigo_codigo'],
   				'empresa_id'=>$dadosEmpresa['empresa_id'],
	    		'ctarec_documento'=>$documento,
   				'ctarec_id'=>$pkctarec,
   				'formarec_id'=>$dadosVendarec['formarec_id'],
  				'locpagto_id'=>$dadosEmpresa['locpagto_id'],
  				'operacao_id'=>$dadosVenda['operacao_id'],
  				'portador_id'=>$dadosEmpresa['portador_id'],
	    		'banco_id'=>$dadosOperacao['banco_id'],		
	    		'conta_id'=>$dadosOperacao['conta_id'],	    		
	    		'recpar_data_emissao'=>$data,
	    		'recpar_data_vencto'=>$vencto, 
	    		'recpar_valor'=>$dadosVendarec['venda_rec_valor'],
	    		'recpar_pago'=>$dadosVendarec['venda_rec_pago'],
	    		'recpar_data_pagto'=>$pagto,
	    		'recpar_agencia'=>$dadosVendarec['venda_rec_agencia'],
	    		'recpar_conta'=>$dadosVendarec['venda_rec_conta'],
	    		'recpar_banco'=>$dadosVendarec['venda_rec_banco'],
	    		'recpar_cheque'=>$dadosVendarec['venda_rec_cheque'],
	    		'recpar_parcela'=>$dadosVendarec['venda_rec_parcela'],	    		
	    		'recpar_instatus'=>$dadosVendarec['venda_rec_pago']>0 ? '1' : '0',
	    		'recpar_ano'=>date('Y'),
	    		'locatario_desc'=>$dadosVenda['locatario_desc'],
	    		'recpar_sacado'=>empty($dadosVenda['venda_sacado']) ? $dadosVenda['locatario_desc'] : $dadosVenda['venda_sacado'],
	    		'recpar_formulario'=>$dadosVenda['venda_formulario'],		 			    				 
	    		'usuario_login'=>$dadosVendarec['usuario_login']
	    		);
	    		$recpar->insert($dadosRecpar);
	    		
	    		if($dadosVendarec['venda_rec_pago']!=0){
	    			$mesano = substr($data,5,2).substr($data,0,4);
	    			$dadosCaixa = array(
	    			'banco_id'=>$dadosRecpar['banco_id'],
	    			'jazigo_codigo'=>$dadosRecpar['jazigo_codigo'],
	    			'empresa_id'=>$dadosRecpar['empresa_id'],
	    			'locfor_id'=>$dadosRecpar['locatario_id'],
	    			'conta_id'=>$dadosRecpar['conta_id'],
	    			'caixa_historico'=>'VENDA',
	    			'caixa_obs'=>'VENDA',
	    			'caixa_documento'=>$documento,
	    			'caixa_data_movto'=>$data,
	    			'caixa_valor'=>$dadosVendarec['venda_rec_valor'],
	    			'caixa_intipo'=>'0',
	    			'caixa_mesano'=>$mesano,
	    			'locfor_desc'=>$dadosRecpar['locatario_desc'],
	    			'usuario_login'=>$funcoes->userAtivo()
	    			);
	    			$caixa->insert($dadosCaixa);
	    			 
	    			/*
	    			$funcoes->atzSaldo($dadosCaixa['banco_id'],
	    							   $dadosCaixa['caixa_mesano'],
	    							   $dadosCaixa['caixa_valor'],
	    					           $dadosCaixa['caixa_intipo'],
	    					           $dadosCaixa['usuario_login']);
	    			*/		           
	    		}
	    		 
	    			    		
	    		$parcela++;
	    		$total += $dadosVendarec['venda_rec_valor'];
	    		$pago += $dadosVendarec['venda_rec_pago'];    			    			    			    		
	    	}
	    	
	    	/* ************************************************************
     	     * atualiza o contas a receber
     	    */
	    	$saldo = $total-$pago;
	    	$dadosCtarec = array(	    	
	    	'ctarec_valor'=>$total,
	    	'ctarec_saldo'=>$saldo,
	    	'ctarec_instatus'=>$saldo==0 ? '1' : '0'
	    	);
	    	$ctarec->update($dadosCtarec,"ctarec_id = {$pkctarec}");
	    	
	    	/* ************************************************************
     	     * atualiza o o cabeçalho de vendas
     	    */
	    	$dadosVenda = array(	    	
	    	'venda_total'=>$total
	    	);    	
	    	$venda->update($dadosVenda,"venda_id = {$pkvenda}");    	
	    	
	    	/* ************************************************************
     	     * atualiza numero do documento no casdastro de empresa
     	    */
	    	$dadosEmpresa = array(
	    	'empresa_documento'=>$documento
	    	);
	    	$empresa->update($dadosEmpresa,"empresa_id= {$dadosRecpar['empresa_id']}");    	
	    	
	    	$db->commit();   	
	    	echo "{success: true,id: '{$pkvenda}'}";
		} catch(Exception $e) {  		    
			$db->rollBack();
			echo '{success: false}';
			Zend_Debug::dump($e);			
		}  				
	}
		
	public function reciboAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true);
        $funcoes = new Model_Function_Geral();
 		try{ 			
 			/* ************************************************************
 			 * busca os dados da venda     	 
     	    */ 			
 		    $pkvenda = $this->_request->value;
		    $venda = new Model_DbTable_Venda();
 		    $dadosVenda = $venda->find($pkvenda)->current();

            /* ************************************************************
     	    * busca os produtos e serviços da venda
     	    */ 			
 		    $pdsv = new Model_DbTable_Vendapdsv();
 		    $dadosPdsv = $pdsv->buscarVendapdsv('venda_id',$pkvenda);
 		    
            /* ************************************************************
     	    * busca a forma de parcelamento
     	    */ 			
 		    $formarec = new Model_DbTable_Vendarec();
 		    $dadosFormarec = $formarec->buscarVendarec('venda_id',$pkvenda); 		    
 		 
            /* ************************************************************
       	    * busca os dados do locatario
         	*/
 			$locatario = new Model_DbTable_Locatario();
 		    $dadosLocatario = $locatario->find($dadosVenda['locatario_id'])->current();		    		 		
 		
		    $pdf = new Model_Function_Rcbvenda('P','mm','A4');
		    $pdf->AddPage();
		    $pdf->Detail($dadosLocatario,$dadosVenda,$dadosPdsv,$dadosFormarec);
		    
		    $arquivo = $funcoes->retArquivo('REB01');	    		    
   		    $pdf->Output($arquivo);
		    echo "<iframe src=$arquivo style=border:0 width=100% height=100%'></iframe>";		
		} catch(Exception $e) {  		    
			Zend_Debug::dump($e);			
		}  				
	}
}
?>

