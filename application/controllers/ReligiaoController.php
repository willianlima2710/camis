<?php

class ReligiaoController extends Zend_Controller_Action {
	
	public function init()
	{
						
	}	
	
	public function indexAction()
	{			
		$this->_redirect('religiao/listar');
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
 		
		$religiao = new Model_DbTable_Religiao();
		$contar = 30;
		if(!empty($value)){				
		    $contar = $religiao->contarReligiao($field,$value);		
		}		
		$dadosReligiao = $religiao->listarReligiao($start,$limit,$sort,$dir,$field,$value);
		echo '{rows:',Zend_Json::encode($dadosReligiao),',totalCount: ',$contar,'}';		
	}
		
	public function buscarAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true); 		 	
 			
 		try{ 			
 			$id = $this->_request->religiao_id; 		 		
 		    $religiao = new Model_DbTable_Religiao();
 		    $dadosReligiao = $religiao->buscarReligiao('religiao_id',$id);
 		    echo '{success: true,data:',Zend_Json::encode(current($dadosReligiao)),'}';	
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

		$religiao = new Model_DbTable_Religiao();
		$pkreligiao = $this->_request->religiao_id;
		
		try{
			if(is_array($pkreligiao)){
				foreach($pkreligiao as $valor){
					$dadosReligiao = $religiao->find($valor)->current();
					$dadosReligiao->delete();
				}
			}else{
				$dadosReligiao = $religiao->find($pkreligiao)->current();
				$dadosReligiao->delete();
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
		
		$religiao = new Model_DbTable_Religiao();
		$post['usuario_login'] = $funcoes->userAtivo();		
	    try {
	    	//-- converte para maiscula
	    	foreach($post as $campo=> $valor){	    		
	    		$post[$campo] = strtoupper(trim($valor));
	    	}
	    	$post['usuario_login'] = $funcoes->userAtivo();   	
	    	if($post['religiao_id']==0){
	    		$religiao->insert($post);   		
	    	}else{
	    		$religiao->update($post,"religiao_id = {$post['religiao_id']}");	    		
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
 		    $religiao = new Model_DbTable_Religiao(); 		    
 		    $dadosReligiao = $religiao->todoReligiao();
 		    echo Zend_Json::encode($dadosReligiao);	
		}catch(Exception $e){
			echo '{success: false}';
			// Zend_Debug::dump($e);
		}
	}
	
}
?>

