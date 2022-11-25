<?php
class Model_DbTable_Corcurtis extends Zend_Db_Table {
	protected $_name 	= 'cad_corcurtis';
	protected $_primary = 'corcurtis_id';

	public function listarCorcurtis($start,$limit,$sort,$dir,$field,$value)
	{		
		$sql = $this->_db->select()
					->from('cad_corcurtis')
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
	public function buscarCorcurtis($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_corcurtis');
		
		if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
		}							
		return $this->_db->fetchAll($sql);		
	}
    public function todoCorcurtis()
	{
		$sql = $this->_db->select()
					->from('cad_corcurtis')
					->order('corcurtis_desc ASC');
		return $this->_db->fetchAll($sql);
	}	
	public function contarCorcurtis($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_corcurtis',array('COUNT(*)'));					
					
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
