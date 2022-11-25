<?php
class Model_DbTable_Tpterreno extends Zend_Db_Table {
	protected $_name 	= 'cad_tpterreno';
	protected $_primary = 'tpterreno_id';

	public function listarTpterreno($start,$limit,$sort,$dir,$field,$value)
	{		
		$sql = $this->_db->select()
					->from('cad_tpterreno')
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
	public function buscarTpterreno($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_tpterreno');
		
		if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
		}							
		return $this->_db->fetchAll($sql);		
	}
	public function todoTpterreno()
	{
		$sql = $this->_db->select()
					->from('cad_tpterreno')
					->order('tpterreno_desc ASC');
		return $this->_db->fetchAll($sql);
	}
	public function contarTpterreno($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_tpterreno',array('COUNT(*)'));					
					
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
