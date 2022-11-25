<?php
class Model_DbTable_Cemiterio extends Zend_Db_Table {
	protected $_name 	= 'cad_cemiterio';
	protected $_primary = 'cemiterio_id';

	public function listarCemiterio($start,$limit,$sort,$dir,$field,$value)
	{		
		$sql = $this->_db->select()
					->from('cad_cemiterio')
					->order($sort.' '.$dir)				
					->limit($limit,$start);															
		
		if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
   	    }		
		return $this->_db->fetchAll($sql);		
	}
	public function buscarCemiterio($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_cemiterio');
		
		if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
		}							
		return $this->_db->fetchAll($sql);		
	}
	public function todoCemiterio()
	{
		$sql = $this->_db->select()
					->from('cad_cemiterio')
					->order('Cemiterio_desc ASC');
		return $this->_db->fetchAll($sql);
	}
	public function contarCemiterio($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_cemiterio',array('COUNT(*)'));					
					
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
