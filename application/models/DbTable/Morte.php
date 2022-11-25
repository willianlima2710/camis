<?php
class Model_DbTable_Morte extends Zend_Db_Table {
	protected $_name 	= 'cad_morte';
	protected $_primary = 'morte_id';

	public function listarMorte($start,$limit,$sort,$dir,$field,$value)
	{		
		$sql = $this->_db->select()
					->from('cad_morte')
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
	public function buscarMorte($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_morte');
		
		if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
		}							
		return $this->_db->fetchAll($sql);		
	}
	public function todoMorte()
	{
		$sql = $this->_db->select()
					->from('cad_morte')
					->order('morte_desc ASC');
		return $this->_db->fetchAll($sql);
	}
	public function contarMorte($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_morte',array('COUNT(*)'));					
					
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
