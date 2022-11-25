<?php

class LocatarioadcController extends Zend_Controller_Action {
	
	public function init()
	{
						
	}	
	
	public function indexAction()
	{			
		$this->_redirect('Locatarioadc/listar');
	}
			
	public function listarAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true);
 		
 		$value = $this->_request->locatario_id;
		
 		$locatarioadc = new Model_DbTable_Locatarioadc();		
		$contar = $locatarioadc->contarLocatarioadc($value); 		
		$dadosLocatarioadc = $locatarioadc->listarLocatarioadc($value);
		
		echo '{rows:',Zend_Json::encode($dadosLocatarioadc),',totalCount: ',$contar,'}';		
	}
	
	public function excluirAction()	
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true); 

		$locatarioadc = new Model_DbTable_Locatarioadc();
		$pklocatario_id = $this->_request->locatario_id;
		$pklocatario_adc_id = $this->_request->locatario_id_adc;
		
		try{
			// inciar transação
	    	$db = $this->getInvokeArg('bootstrap')->getDb();    	
	    	$db->beginTransaction();
			
	    	// monta a condição para exclusão
	    	$condicao = array(
	    	'locatario_id = ?'=>$pklocatario_id,
	    	'locatario_id_adc = ?'=>$pklocatario_adc_id
	    	);
	    	$locatarioadc->delete($condicao);

	    	$db->commit();
		    echo '{success: true}';
		}catch(Exception $e) {
			$db->rollBack();
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
				
		$locatarioadc = new Model_DbTable_Locatarioadc();	
		$funcoes = new Model_Function_Geral();	
	    try {
	    	// verifica se locatario adicional já foi cadastrado para
	    	// o locatario principal
	    	$dadosLocatarioadc = $locatarioadc->buscarLocatarioadc($post['locatario_id'],$post['locatario_adc_id']);
	    	
	    	if(count($dadosLocatarioadc)>0){
				echo "{success:false, msg: {text: 'Locatario adicional já cadastrado!'}}";
				return;    		
	    	}
	    	
	    	//-- converte para maiscula
	    	foreach($post as $campo=> $valor){	    		
	    		$post[$campo] = strtoupper(trim($valor));
	    	}   	
	    	$post['locatario_adc_data_cadastro'] = date('Y-m-d');  	
	    	$post['usuario_login'] = $funcoes->userAtivo();			    	
	    	$locatarioadc->insert($post);
	    		    	   		
		    echo '{success: true}';
		} catch(Exception $e) {
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
 			$locatarioadc = new Model_DbTable_Locatarioadc();
 			$dadosLocatario = $locatarioadc->autocompleteLocatario($value);
 			echo '{rows:',Zend_Json::encode($dadosLocatario),'}';
 		}else{
 			echo '{success: false}';
 		} 				
	}	
}
?>

