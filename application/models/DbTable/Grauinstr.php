<?php
class Model_DbTable_Grauinstr extends Zend_Db_Table {
	protected $_name 	= 'cad_grauinstr';
	protected $_primary = 'grauinstr_id';
	
	public function listarGrauinstr($start,$limit,$sort,$dir,$field,$value)
	{		
		$sql = $this->_db->select()
					->from('cad_grauinstr')
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
	public function buscarGrauinstr($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_grauinstr');
		
		if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
		}							
		return $this->_db->fetchAll($sql);		
	}
	public function todoGrauinstr()
	{
		$sql = $this->_db->select()
					->from('cad_grauinstr')
					->order('grauinstr_desc ASC');
		return $this->_db->fetchAll($sql);
	}
	public function contarGrauinstr($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_grauinstr',array('COUNT(*)'));					
					
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
