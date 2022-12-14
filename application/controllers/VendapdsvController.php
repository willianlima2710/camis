<?php

class VendapdsvController extends Zend_Controller_Action {
	
	public function init()
	{
						
	}	
	
	public function indexAction()
	{			
		$this->_redirect('vendapdsv/listar');
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
 		
		$vendapdsv = new Model_DbTable_Vendapdsv();
		$contar = 30;
		if(!empty($value)){				
		    $contar = $vendapdsv->contarVendapdsv($field,$value);		
		}	
		$dadosVendapdsv = $vendapdsv->listarVendapdsv($start,$limit,$sort,$dir,$field,$value);
		echo '{rows:',Zend_Json::encode($dadosVendapdsv),',totalCount: ',$contar,'}';
	}		
}
?>

