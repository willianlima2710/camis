<?php

class ConfestController extends Zend_Controller_Action {
	
	public function init()
	{
						
	}	
	
	public function indexAction()
	{			
		$this->_redirect('confest/listar');
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
 		
		$confest = new Model_DbTable_Confest();
		$contar = 30;
		if(!empty($value)){				
		    $contar = $confest->contarConfest($field,$value);		
		}		
		$dadosConfest = $confest->listarConfest($start,$limit,$sort,$dir,$field,$value);
		echo '{rows:',Zend_Json::encode($dadosConfest),',totalCount: ',$contar,'}';		
	}
		
	public function buscarAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true); 		 	
 			
 		try{ 			
 			$id = (int)$this->_request->confest_id; 		 		
 		    $confest = new Model_DbTable_Confest();
 		    $funcoes = new Model_Function_Geral(); 		    
 		    
 		    $dadosConfest = $confest->buscarConfest('confest_id',$id);
 		    $dadosConfest = current($dadosConfest);
 		     		    
 		    $dadosConfest['confest_data'] = $funcoes->databrGeral($dadosConfest['confest_data']);
 		     		    
 		    echo '{success: true,data:',Zend_Json::encode($dadosConfest),'}';	
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

		$confest = new Model_DbTable_Confest();
		$pkConfest = $this->_request->confest_id;
		
		try{
			if(is_array($pkConfest)){
				foreach($pkConfest as $valor){
					$dadosConfest = $confest->find((int)$valor)->current();
					$dadosConfest->delete();
				}
			}else{
				$dadosConfest = $confest->find((int)$pkConfest)->current();
				$dadosConfest->delete();
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
		
		$confest = new Model_DbTable_Confest();
		$confestprod = new Model_DbTable_Confestprod();
		$empresa = new Model_DbTable_Empresa();
		$prodserv = new Model_DbTable_Prodserv();			
		
		$funcoes = new Model_Function_Geral();		
	    try {
	    	//-- converte para maiscula
	    	foreach($post as $campo=> $valor){	    		
	    		$post[$campo] = strtoupper(trim($valor));
	    	}
	    	$post['usuario_login'] = $funcoes->userAtivo();    	
	    	
	    	$dadosEmpresa = $empresa->find((int)$post['empresa_id'])->current();    	
	    	
	    	// incial confsação
	    	$db = $this->getInvokeArg('bootstrap')->getDb();    	
	    	$db->beginTransaction();    	
	    	
	    	/* ************************************************************
     	     * inclui o cabeçalho da confest mov_confest
     	    */  	
	    	$dadosConfest = array(
	    	'confest_data'=>$funcoes->dataeuaGeral($post['confest_data']),
	    	'confest_hora'=>$post['confest_hora'],
	    	'empresa_id'=>$dadosEmpresa['empresa_id'],
	    	'empresa_desc'=>$dadosEmpresa['empresa_desc'],
	    	'confest_desc'=>$post['confest_desc'],
	    	'usuario_login'=>$post['usuario_login']  	
	    	);	    	
    		if($post['confest_id']==0){
    			$confest->insert($dadosConfest);
    		    $pkconfest = $confest->getAdapter()->lastInsertId();			
    		}else{
    			$confest->update($dadosConfest,"confest_id = {$post['confest_id']}");
    			$pkconfest = $post['confest_id'];
    		}
    		
	    	/* ************************************************************
     	     * inclui os produtos mov_confest_prod
     	    */ 
    		
    		//exclui os produtos da confest
	    	$condicao = array(
	        'confest_id = ?'=>$pkconfest,
	        );
	        $confestprod->delete($condicao);
	           		
    		$jsonconfestprod = $this->_request->confestprod;
    		for ($row = 0; $row < count($jsonconfestprod,COUNT_RECURSIVE); $row++)
    		{    			
    			$json = json_decode($jsonconfestprod[$row]);   			
    			
    		    $dadosConfestprod = array(
    		    'confest_id'=>$pkconfest,
    		    'prodserv_id'=>$json->prodserv_id,
    		    'prodserv_desc'=>$json->prodserv_desc,
    		    'confestprod_quantidade'=>$json->confestprod_quantidade,
    		    'usuario_login'=>$post['usuario_login']
    		    );    		    
    		    $confestprod->insert($dadosConfestprod);

   			    // atualiza o saldo no produto
			    $dadosProdserv = array(
			    'prodserv_saldo'=>$json->confestprod_quantidade
			    );
			    $pkproduto = $json->prodserv_id;
			    $prodserv->update($dadosProdserv,"prodserv_id = {$pkproduto}");    			
    		}   
    		    		  	
    		$db->commit();    		    		
		    echo "{success: true,id: '{$pkconfest}'}";
		} catch(Exception $e) {
			$db->rollBack();
			echo '{success: false}';
			Zend_Debug::dump($e);
		}  				
	} 
}
?>

