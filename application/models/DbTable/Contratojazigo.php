<?php
class Model_DbTable_Contratojazigo extends Zend_Db_Table {
	protected $_name 	= 'cad_contrato_jazigo';
	protected $_primary = 'contrato_jazigo_id';
	
	public function listarContratojazigo($field,$value)
	{		
		$sql = $this->_db->select()
					->from('cad_contrato_jazigo');
		
		if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
   	    }		
		return $this->_db->fetchAll($sql);		
	}
	public function buscarContratojazigo($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_contrato_jazigo');
		
		if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
		}							
		return $this->_db->fetchAll($sql);		
	}
	public function contarContratojazigo($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_contrato_jazigo',array('COUNT(*)'));					
					
        if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
   	    }					
		return $this->_db->fetchOne($sql);			
	}
}
?>
