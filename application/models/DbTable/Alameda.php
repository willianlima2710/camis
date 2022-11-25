<?php
class Model_DbTable_Alameda extends Zend_Db_Table {
	protected $_name 	= 'cad_alameda';
	protected $_primary = 'alameda_id';

	public function listarAlameda($start,$limit,$sort,$dir,$field,$value)
	{		
		$sql = $this->_db->select()
					->from('cad_alameda')
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
	public function buscarAlameda($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_alameda');
		
		if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
		}							
		return $this->_db->fetchAll($sql);		
	}
	public function todoAlameda()
	{
		$sql = $this->_db->select()
					->from('cad_alameda')
					->order('alameda_desc ASC');
		return $this->_db->fetchAll($sql);
	}
	public function contarAlameda($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_alameda',array('COUNT(*)'));					
					
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
