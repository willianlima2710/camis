<?php

class TpterrenoController extends Zend_Controller_Action {
	
	public function init()
	{
						
	}	
	
	public function indexAction()
	{			
		$this->_redirect('tpterreno/listar');
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
 		
		$tpterreno = new Model_DbTable_Tpterreno();
		$contar = 30;
		if(!empty($value)){				
		    $contar = $tpterreno->contarTpterreno($field,$value);		
		}		
		$dadosTpterreno = $tpterreno->listarTpterreno($start,$limit,$sort,$dir,$field,$value);
		echo '{rows:',Zend_Json::encode($dadosTpterreno),',totalCount: ',$contar,'}';		
	}
		
	public function buscarAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true); 		 	
 			
 		try{ 			
 			$id = $this->_request->tpterreno_id; 		 		
 		    $tpterreno = new Model_DbTable_Tpterreno();
 		    $dadosTpterreno = $tpterreno->buscarTpterreno('tpterreno_id',$id);
 		    echo '{success: true,data:',Zend_Json::encode(current($dadosTpterreno)),'}';	
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

		$tpterreno = new Model_DbTable_Tpterreno();
		$pktpterreno = $this->_request->tpterreno_id;
		
		try{
			if(is_array($pktpterreno)){
				foreach($pktpterreno as $valor){
					$dadosTpterreno = $tpterreno->find($valor)->current();
					$dadosTpterreno->delete();
				}
			}else{
				$dadosTpterreno = $tpterreno->find($pktpterreno)->current();
				$dadosTpterreno->delete();
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
		
		$tpterreno = new Model_DbTable_Tpterreno();
		$post['usuario_login'] = $funcoes->userAtivo();		
	    try {
	    	//-- converte para maiscula
	    	foreach($post as $campo=> $valor){	    		
	    		$post[$campo] = strtoupper(trim($valor));
	    	}   	
	    	$post['usuario_login'] = $funcoes->userAtivo();
	    	if($post['tpterreno_id']==0){
	    		$tpterreno->insert($post);   		
	    	}else{
	    		$tpterreno->update($post,"tpterreno_id = {$post['tpterreno_id']}");	    		
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
 		    $tpterreno = new Model_DbTable_Tpterreno(); 		    
 		    $dadosTpterreno = $tpterreno->todoTpterreno();
 		    echo Zend_Json::encode($dadosTpterreno); 		    
		}catch(Exception $e){
			echo '{success: false}';
			// Zend_Debug::dump($e);
		}
	}
}
?>

