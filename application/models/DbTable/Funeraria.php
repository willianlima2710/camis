<?php
class Model_DbTable_Funeraria extends Zend_Db_Table {
	protected $_name 	= 'cad_funeraria';
	protected $_primary = 'funeraria_id';

	public function listarFuneraria($start,$limit,$sort,$dir,$field,$value)
	{		
		$sql = $this->_db->select()
					->from('cad_funeraria')
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
	public function buscarFuneraria($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_funeraria');
		
		if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
		}							
		return $this->_db->fetchAll($sql);		
	}
	public function todoFuneraria()
	{
		$sql = $this->_db->select()
					->from('cad_funeraria')
					->order('funeraria_desc ASC');
		return $this->_db->fetchAll($sql);
	}
	public function contarFuneraria($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_funeraria',array('COUNT(*)'));					
					
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
