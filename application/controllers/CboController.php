<?php

class CboController extends Zend_Controller_Action {
	
	protected $orientation ='P';
	protected $unit = 'mm';
	protected $format ='A4';
	protected $titulo = 'RELATÓRIO DE OCUPAÇÕES';
	protected $header = array(
	'Id'=>10,
	'Código'=>10,
	'Descrição'=>60
	);
	public function init()
	{
		/*
		$auth = Zend_Auth::getInstance();
			
		if(!$auth->hasIdentity()) {	  	    
			$this->_redirect('auth/login');
		}
		*/	   
	}	
	
	public function indexAction()
	{			
		$this->_redirect('cbo/listar');
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
 		
		$cbo = new Model_DbTable_Cbo();
		$contar = 30;
		if(!empty($value)){				
		    $contar = $cbo->contarCbo($field,$value);		
		}	
		$dadosCbo = $cbo->listarCbo($start,$limit,$sort,$dir,$field,$value);
		echo '{rows:',Zend_Json::encode($dadosCbo),',totalCount: ',$contar,'}';
	}
		
	public function buscarAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true); 		 	
 			
 		try{ 			
 			$id = $this->_request->cbo_id; 		 		
 		    $cbo = new Model_DbTable_Cbo();
 		    $dadosCbo = $cbo->buscarCbo('cbo_id',$id);
 		    echo '{success: true,data:',Zend_Json::encode(current($dadosCbo)),'}';	
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

		$cbo = new Model_DbTable_Cbo();
		$pkcbo = $this->_request->cbo_id;
		
		try{
			if(is_array($pkcbo)){
				foreach($pkcbo as $valor){
					$dadosCbo = $cbo->find($valor)->current();
					$dadosCbo->delete();
				}
			}else{
				$dadosCbo = $cbo->find($pkcbo)->current();
				$dadosCbo->delete();
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
		
		$cbo = new Model_DbTable_Cbo();
		$funcoes = new Model_Function_Geral();		
		try {	    
	    	//-- converte para maiscula
	    	foreach($post as $campo=> $valor){	    		
	    		$post[$campo] = strtoupper(trim($valor));
	    	}
	    	$post['usuario_login'] = $funcoes->userAtivo();	
	    	if($post['cbo_id']==0){
	    		$cbo->insert($post);   		
	    	}else{
	    		$cbo->update($post,"cbo_id = {$post['cbo_id']}");	    		
	    	}   	    
		    echo '{success: true}',$this->user['usuario_login'];
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
 		    $cbo = new Model_DbTable_Cbo(); 		    
 		    $dadosCbo = $cbo->todoCbo();
 		    echo Zend_Json::encode($dadosCbo); 		    
		}catch(Exception $e){
			echo '{success: false}';
			// Zend_Debug::dump($e);
		}
	}	
	
	public function pdfAction()
	{	
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true);
 		        
 		try {
 			$value = $this->_request->value;
 			$field = $this->_request->field;
 			
 			$cbo = new Model_DbTable_Cbo();
	        $dadosCbo = $cbo->buscarCbo($field,$value);
	        $funcoes = new Model_Function_Geral();	        
	        
	        $pdf = new Model_Function_PDF($this->orientation,
	                                      $this->unit,
	                                      $this->format,
	                                      $this->titulo,
	                                      $dadosCbo);	                                      
    
	        for($x=1; $x<=$pdf->paginaTable(); $x++) {
	        	$pdf->AddPage();
	        	$pdf->headerTable($this->header);
	        	$pdf->detailTable();

	        	for($i=$pdf->getInicio(); $i<$pdf->getFim(); $i++) {
	        		$pdf->Cell(10*1.7, 4, $dadosCbo[$i]["cbo_id"],'B', 0, 'C');
	        		$pdf->Cell(10*1.7, 4, $dadosCbo[$i]["cbo_codigo"], 'B', 0, 'C');
	        		$pdf->Cell(60*1.7, 4, $dadosCbo[$i]["cbo_desc"], 'B', 1, 'L');
	        		$pdf->setLinha();
	    	    }       	
            }	   
	        $pdf->Summary();
	        $arquivo = $funcoes->retArquivo('CAD01');
	        $pdf->Output($arquivo);
       	    echo "<iframe src=$arquivo style=border:0 width=100% height=100%></iframe>";   	 		
 		}catch(Exception $e){
			//Zend_Debug::dump($e);
		}
	}	
}
?>

