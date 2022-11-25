<?php

class ExumacaoController extends Zend_Controller_Action {
	
	public function init()
	{
						
	}	
	
	public function indexAction()
	{			
		$this->_redirect('exumacao/listar');
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
 		
		$exumacao = new Model_DbTable_Exumacao();
		$contar = 30;
		if(!empty($value)){				
		    $contar = $exumacao->contarExumacao($field,$value);		
		}		
		$dadosExumacao = $exumacao->listarExumacao($start,$limit,$sort,$dir,$field,$value);
		echo '{rows:',Zend_Json::encode($dadosExumacao),',totalCount: ',$contar,'}';		
	}
		
	public function buscarAction()
	{
		// Desativando renderiza��o do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderiza��o da view
 		$this->_helper->_viewRenderer->setNoRender(true); 		 	
 			
 		try{ 			
 			$id = $this->_request->exumacao_id; 		 		
 		    $exumacao = new Model_DbTable_Exumacao();
 		    $funcoes = new Model_Function_Geral();
 		    
 		    $dadosExumacao = $exumacao->buscarExumacao('exumacao_id',$id);
 		    $dadosExumacao = current($dadosExumacao);
 		    
 		    $dadosExumacao['exumacao_data'] = $funcoes->databrGeral($dadosExumacao['exumacao_data']);
 		    echo '{success: true,data:',Zend_Json::encode($dadosExumacao),'}';	
		}catch(Exception $e){
			echo '{success: false}';
			// Zend_Debug::dump($e);
		} 		     			
	}
	
	public function excluirAction()	
	{
		// Desativando renderiza��o do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderiza��o da view
 		$this->_helper->_viewRenderer->setNoRender(true); 

		$exumacao = new Model_DbTable_Exumacao();
		$pkexumacao = $this->_request->exumacao_id;
		
		try{
			if(is_array($pkexumacao)){
				foreach($pkexumacao as $valor){
					$dadosExumacao = $exumacao->find($valor)->current();
					$dadosExumacao->delete();
				}
			}else{
				$dadosExumacao = $exumacao->find($pkexumacao)->current();
				$dadosExumacao->delete();
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

        $exumacao = new Model_DbTable_Exumacao();
        $funcoes = new Model_Function_Geral();
        $obito = new Model_DbTable_Obito();
        $jazigo = new Model_DbTable_Jazigo();

        try {
	    	//-- converte para maiscula
	    	foreach($post as $campo=> $valor){	    		
	    		$post[$campo] = strtoupper(trim($valor));
	    	}

            //-- busca o falecido
            $dadosObito = $obito->find($post['obito_id'])->current();

            //-- busca o dono do novo jazigo
            $dadosJazigo = $jazigo->buscarJazigo('jazigo_codigo',$post['jazigo_codigo_dest']);
            $dadosJazigo = current($dadosJazigo);

            $dadosExumacao = array(
            'jazigo_codigo'=>$post['jazigo_codigo'],
            'exumacao_falecido'=>$dadosObito['obito_falecido'],
            'destino_id'=>$post['destino_id'],
            'exumacao_data'=>$funcoes->dataeuaGeral($post['exumacao_data']),
            'jazigo_codigo_dest'=>$post['jazigo_codigo_dest'],
            'exumacao_lacre'=>$post['exumacao_lacre'],
            'exumacao_obs'=>$post['exumacao_obs'],
            'usuario_login'=>$funcoes->userAtivo()
            );

            if($post['exumacao_id']==0){
	    		$exumacao->insert($dadosExumacao);
	    	}else{
	    		$exumacao->update($dadosExumacao,"exumacao_id = {$post['exumacao_id']}");
	    	}
	    		    	
		    echo '{success: true}';
		} catch(Exception $e) {
			$db->rollBack();
			echo '{success: false}';
			Zend_Debug::dump($e);
		}  				
	}
	
}
?>

