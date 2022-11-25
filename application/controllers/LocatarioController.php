<?php

class LocatarioController extends Zend_Controller_Action {
	
	public function init()
	{
						
	}	
	
	public function indexAction()
	{			
		$this->_redirect('locatario/listar');
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
 		 		
 		try { 
 		$start = intval($start);
		$limit = intval($limit);	
		
 		if ($start == 0){
 			$start = 0;
 		}
 		
		if($limit == 0) {
			$limit = 30;
		}
		
		if(empty($sort)){
			$sort = 'data_ultima_alteracao';
			$dir = 'DESC';
		}
		$locatario = new Model_DbTable_Locatario();		
		$contar = 30;
		if(!empty($value)){				
		    $contar = $locatario->contarLocatario($field,$value);		
		}				
 		$dadosLocatario = $locatario->listarLocatario($start,$limit,$sort,$dir,$field,$value);
		echo '{rows:',Zend_Json::encode($dadosLocatario),',totalCount: ',$contar,'}';		
		}catch(Exception $e){
			echo '{success: false}';
			Zend_Debug::dump($e);
		}
		
	}
		
	public function buscarAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true); 		 	
 			
 		try{ 			
 			$id = $this->_request->locatario_id; 		 		
 		    $locatario = new Model_DbTable_Locatario();
 		    $funcoes = new Model_Function_Geral();
 		    
 		    $dadosLocatario = $locatario->buscarLocatario('locatario_id',$id);
 		    $dadosLocatario = current($dadosLocatario);
 		    $dadosLocatario['locatario_data_cadastro'] =  $funcoes->databrGeral($dadosLocatario['locatario_data_cadastro']);
 		    $dadosLocatario['locatario_data_nascimento'] =  $funcoes->databrGeral($dadosLocatario['locatario_data_nascimento']);
 		    
 		    echo '{success: true,data:',Zend_Json::encode($dadosLocatario),'}';	
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

		$locatario = new Model_DbTable_Locatario();
		$pklocatario = $this->_request->locatario_id;
		
		try{
			if(is_array($pklocatario)){
				foreach($pklocatario as $valor){
					$dadosLocatario = $locatario->find($valor)->current();
					$dadosLocatario->delete();
				}
			}else{
				$dadosLocatario = $locatario->find($pklocatario)->current();
				$dadosLocatario->delete();
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
		
		$locatario = new Model_DbTable_Locatario();
		$locatarioadc = new Model_DbTable_Locatarioadc();	
		$funcoes = new Model_Function_Geral();	
	    try {
	    	// inciar transação
	    	$db = $this->getInvokeArg('bootstrap')->getDb();    	
	    	$db->beginTransaction();
	    	
	    	//-- converte para maiscula
	    	foreach($post as $campo=> $valor){	    		
	    		$post[$campo] = strtoupper(trim($valor));
	    	}   	
	    	
	    	$post['estcivil_id'] = empty($post['estcivil_id']) ? 0 : $post['estcivil_id'];
	    	$post['cbo_id'] = empty($post['cbo_id']) ? 0 : $post['cbo_id'];
	    	$post['grauinstr_id'] = empty($post['grauinstr_id']) ? 0 : $post['grauinstr_id'];
	    	$post['religiao_id'] = empty($post['grauinstr_id']) ? 0 : $post['religiao_id'];	    	  
	    	$post['locatario_data_cadastro'] = $funcoes->dataeuaGeral($post['locatario_data_cadastro']);
			$post['locatario_data_nascimento'] = $funcoes->dataeuaGeral($post['locatario_data_nascimento']);
			$post['usuario_login'] = $funcoes->userAtivo();			    	
	    	if($post['locatario_id']==0){
	    		$locatario->insert($post);
	    		$pklocatario = $locatario->getAdapter()->lastInsertId();   		
	    	}else{
	    		$locatario->update($post,"locatario_id = {$post['locatario_id']}");
	    		$pklocatario = $post['locatario_id']; 	    		
	    	}
	    	$post['locatario_id'] = $pklocatario;

	    	// verifica se ja foi lançado nos adicionais
	    	$dadosLocatarioadc = $locatarioadc->buscarLocatarioadc($post['locatario_id'],$post['locatario_id']);	    	
	    	if(count($dadosLocatarioadc)==0){
	    		$dadosLocatarioadc = array(
	    		'locatario_id'=>$post['locatario_id'],
	    		'locatario_adc_id'=>$post['locatario_id'],
	    		'locatario_adc_desc'=>$post['locatario_desc'],
	    		'locatario_adc_data_cadastro'=>$post['locatario_data_cadastro'],
	    		'usuario_login'=>$post['usuario_login']	    		
	    		);
	    		$locatarioadc->insert($dadosLocatarioadc);
	    	}	    	
	    	
	    	$db->commit();
		    echo '{success: true}';
		} catch(Exception $e) {
			$db->rollBack();
			echo '{success: false}';
			Zend_Debug::dump($e);
		}  				
	}

	public function autocompleteAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true);
 		
 		$value = $this->_request->value;
 		
 		if(!empty($value)){
 			$locatario = new Model_DbTable_Locatario();
 			$dadosLocatario = $locatario->autocompleteLocatario($value);
 			echo '{rows:',Zend_Json::encode($dadosLocatario),'}';
 		}else{
 			echo '{success: false}';
 		} 				
	}	
}
?>

