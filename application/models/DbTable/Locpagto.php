<?php
class Model_DbTable_Locpagto extends Zend_Db_Table {
	protected $_name 	= 'cad_locpagto';
	protected $_primary = 'locpagto_id';

	public function listarLocpagto($start,$limit,$sort,$dir,$field,$value)
	{		
		$sql = $this->_db->select()
					->from('cad_locpagto')
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
	public function buscarLocpagto($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_locpagto');
		
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
					->from('cad_locpagto')
					->order('locpagto_desc ASC');
		return $this->_db->fetchAll($sql);
	}	
	public function contarLocpagto($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_locpagto',array('COUNT(*)'));					
					
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
