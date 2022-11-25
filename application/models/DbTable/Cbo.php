<?php
class Model_DbTable_Cbo extends Zend_Db_Table {
	protected $_name 	= 'cad_cbo';
	protected $_primary = 'cbo_id';
	
	public function listarCbo($start,$limit,$sort,$dir,$field,$value)
	{		
		$sql = $this->_db->select()
					->from('cad_cbo')
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
	public function buscarCbo($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_cbo')
					->order('data_ultima_alteracao DESC');
		
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
					->from('cad_cbo')
					->order('cbo_desc ASC');
		return $this->_db->fetchAll($sql);
	}
	public function contarCbo($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_cbo',array('COUNT(*)'));					
					
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
