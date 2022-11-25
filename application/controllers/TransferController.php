<?php

class TransferController extends Zend_Controller_Action {
	
	public function init()
	{
						
	}	
	
	public function indexAction()
	{			
		$this->_redirect('transfer/listar');
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
 		
		$transfer = new Model_DbTable_Transfer();
		$contar = 30;
		if(!empty($value)){				
		    $contar = $transfer->contarTransfer($field,$value);		
		}		
		$dadosTransfer = $transfer->listarTransfer($start,$limit,$sort,$dir,$field,$value);
		echo '{rows:',Zend_Json::encode($dadosTransfer),',totalCount: ',$contar,'}';		
	}
		
	public function buscarAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true); 		 	
 			
 		try{ 			
 			$id = $this->_request->transfer_id; 		 		
 		    $transfer = new Model_DbTable_Transfer();
 		    $dadosTransfer = $transfer->buscarTransfer('transfer_id',$id);
 		    echo '{success: true,data:',Zend_Json::encode(current($dadosTransfer)),'}';	
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

		$transfer = new Model_DbTable_Transfer();
		$pktransfer = $this->_request->transfer_id;
		
		try{
			if(is_array($pktransfer)){
				foreach($pktransfer as $valor){
					$dadosTransfer = $transfer->find($valor)->current();
					$dadosTransfer->delete();
				}
			}else{
				$dadosTransfer = $transfer->find($pktransfer)->current();
				$dadosTransfer->delete();
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
		
		$transfer = new Model_DbTable_Transfer();
		$funcoes = new Model_Function_Geral();		
		$ctarec = new Model_DbTable_Ctarec();
		$recpar = new Model_DbTable_Recpar();
		
	    try {
	    	// incial transação
	    	$db = $this->getInvokeArg('bootstrap')->getDb();    	
	    	$db->beginTransaction();
	    	
	    	//-- converte para maiscula
	    	foreach($post as $campo=> $valor){	    		
	    		$post[$campo] = strtoupper(trim($valor));
	    	}
	    	
	    	// atualiza/inclui a transferencia
	    	$post['transfer_data'] = $funcoes->dataeuaGeral($post['transfer_data']);
	    	$post['usuario_login'] = $funcoes->userAtivo();   	
	    	if($post['transfer_id']==0){
	    		$transfer->insert($post);   		
	    	}else{
	    		$transfer->update($post,"transfer_id = {$post['transfer_id']}");	    		
	    	}  
	    	
	    	// atualiza o contas a receber e titulos a receber
	    	$dadosCtarec = array(	    	
	    	'locatario_id'=>$post['locatario_id_novo'],
	    	'locatario_desc'=>$post['locatario_desc_novo'],
	    	);
	    	$condicao = array(
	        'jazigo_codigo = ?'=>$post['jazigo_codigo'],
	        'ctarec_instatus = ?'=>'0',
	        );
	        $ctarec->update($dadosCtarec,$condicao);    	

	    	$dadosRecpar = array(	    	
	    	'locatario_id'=>$post['locatario_id_novo'],
	    	'locatario_desc'=>$post['locatario_desc_novo'],
	    	);
	    	$condicao = array(
	        'jazigo_codigo = ?'=>$post['jazigo_codigo'],
	        'recpar_instatus = ?'=>'0',
	        );
	        $recpar->update($dadosRecpar,$condicao);    	
	        
	    	
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

