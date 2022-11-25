<?php

class DestinoController extends Zend_Controller_Action {
	
	public function init()
	{
						
	}	
	
	public function indexAction()
	{			
		$this->_redirect('destino/listar');
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
 		
		$destino = new Model_DbTable_Destino();
		$contar = 30;
		if(!empty($value)){				
		    $contar = $destino->contarDestino($field,$value);		
		}		
		$dadosDestino = $destino->listarDestino($start,$limit,$sort,$dir,$field,$value);
		echo '{rows:',Zend_Json::encode($dadosDestino),',totalCount: ',$contar,'}';		
	}
		
	public function buscarAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true); 		 	
 			
 		try{ 			
 			$id = $this->_request->destino_id; 		 		
 		    $destino = new Model_DbTable_Destino();
 		    $dadosDestino = $destino->buscarDestino('destino_id',$id);
 		    echo '{success: true,data:',Zend_Json::encode(current($dadosDestino)),'}';	
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

		$destino = new Model_DbTable_Destino();
		$pkdestino = $this->_request->destino_id;
		
		try{
			if(is_array($pkdestino)){
				foreach($pkdestino as $valor){
					$dadosDestino = $destino->find($valor)->current();
					$dadosDestino->delete();
				}
			}else{
				$dadosDestino = $destino->find($pkdestino)->current();
				$dadosDestino->delete();
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
		
		$destino = new Model_DbTable_Destino();
		$funcoes = new Model_Function_Geral();
		$post['usuario_login'] = $funcoes->userAtivo();		
	    try {
	    	//-- converte para maiscula
	    	foreach($post as $campo=> $valor){	    		
	    		$post[$campo] = strtoupper(trim($valor));
	    	}
	    	$post['usuario_login'] = $funcoes->userAtivo();   	
	    	if($post['destino_id']==0){
	    		$destino->insert($post);   		
	    	}else{
	    		$destino->update($post,"destino_id = {$post['destino_id']}");	    		
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
 		    $destino = new Model_DbTable_Destino(); 		    
 		    $dadosDestino = $destino->todoDestino();
 		    echo Zend_Json::encode($dadosDestino);	
		}catch(Exception $e){
			echo '{success: false}';
			// Zend_Debug::dump($e);
		}
	}
	
}
?>

