<?php
class Model_DbTable_Estcivil extends Zend_Db_Table {
	protected $_name 	= 'cad_estcivil';
	protected $_primary = 'estcivil_id';

	public function listarEstcivil($start,$limit,$sort,$dir,$field,$value)
	{		
		$sql = $this->_db->select()
					->from('cad_estcivil')
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
	public function buscarEstcivil($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_estcivil');
		
		if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
		}							
		return $this->_db->fetchAll($sql);		
	}
	public function todoEstcivil()
	{
		$sql = $this->_db->select()
					->from('cad_estcivil')
					->order('estcivil_desc ASC');
		return $this->_db->fetchAll($sql);
	}
	public function contarEstcivil($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_estcivil',array('COUNT(*)'));					
					
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
