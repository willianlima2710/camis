<?php

class EstcivilController extends Zend_Controller_Action {
	
	public function init()
	{
						
	}	
	
	public function indexAction()
	{			
		$this->_redirect('estcivil/listar');
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
 		
		$estcivil = new Model_DbTable_Estcivil();
		$contar = 30;
		if(!empty($value)){				
		    $contar = $estcivil->contarEstcivil($field,$value);		
		}		
		$dadosEstcivil = $estcivil->listarEstcivil($start,$limit,$sort,$dir,$field,$value);
		echo '{rows:',Zend_Json::encode($dadosEstcivil),',totalCount: ',$contar,'}';		
	}
		
	public function buscarAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true); 		 	
 			
 		try{ 			
 			$id = $this->_request->estcivil_id; 		 		
 		    $estcivil = new Model_DbTable_Estcivil();
 		    $dadosEstcivil = $estcivil->buscarEstcivil('estcivil_id',$id);
 		    echo '{success: true,data:',Zend_Json::encode(current($dadosEstcivil)),'}';	
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

		$estcivil = new Model_DbTable_Estcivil();
		$pkestcivil = $this->_request->estcivil_id;
		
		try{
			if(is_array($pkestcivil)){
				foreach($pkestcivil as $valor){
					$dadosEstcivil = $estcivil->find($valor)->current();
					$dadosEstcivil->delete();
				}
			}else{
				$dadosEstcivil = $estcivil->find($pkestcivil)->current();
				$dadosEstcivil->delete();
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
		
		$estcivil = new Model_DbTable_Estcivil();
		$funcoes = new Model_Function_Geral();		
	    try {
	    	//-- converte para maiscula
	    	foreach($post as $campo=> $valor){	    		
	    		$post[$campo] = strtoupper(trim($valor));
	    	}   	
	    	$post['usuario_login'] = $funcoes->userAtivo();
	    	if($post['estcivil_id']==0){
	    		$estcivil->insert($post);
	    	}else{
	    		$estcivil->update($post,"estcivil_id = {$post['estcivil_id']}");
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
 		    $estcivil = new Model_DbTable_Estcivil(); 		    
 		    $dadosEstcivil = $estcivil->todoEstcivil();
 		    echo Zend_Json::encode($dadosEstcivil);	
		}catch(Exception $e){
			echo '{success: false}';
			// Zend_Debug::dump($e);
		}
	}		
}
?>

