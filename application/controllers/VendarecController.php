<?php

class VendarecController extends Zend_Controller_Action {
	
	public function init()
	{
						
	}	
	
	public function indexAction()
	{			
		$this->_redirect('vendarec/listar');
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
 		
 		if(empty($value)) {
 			return;
 		}
 		 		
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
 		
		$Vendarec = new Model_DbTable_Vendarec();
		$contar = 30;
		if(!empty($value)){				
		    $contar = $Vendarec->contarVendarec($field,$value);		
		}	
		$dadosVendarec = $Vendarec->listarVendarec($start,$limit,$sort,$dir,$field,$value);
		echo '{rows:',Zend_Json::encode($dadosVendarec),',totalCount: ',$contar,'}';
	}		
}
?>

