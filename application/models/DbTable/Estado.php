<?php
class Model_DbTable_Estado extends Zend_Db_Table {
	protected $_name 	= 'cad_estado';
	protected $_primary = 'estado_id';

	public function listarEstado($start,$limit,$sort,$dir,$field,$value)
	{		
		$sql = $this->_db->select()
					->from('cad_estado')
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
	public function buscarEstado($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_estado');
		
		if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
		}							
		return $this->_db->fetchAll($sql);		
	}
	public function todoEstado()
	{
		$sql = $this->_db->select()
					->from('cad_estado')
					->order('estado_desc ASC');
		return $this->_db->fetchAll($sql);
	}
	public function contarEstado($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_estado',array('COUNT(*)'));					
					
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
