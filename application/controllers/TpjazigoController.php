<?php

class TpjazigoController extends Zend_Controller_Action {
	
	public function init()
	{
						
	}	
	
	public function indexAction()
	{			
		$this->_redirect('tpjazigo/listar');
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
 		
		$tpjazigo = new Model_DbTable_Tpjazigo();
		$contar = 30;
		if(!empty($value)){				
		    $contar = $tpjazigo->contarTpjazigo($field,$value);		
		}		
		$dadosTpjazigo = $tpjazigo->listarTpjazigo($start,$limit,$sort,$dir,$field,$value);
		echo '{rows:',Zend_Json::encode($dadosTpjazigo),',totalCount: ',$contar,'}';		
	}
		
	public function buscarAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true); 		 	
 			
 		try{ 			
 			$id = $this->_request->tpjazigo_id; 		 		
 		    $tpjazigo = new Model_DbTable_Tpjazigo();
 		    $dadosTpjazigo = $tpjazigo->buscarTpjazigo('tpjazigo_id',$id);
 		    echo '{success: true,data:',Zend_Json::encode(current($dadosTpjazigo)),'}';	
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

		$tpjazigo = new Model_DbTable_Tpjazigo();
		$pkTpjazigo = $this->_request->tpjazigo_id;
		
		try{
			if(is_array($pkTpjazigo)){
				foreach($pkTpjazigo as $valor){
					$dadosTpjazigo = $tpjazigo->find($valor)->current();
					$dadosTpjazigo->delete();
				}
			}else{
				$dadosTpjazigo = $tpjazigo->find($pkTpjazigo)->current();
				$dadosTpjazigo->delete();
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
		
		$tpjazigo = new Model_DbTable_Tpjazigo();
		$post['usuario_login'] = $funcoes->userAtivo();		
	    try {
	    	//-- converte para maiscula
	    	foreach($post as $campo=> $valor){	    		
	    		$post[$campo] = strtoupper(trim($valor));
	    	} 
	    	$post['usuario_login'] = $funcoes->userAtivo();  	
	    	if($post['tpjazigo_id']==0){
	    		$tpjazigo->insert($post);   		
	    	}else{
	    		$tpjazigo->update($post,"tpjazigo_id = {$post['tpjazigo_id']}");	    		
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
 		    $tpjazigo = new Model_DbTable_Tpjazigo(); 		    
 		    $dadosTpjazigo = $tpjazigo->todoTpjazigo();
 		    echo Zend_Json::encode($dadosTpjazigo); 		    
		}catch(Exception $e){
			echo '{success: false}';
			// Zend_Debug::dump($e);
		}
	}
}
?>

