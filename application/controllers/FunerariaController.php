<?php

class FunerariaController extends Zend_Controller_Action {
	
	public function init()
	{
						
	}	
	
	public function indexAction()
	{			
		$this->_redirect('funeraria/listar');
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
 		
		$funeraria = new Model_DbTable_Funeraria();
		$contar = 30;
		if(!empty($value)){				
		    $contar = $funeraria->contarFuneraria($field,$value);		
		}		
		$dadosFuneraria = $funeraria->listarFuneraria($start,$limit,$sort,$dir,$field,$value);
		echo '{rows:',Zend_Json::encode($dadosFuneraria),',totalCount: ',$contar,'}';		
	}
		
	public function buscarAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true); 		 	
 			
 		try{ 			
 			$id = $this->_request->funeraria_id; 		 		
 		    $funeraria = new Model_DbTable_Funeraria();
 		    $dadosFuneraria = $funeraria->buscarFuneraria('funeraria_id',$id);
 		    echo '{success: true,data:',Zend_Json::encode(current($dadosFuneraria)),'}';	
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

		$funeraria = new Model_DbTable_Funeraria();
		$pkfuneraria = $this->_request->funeraria_id;		
		try{
			if(is_array($pkfuneraria)){
				foreach($pkfuneraria as $valor){
					$dadosFuneraria = $funeraria->find($valor)->current();
					$dadosFuneraria->delete();
				}
			}else{
				$dadosFuneraria = $funeraria->find($pkfuneraria)->current();
				$dadosFuneraria->delete();
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
		
		$funeraria = new Model_DbTable_Funeraria();
		$funcoes = new Model_Function_Geral();		
	    try {
	    	//-- converte para maiscula
	    	foreach($post as $campo=> $valor){	    		
	    		$post[$campo] = strtoupper(trim($valor));
	    	}   	
	    	$post['usuario_login'] = $funcoes->userAtivo();
	    	if($post['funeraria_id']==0){
	    		$funeraria->insert($post);   		
	    	}else{
	    		$funeraria->update($post,"funeraria_id = {$post['funeraria_id']}");	    		
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
 		    $funeraria = new Model_DbTable_Funeraria(); 		    
 		    $dadosFuneraria = $funeraria->todoFuneraria();
 		    echo Zend_Json::encode($dadosFuneraria); 		    
		}catch(Exception $e){
			echo '{success: false}';
			// Zend_Debug::dump($e);
		}
	}
}
?>

