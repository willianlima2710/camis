<?php

class RecparController extends Zend_Controller_Action {
	
	public function init()
	{
						
	}	
	
	public function indexAction()
	{			
		$this->_redirect('recpar/listar');
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

		$recpar = new Model_DbTable_Recpar();
		$contar = 30;
		if(!empty($value)){				
		    $contar = $recpar->contarRecpar($field,$value);		
		}	
		$dadosRecpar = $recpar->listarRecpar($start,$limit,$sort,$dir,$field,$value);
		echo '{rows:',Zend_Json::encode($dadosRecpar),',totalCount: ',$contar,'}';		
	}
		
	public function buscarAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true); 		 	
 			
 		try{ 			
 			$id = $this->_request->recpar_id; 		 		
 		    $recpar = new Model_DbTable_Recpar();
 		    $funcoes = new Model_Function_Geral();
 		     		    
 		    $dadosRecpar = $recpar->buscarRecpar('recpar_id',$id);
 		    $dadosRecpar = current($dadosRecpar);
 		    $dadosRecpar['recpar_data_vencto'] = $funcoes->databrGeral($dadosRecpar['recpar_data_vencto']);
 		    $dadosRecpar['recpar_pago'] = $dadosRecpar['recpar_valor'];
 		    $dadosRecpar['recpar_data_pagto'] = date('d/m/Y');
 		     		    
 		    echo '{success: true,data:',Zend_Json::encode($dadosRecpar),'}';	
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
 		
		try{
			$pkrecpar = $this->_request->recpar_id; 		 		
 		    $recpar = new Model_DbTable_Recpar();
 		    
			// inciar transação
			$dadosRecpar = $recpar->find($pkrecpar)->current();
			$dadosRecpar->delete();
			
			echo '{success: true}';	
		}catch(Exception $e) {			
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
		
		$recpar = new Model_DbTable_Recpar();
		$funcoes = new Model_Function_Geral();		
	    try {
	    	//-- converte para maiscula
	    	foreach($post as $campo=> $valor){	    		
	    		$post[$campo] = strtoupper(trim($valor));
	    	}
	    	$post['recpar_data_vencto'] = $funcoes->dataeuaGeral($post['recpar_data_vencto']);
	    	$post['recpar_data_pagto'] = $funcoes->dataeuaGeral($post['recpar_data_pagto']);
	    	$post['usuario_login'] = $funcoes->userAtivo();
	    	if($post['recpar_id']==0){
	    		$recpar->insert($post);   		
	    	}else{
	    		$recpar->update($post,"recpar_id = {$post['recpar_id']}");	    		
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
 		    $recpar = new Model_DbTable_Recpar(); 		    
 		    $dadosRecpar = $recpar->todoRecpar();
 		    echo Zend_Json::encode($dadosRecpar); 		    
		}catch(Exception $e){
			echo '{success: false}';
			// Zend_Debug::dump($e);
		}
	}	
	
	public function baixarAction()
	{		
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true);
 		 
		$post = $this->_request->getPost();
		
		$recpar = new Model_DbTable_Recpar();
		$ctarec = new Model_DbTable_Ctarec();
		$caixa = new Model_DbTable_Caixa();		
		$funcoes = new Model_Function_Geral();		
		$empresa = new Model_DbTable_Empresa();
		
		unset($post['action']);		
	    try {	    	
	    	// incial transação
	    	$db = $this->getInvokeArg('bootstrap')->getDb();    	
	    	$db->beginTransaction();
	    	$data = $post['recpar_data_pagto'];	 

	    	// busca os dados da empresa e os parametros
	    	if(empty($post['ctarec_documento'])){
	    		$dadosEmpresa = current($empresa->buscarEmpresa());
	    	    $post['ctarec_documento'] = $dadosEmpresa['empresa_documento'] + 1;
	    	}else{
	    		$post['ctarec_documento'] = $post['ctarec_documento'];
	    	}

	    	// verifica se tem sacado
	    	if(empty($post['recpar_sacado'])) {
	    		$post['recpar_sacado'] = substr($post['locatario_desc'],0,strrpos($post['locatario_desc'],"-")-1);  
	    	}

            /* ************************************************************
	    	 * monta o arquivo de baixa de titulo
	    	*/
	    	$dadosRecpar = array(
	    	'operacao_id'=>$post['operacao_id'],		
	    	'recpar_pago'=>$post['recpar_pago'],
	    	'recpar_desconto'=>$post['recpar_desconto'],
	    	'recpar_juros'=>$post['recpar_juros'],				
	    	'locpagto_id'=>$post['locpagto_id'],
	    	'ctarec_documento'=>$post['ctarec_documento'],
	    	'recpar_instatus'=>'1',
	    	'recpar_data_pagto'=>$funcoes->dataeuaGeral($post['recpar_data_pagto']),
	    	'formarec_id'=>$post['formarec_id'],		
	    	'banco_id'=>$post['banco_id'],			    			
	    	'conta_id'=>$post['conta_id'],
	    	'recpar_historico'=>strtoupper($post['recpar_historico']),
	    	'recpar_sacado'=>strtoupper($post['recpar_sacado']),		
	    	'recpar_obs'=>strtoupper($post['recpar_obs']),		
	    	'usuario_login'=>$funcoes->userAtivo()	    	
	    	);	    	
	    	$recpar->update($dadosRecpar,"recpar_id = {$post['recpar_id']}");
	    	$dadosRecpar = $recpar->find($post['recpar_id'])->current();	    	
	    	
	    	/* ************************************************************
     	     * atualiza numero do documento no casdastro de empresa
     	    */
	    	$dadosEmpresa = array(
	    	'empresa_documento'=>$post['ctarec_documento']
	    	);
	    	$empresa->update($dadosEmpresa,"empresa_id= {$dadosRecpar['empresa_id']}");

	    	/************************************************
	    	 * lança no movimento de caixa
	    	 */
	    	$mesano = substr($data,5,2).substr($data,0,4);
	    	$dadosCaixa = array(
	    	'jazigo_codigo'=>$dadosRecpar['jazigo_codigo'],
	    	'empresa_id'=>$dadosRecpar['empresa_id'],
	    	'locfor_id'=>$dadosRecpar['locatario_id'],
	    	'banco_id'=>$dadosRecpar['banco_id'],
	    	'conta_id'=>$dadosRecpar['conta_id'],
	    	'caixa_historico'=>$dadosRecpar['recpar_historico'],
	    	'caixa_obs'=>$dadosRecpar['recpar_obs'],
	    	'caixa_documento'=>$dadosRecpar['ctarec_documento'],
	    	'caixa_data_movto'=>$funcoes->dataeuaGeral($dadosRecpar['recpar_data_pagto']),
	    	'caixa_valor'=>$dadosRecpar['recpar_pago'],
	    	'caixa_intipo'=>'0',
	    	'caixa_mesano'=>$mesano,
	    	'locfor_desc'=>$dadosRecpar['locatario_desc'],
   			'usuario_login'=>$funcoes->userAtivo()
	    	);    	
	    	$caixa->insert($dadosCaixa);	 
	    	
		    $db->commit();
	    	echo '{success: true}';
		} catch(Exception $e) {
			$db->rollBack();
			echo '{success: false}';
			Zend_Debug::dump($e);
		}
	}
		
	public function estornoAction()
	{		
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true);		
 		
 		$id = $this->_request->recpar_id;
 		$recpar = new Model_DbTable_Recpar();
		$ctarec = new Model_DbTable_Ctarec();
		$caixa = new Model_DbTable_Caixa();		
		$funcoes = new Model_Function_Geral();
				
 		try{
	    	// inciar transação
	    	$db = $this->getInvokeArg('bootstrap')->getDb();    	
	    	$db->beginTransaction();
	    	
	    	$data = date('Y-m-d');	    	
	    	            
            /* ************************************************************
	    	 * busca os dados do titulo para a baixa
	    	 * guarda na matriz para usar no restante
	    	*/	    	
		    $dadosRecpar = $recpar->find($id)->current();    	
	    	
            /* ************************************************************
	    	 * monta o arquivo do estorno do titulo
	    	*/	    	
	    	$dadosCtarec = array(
	    	'recpar_pago'=>0,
	    	'recpar_data_pagto'=>'0000-00-00',
	    	'locpagto_id'=>'0',
	    	'recpar_instatus'=>'0',
	    	'usuario_login'=>$funcoes->userAtivo()	    	
	    	);	    		    	
	    	$recpar->update($dadosCtarec,"recpar_id = {$id}");

	    	/* ************************************************************
	    	 * exclui do caixa
	    	*/
	    	$condicao = array(
   			'locfor_id = ?'=>$dadosRecpar['locatario_id'],
   			'jazigo_codigo = ?'=>$dadosRecpar['jazigo_codigo'],
   			'empresa_id = ?'=>$dadosRecpar['empresa_id'],
   			'caixa_documento = ?'=>$dadosRecpar['ctarec_documento'],
	    	'caixa_data_movto = ?'=>$dadosRecpar['recpar_data_pagto'],
	    	'caixa_intipo = ?'=>'0'				   			
	    	);
	    	$caixa->delete($condicao);	    	
	    	
 			$db->commit();
	    	echo '{success: true}';
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
     	    * busca os titulos
     	    */ 		
 		    $pkrecpar = $this->_request->value;	
 		    $recpar = new Model_DbTable_Recpar();
 		    $dadosRecpar = current($recpar->buscarRecpar('recpar_id',$pkrecpar));
 		 
            /* ************************************************************
       	    * busca os dados do locatario
         	*/
 			$locatario = new Model_DbTable_Locatario();
 		    $dadosLocatario = $locatario->find($dadosRecpar['locatario_id'])->current();    
 		
		    $pdf = new Model_Function_Rcbbaixa('P','mm','A4');
		    $pdf->AddPage();
		    $pdf->Detail($dadosLocatario,$dadosRecpar);
		    
		    $arquivo = $funcoes->retArquivo('REB01');	    		    
   		    $pdf->Output($arquivo);
		    echo "<iframe src=$arquivo style=border:0 width=100% height=100%'></iframe>";		
		} catch(Exception $e) {  		    
			Zend_Debug::dump($e);			
		}  				
	}	
	
    public function taxaAction()
	{		
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true);
 		 
		$post = $this->_request->getPost();						
		unset($post['action']);
		
		$recpar = new Model_DbTable_Recpar();
		$funcoes = new Model_Function_Geral();		
	    try {
	    	//-- converte para maiscula
	    	foreach($post as $campo=> $valor){	    		
	    		$post[$campo] = strtoupper(trim($valor));
	    	}
 		    $post["recpar_data_vencto"] = $funcoes->dataeuaGeral($post["recpar_data_vencto"]);
            $post["recpar_data_emissao"] = date('Y-m-d');
            $post["recpar_parcela"] = 1;
            $post["recpar_instatus"] = '0';              
            $post["recpar_pago"] = 0;
                      
	    	$post['usuario_login'] = $funcoes->userAtivo();
	    	
	    	if($post['recpar_id']==0){
	    		$recpar->insert($post);   		
	    	}else{
	    		$recpar->update($post,"recpar_id = {$post['recpar_id']}");	    		
	    	}   	    
		    echo '{success: true}';
		} catch(Exception $e) {
			echo '{success: false}';
			Zend_Debug::dump($e);
		}  				
	}
}
?>

