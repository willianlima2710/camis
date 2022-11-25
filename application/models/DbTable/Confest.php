<?php
class Model_DbTable_Confest extends Zend_Db_Table {
	protected $_name 	= 'mov_confest';
	protected $_primary = 'confest_id';

	public function listarConfest($start,$limit,$sort,$dir,$field,$value)
	{		
		$sql = $this->_db->select()
					->from(array('a'=>'mov_confest'))
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
	public function buscarConfest($field,$value)
	{
		$sql = $this->_db->select()
					->from(array('a'=>'mov_confest'));
					           
		if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
		}							
		return $this->_db->fetchAll($sql);		
	}	
	public function contarConfest($field,$value)
	{
		$sql = $this->_db->select()
					->from('mov_confest',array('COUNT(*)'));					
					
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
