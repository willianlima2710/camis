<?php

class ObitoController extends Zend_Controller_Action {
	
	public function init()
	{
						
	}	
	
	public function indexAction()
	{			
		$this->_redirect('obito/listar');
	}
			
	public function listarAction()
	{
		// Desativando renderiza��o do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderiza��o da view
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
 		
		$obito = new Model_DbTable_Obito();
		$contar = 30;
		if(!empty($value)){				
		    $contar = $obito->contarObito($field,$value);		
		}		
		$dadosObito = $obito->listarObito($start,$limit,$sort,$dir,$field,$value);		
		echo '{rows:',Zend_Json::encode($dadosObito),',totalCount: ',$contar,'}';
	}
		
	public function buscarAction()
	{
		// Desativando renderiza��o do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderiza��o da view
 		$this->_helper->_viewRenderer->setNoRender(true); 		 	
 			
 		try{ 			
 			$id = $this->_request->obito_id; 		 		
 		    $obito = new Model_DbTable_Obito();
 		    $funcoes = new Model_Function_Geral();
 		    
 		    $dadosObito = $obito->buscarObito('obito_id',$id);
 		    $dadosObito = current($dadosObito);
 		    $dadosObito['obito_data_nascimento'] = $funcoes->databrGeral($dadosObito['obito_data_nascimento']);
 		    $dadosObito['obito_data_falecimento'] = $funcoes->databrGeral($dadosObito['obito_data_falecimento']);
 		    $dadosObito['obito_data_sepultamento'] = $funcoes->databrGeral($dadosObito['obito_data_sepultamento']);     
 		    $dadosObito['obito_data_cadastro'] = $funcoes->databrGeral($dadosObito['obito_data_cadastro']);
 		    echo '{success: true,data:',Zend_Json::encode($dadosObito),'}';	
		}catch(Exception $e){
			echo '{success: false}';
			Zend_Debug::dump($e);
		} 		     			
	}
	
	public function excluirAction()	
	{
		// Desativando renderiza��o do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderiza��o da view
 		$this->_helper->_viewRenderer->setNoRender(true); 

		$obito = new Model_DbTable_Obito();
		$pkobito = $this->_request->obito_id;
		
		try{
			if(is_array($pkobito)){
				foreach($pkobito as $valor){
					$dadosObito = $obito->find($valor)->current();
					$dadosObito->delete();
				}
			}else{
				$dadosObito = $obito->find($pkobito)->current();
				$dadosObito->delete();
			};
		    echo '{success: true}';
		}catch(Exception $e) {
			echo '{success: false}';
			// Zend_Debug::dump($e);
		}
	}
	   
	public function salvarAction()
	{		
		// Desativando renderiza��o do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderiza��o da view
 		$this->_helper->_viewRenderer->setNoRender(true);
 		 
		$post = $this->_request->getPost();				
		unset($post['action']);
		
		$obito = new Model_DbTable_Obito();
		$funcoes = new Model_Function_Geral();		
	    try {
	    	//-- converte para maiscula
	    	foreach($post as $campo=> $valor){	    		
	    		$post[$campo] = strtoupper(trim($valor));
	    	}
	    	$post["obito_data_cadastro"] = empty($post["obito_data_cadastro"]) ? date('Y-m-d') : $funcoes->dataeuaGeral($post["obito_data_cadastro"]);
	    	$post["obito_data_nascimento"] = $funcoes->dataeuaGeral($post["obito_data_nascimento"]);
	    	$post["obito_data_falecimento"] = $funcoes->dataeuaGeral($post["obito_data_falecimento"]);
	    	$post["obito_data_sepultamento"] = $funcoes->dataeuaGeral($post["obito_data_sepultamento"]);
	    	$post["obito_possui_bem"] = !isset($post["obito_possui_bem"]) ? 0 : $post["obito_possui_bem"]; 
	    	$post["obito_possui_testamento"] = !isset($post["obito_possui_testamento"]) ? 0 : $post["obito_possui_testamento"];
	    	$post["obito_tanato"] = !isset($post["obito_tanato"]) ? 0 : $post["obito_tanato"];
	    	$post["obito_zincado"] = !isset($post["obito_zincado"]) ? 0 : $post["obito_zincado"];
	    	$post['usuario_login'] = $funcoes->userAtivo();   	  	
	    	if($post['obito_id']==0){
	    		$obito->insert($post);   		
	    	}else{
	    		$obito->update($post,"obito_id = {$post['obito_id']}");	    		
	    	}   	    
		    echo '{success: true}';
		} catch(Exception $e) {
			echo '{success: false}';
			Zend_Debug::dump($e);
		}  				
	}

    public function todoAction()
    {
        // Desativando renderiza��o do layout
        $this->_helper->layout->disableLayout();

        // Desativando renderiza��o da view
        $this->_helper->_viewRenderer->setNoRender(true);
        $obito = new Model_DbTable_Obito();

        try{
            $post = $this->_request->getPost();
            $dadosObito = $obito->todoObito($post['jazigo_codigo']);

            echo Zend_Json::encode($dadosObito);
        }catch(Exception $e){
            echo '{success: false}';
            Zend_Debug::dump($e);
        }
    }
}
?>

