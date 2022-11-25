<?php

class CartorioController extends Zend_Controller_Action {
	
	public function init()
	{
						
	}	
	
	public function indexAction()
	{			
		$this->_redirect('cartorio/listar');
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
 		
		$cartorio = new Model_DbTable_Cartorio();
		$contar = 30;
		if(!empty($value)){				
		    $contar = $cartorio->contarCartorio($field,$value);		
		}		
		$dadosCartorio = $cartorio->listarCartorio($start,$limit,$sort,$dir,$field,$value);
		echo '{rows:',Zend_Json::encode($dadosCartorio),',totalCount: ',$contar,'}';		
	}
		
	public function buscarAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true); 		 	
 			
 		try{ 			
 			$id = $this->_request->cartorio_id; 		 		
 		    $cartorio = new Model_DbTable_Cartorio();
 		    $dadosCartorio = $cartorio->buscarCartorio('cartorio_id',$id);
 		    echo '{success: true,data:',Zend_Json::encode(current($dadosCartorio)),'}';	
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

		$cartorio = new Model_DbTable_Cartorio();
		$pkcartorio = $this->_request->cartorio_id;
		
		try{
			if(is_array($pkcartorio)){
				foreach($pkcartorio as $valor){
					$dadosCartorio = $cartorio->find($valor)->current();
					$dadosCartorio->delete();
				}
			}else{
				$dadosCartorio = $cartorio->find($pkcartorio)->current();
				$dadosCartorio->delete();
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
		
		$cartorio = new Model_DbTable_Cartorio();
		$funcoes = new Model_Function_Geral();		
	    try {
	    	//-- converte para maiscula
	    	foreach($post as $campo=> $valor){	    		
	    		$post[$campo] = strtoupper(trim($valor));
	    	}
	    	$post['usuario_login'] = $funcoes->userAtivo();   	
	    	if($post['cartorio_id']==0){
	    		$cartorio->insert($post);   		
	    	}else{
	    		$cartorio->update($post,"cartorio_id = {$post['cartorio_id']}");	    		
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
 		    $cartorio = new Model_DbTable_Cartorio(); 		    
 		    $dadosCartorio = $cartorio->todoCartorio();
 		    echo Zend_Json::encode($dadosCartorio); 		    
		}catch(Exception $e){
			echo '{success: false}';
			// Zend_Debug::dump($e);
		}
	}
}
?>

