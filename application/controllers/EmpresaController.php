<?php

class EmpresaController extends Zend_Controller_Action {
	
	public function init()
	{
						
	}	
	
	public function indexAction()
	{			
		$this->_redirect('empresa/listar');
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
 		
		$empresa = new Model_DbTable_Empresa();
		$contar = 30;
		if(!empty($value)){				
		    $contar = $empresa->contarEmpresa($field,$value);		
		}		
		$dadosEmpresa = $empresa->listarEmpresa($start,$limit,$sort,$dir,$field,$value);
		echo '{rows:',Zend_Json::encode($dadosEmpresa),',totalCount: ',$contar,'}';		
	}
		
	public function buscarAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true); 		 	
 			
 		try{ 			
 			$id = $this->_request->empresa_id; 		 		
 		    $empresa = new Model_DbTable_Empresa();
 		    $dadosEmpresa = $empresa->buscarEmpresa('empresa_id',$id);
 		    echo '{success: true,data:',Zend_Json::encode(current($dadosEmpresa)),'}';	
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

		$empresa = new Model_DbTable_Empresa();
		$pkempresa = $this->_request->empresa_id;
		
		try{
			if(is_array($pkempresa)){
				foreach($pkempresa as $valor){
					$dadosEmpresa = $empresa->find($valor)->current();
					$dadosEmpresa->delete();
				}
			}else{
				$dadosEmpresa = $empresa->find($pkempresa)->current();
				$dadosEmpresa->delete();
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
		
		$empresa = new Model_DbTable_Empresa();
		$funcoes = new Model_Function_Geral();		
	    try {
	    	//-- converte para maiscula
	    	foreach($post as $campo=> $valor){	    		
	    		$post[$campo] = strtoupper(trim($valor));
	    	}
	    	$post['usuario_login'] = $funcoes->userAtivo();   	
	    	if($post['empresa_id']==0){
	    		$empresa->insert($post);   		
	    	}else{
	    		$empresa->update($post,"empresa_id = {$post['empresa_id']}");	    		
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
 		    $empresa = new Model_DbTable_Empresa(); 		    
 		    $dadosEmpresa = $empresa->todoEmpresa();
 		    echo Zend_Json::encode($dadosEmpresa); 		    
		}catch(Exception $e){
			echo '{success: false}';
			// Zend_Debug::dump($e);
		}
	}
}
?>

