<?php

class AuditoriaController extends Zend_Controller_Action {
	
	public function init()
	{
						
	}	
	
	public function indexAction()
	{			
		$this->_redirect('auditoria/listar');
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
 			$sort = 'auditoria_data';
 			$dir = 'DESC';
 		}		
 		
		$auditoria = new Model_DbTable_Auditoria();
		$contar = 30;
		if(!empty($value)){				
		    $contar = $auditoria->contarAuditoria($field,$value);		
		}		
		$dadosAuditoria = $auditoria->listarAuditoria($start,$limit,$sort,$dir,$field,$value);		
		echo '{rows:',Zend_Json::encode($dadosAuditoria),',totalCount: ',$contar,'}';
	}		
}
?>

