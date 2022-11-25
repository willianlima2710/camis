<?php
class Model_DbTable_Religiao extends Zend_Db_Table {
	protected $_name 	= 'cad_religiao';
	protected $_primary = 'religiao_id';

	public function listarReligiao($start,$limit,$sort,$dir,$field,$value)
	{		
		$sql = $this->_db->select()
					->from('cad_religiao')
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
	public function buscarReligiao($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_religiao');
		
		if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
		}							
		return $this->_db->fetchAll($sql);		
	}
    public function todoReligiao()
	{
		$sql = $this->_db->select()
					->from('cad_religiao')
					->order('religiao_desc ASC');
		return $this->_db->fetchAll($sql);
	}
	public function contarReligiao($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_religiao',array('COUNT(*)'));					
					
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
