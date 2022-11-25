<?php

class QuadraController extends Zend_Controller_Action {
	
	public function init()
	{
						
	}	
	
	public function indexAction()
	{			
		$this->_redirect('quadra/listar');
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
 		
		$quadra = new Model_DbTable_Quadra();
		$contar = 30;
		if(!empty($value)){				
		    $contar = $quadra->contarQuadra($field,$value);		
		}		
		$dadosQuadra = $quadra->listarQuadra($start,$limit,$sort,$dir,$field,$value);
		echo '{rows:',Zend_Json::encode($dadosQuadra),',totalCount: ',$contar,'}';		
	}
		
	public function buscarAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true); 		 	
 			
 		try{ 			
 			$id = $this->_request->quadra_id; 		 		
 		    $quadra = new Model_DbTable_Quadra();
 		    $dadosQuadra = $quadra->buscarQuadra('quadra_id',$id);
 		    echo '{success: true,data:',Zend_Json::encode(current($dadosQuadra)),'}';	
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

		$quadra = new Model_DbTable_Quadra();
		$pkquadra = $this->_request->quadra_id;
		
		try{
			if(is_array($pkquadra)){
				foreach($pkquadra as $valor){
					$dadosQuadra = $quadra->find($valor)->current();
					$dadosQuadra->delete();
				}
			}else{
				$dadosQuadra = $quadra->find($pkquadra)->current();
				$dadosQuadra->delete();
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
		
		$quadra = new Model_DbTable_Quadra();
		$funcoes = new Model_Function_Geral();		
	    try {
	    	//-- converte para maiscula
	    	foreach($post as $campo=> $valor){	    		
	    		$post[$campo] = strtoupper(trim($valor));
	    	} 
	    	$post['usuario_login'] = $funcoes->userAtivo();  	
	    	if($post['quadra_id']==0){
	    		$quadra->insert($post);   		
	    	}else{
	    		$quadra->update($post,"quadra_id = {$post['quadra_id']}");	    		
	    	}   	    
		    echo '{success: true}';
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
 		    $quadra = new Model_DbTable_Quadra(); 		    
 		    $dadosQuadra = $quadra->todoQuadra();
 		    echo Zend_Json::encode($dadosQuadra); 		    
		}catch(Exception $e){
			echo '{success: false}';
			// Zend_Debug::dump($e);
		}
	}
}
?>

