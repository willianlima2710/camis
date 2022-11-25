<?php

class EstadoController extends Zend_Controller_Action {
	
	public function init()
	{
						
	}	
	
	public function indexAction()
	{			
		$this->_redirect('estado/listar');
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
 		
		$estado = new Model_DbTable_Estado();
		$contar = 30;
		if(!empty($value)){				
		    $contar = $estado->contarEstado($field,$value);		
		}		
		$dadosEstado = $estado->listarEstado($start,$limit,$sort,$dir,$field,$value);		
		echo '{rows:',Zend_Json::encode($dadosEstado),',totalCount: ',$contar,'}';
	}
		
	public function buscarAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true); 		 	
 			
 		try{ 			
 			$id = $this->_request->estado_id; 		 		
 		    $estado = new Model_DbTable_Estado();
 		    $dadosEstado = $estado->buscarEstado('estado_id',$id);
 		    echo '{success: true,data:',Zend_Json::encode(current($dadosEstado)),'}';	
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

		$estado = new Model_DbTable_Estado();
		$pkEstado = $this->_request->estado_id;
		
		try{
			if(is_array($pkEstado)){
				foreach($pkEstado as $valor){
					$dadosEstado = $estado->find($valor)->current();
					$dadosEstado->delete();
				}
			}else{
				$dadosEstado = $estado->find($pkEstado)->current();
				$dadosEstado->delete();
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
		
		$estado = new Model_DbTable_Estado();
		$funcoes = new Model_Function_Geral();		
	    try {
	    	//-- converte para maiscula
	    	foreach($post as $campo=> $valor){	    		
	    		$post[$campo] = strtoupper(trim($valor));
	    	} 
	    	$post['usuario_login'] = $funcoes->userAtivo();  	
	    	if($post['estado_id']==0){
	    		$estado->insert($post);   		
	    	}else{
	    		$estado->update($post,"estado_id = {$post['estado_id']}");	    		
	    	}   	    
		    echo '{success: true}';
		} catch(Exception $e) {
			echo '{success: false}';
			echo Zend_Debug::dump($e);
		}  				
	}

	public function todoAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true); 		 	
 			
 		try{	 		
 		    $estado = new Model_DbTable_Estado(); 		    
 		    $dadosEstado = $estado->todoEstado();
 		    echo Zend_Json::encode($dadosEstado);	
		}catch(Exception $e){
			echo '{success: false}';
			// Zend_Debug::dump($e);
		}
	}
}
?>

