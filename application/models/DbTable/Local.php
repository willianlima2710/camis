<?php
class Model_DbTable_Local extends Zend_Db_Table {
	protected $_name 	= 'cad_local';
	protected $_primary = 'local_id';
	
	public function listarLocal($start,$limit,$sort,$dir,$field,$value)
	{		
		$sql = $this->_db->select()
					->from('cad_local')
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
	public function buscarLocal($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_local');
		
		if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
		}							
		return $this->_db->fetchAll($sql);		
	}	
    public function todoLocal()
	{
		$sql = $this->_db->select()
					->from('cad_local')
					->order('local_desc ASC');
		return $this->_db->fetchAll($sql);
	}	
	public function contarLocal($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_local',array('COUNT(*)'));					
					
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
