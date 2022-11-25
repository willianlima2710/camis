<?php
class Model_DbTable_Pais extends Zend_Db_Table {
	protected $_name 	= 'cad_pais';
	protected $_primary = 'pais_id';

	public function listarPais($start,$limit,$sort,$dir,$field,$value)
	{		
		$sql = $this->_db->select()
					->from('cad_pais')
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
	public function buscarPais($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_pais');
		
		if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
		}							
		return $this->_db->fetchAll($sql);		
	}
	public function todoPais()
	{
		$sql = $this->_db->select()
					->from('cad_pais')
					->order('pais_desc ASC');
		return $this->_db->fetchAll($sql);
	}
	public function contarPais($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_pais',array('COUNT(*)'));					
					
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
