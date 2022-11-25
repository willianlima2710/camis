<?php
class Model_DbTable_Formarec extends Zend_Db_Table {
	protected $_name 	= 'cad_formarec';
	protected $_primary = 'formarec_id';

	public function listarFormarec($start,$limit,$sort,$dir,$field,$value)
	{		
		$sql = $this->_db->select()
					->from('cad_formarec')
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
	public function buscarFormarec($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_formarec');
		
		if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
		}							
		return $this->_db->fetchAll($sql);		
	}
    public function todoCbo()
	{
		$sql = $this->_db->select()
					->from('cad_formarec')
					->order('formarec_desc ASC');
		return $this->_db->fetchAll($sql);
	}	
	public function contarFormarec($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_formarec',array('COUNT(*)'));					
					
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
