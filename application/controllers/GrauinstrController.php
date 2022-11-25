<?php

class GrauinstrController extends Zend_Controller_Action {
	
	public function init()
	{
						
	}	
	
	public function indexAction()
	{			
		$this->_redirect('grauinstr/listar');
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
 		
		$grauinstr = new Model_DbTable_Grauinstr();
		$contar = 30;
		if(!empty($value)){				
		    $contar = $grauinstr->contarGrauinstr($field,$value);		
		}		
		$dadosGrauinstr = $grauinstr->listarGrauinstr($start,$limit,$sort,$dir,$field,$value);
		echo '{rows:',Zend_Json::encode($dadosGrauinstr),',totalCount: ',$contar,'}';		
	}
		
	public function buscarAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true); 		 	
 			
 		try{ 			
 			$id = $this->_request->grauinstr_id; 		 		
 		    $grauinstr = new Model_DbTable_Grauinstr();
 		    $dadosGrauinstr = $grauinstr->buscarGrauinstr('grauinstr_id',$id);
 		    echo '{success: true,data:',Zend_Json::encode(current($dadosGrauinstr)),'}';	
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

		$grauinstr = new Model_DbTable_Grauinstr();
		$pkgrauinstr = $this->_request->grauinstr_id;
		
		try{
			if(is_array($pkgrauinstr)){
				foreach($pkgrauinstr as $valor){
					$dadosGrauinstr = $grauinstr->find($valor)->current();
					$dadosGrauinstr->delete();
				}
			}else{
				$dadosGrauinstr = $grauinstr->find($pkgrauinstr)->current();
				$dadosGrauinstr->delete();
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
		
		$grauinstr = new Model_DbTable_Grauinstr();
		$funcoes = new Model_Function_Geral();		
	    try {
	    	//-- converte para maiscula
	    	foreach($post as $campo=> $valor){	    		
	    		$post[$campo] = strtoupper(trim($valor));
	    	}   	
	    	$post['usuario_login'] = $funcoes->userAtivo();
	    	if($post['grauinstr_id']==0){
	    		$grauinstr->insert($post);   		
	    	}else{
	    		$grauinstr->update($post,"grauinstr_id = {$post['grauinstr_id']}");	    		
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
 		    $grauinstr = new Model_DbTable_Grauinstr(); 		    
 		    $dadosGrauinstr = $grauinstr->todoGrauinstr();
 		    echo Zend_Json::encode($dadosGrauinstr);	
		}catch(Exception $e){
			echo '{success: false}';
			// Zend_Debug::dump($e);
		}
	}	
}
?>

