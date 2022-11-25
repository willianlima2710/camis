<?php

class OperacaoController extends Zend_Controller_Action {
	
	public function init()
	{
						
	}	
	
	public function indexAction()
	{			
		$this->_redirect('operacao/listar');
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
 		
		$operacao = new Model_DbTable_Operacao();
		$contar = 30;
		if(!empty($value)){				
		    $contar = $operacao->contarOperacao($field,$value);		
		}						
		$dadosOperacao = $operacao->listarOperacao($start,$limit,$sort,$dir,$field,$value);
		echo '{rows:',Zend_Json::encode($dadosOperacao),',totalCount: ',$contar,'}';		
	}
		
	public function buscarAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true); 		 	
 			
 		try{ 			
 			$id = $this->_request->operacao_id; 		 		
 		    $operacao = new Model_DbTable_Operacao();
 		    $dadosOperacao = $operacao->buscarOperacao('operacao_id',$id);
 		    echo '{success: true,data:',Zend_Json::encode(current($dadosOperacao)),'}';	
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

		$operacao = new Model_DbTable_Operacao();
		$pkoperacao = $this->_request->operacao_id;
		
		try{
			if(is_array($pkoperacao)){
				foreach($pkoperacao as $valor){
					$dadosOperacao = $operacao->find($valor)->current();
					$dadosOperacao->delete();
				}
			}else{
				$dadosOperacao = $operacao->find($pkoperacao)->current();
				$dadosOperacao->delete();
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
		
		$operacao = new Model_DbTable_Operacao();
		$funcoes = new Model_Function_Geral();		
	    try {
	    	//-- converte para maiscula
	    	foreach($post as $campo=> $valor){	    		
	    		$post[$campo] = strtoupper(trim($valor));
	    	}   	
	    	$post["operacao_infaturar"] = !isset($post["operacao_infaturar"]) ? 0 : $post["operacao_infaturar"];
	    	$post['usuario_login'] = $funcoes->userAtivo();
	    	if($post['operacao_id']==0){
	    		$operacao->insert($post);
	    		$pkoperacao = $operacao->getAdapter()->lastInsertId();
	    	}else{
	    		$operacao->update($post,"operacao_id = {$post['operacao_id']}");
	    		$pkoperacao = $post['operacao_id'];
	    	}   	    
		    echo "{success: true,id: '{$pkoperacao}'}";
		} catch(Exception $e) {
			echo '{success: false}';
			//Zend_Debug::dump($e);
		}  				
	}

	public function todoAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true); 		 	
 			
 		try{	 		
 		    $operacao = new Model_DbTable_Operacao(); 		    
 		    $dadosOperacao = $operacao->todoOperacao();
 		    echo Zend_Json::encode($dadosOperacao); 		    
		}catch(Exception $e){
			echo '{success: false}';
			// Zend_Debug::dump($e);
		}
	}	
	
}
?>

