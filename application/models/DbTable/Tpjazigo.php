<?php
class Model_DbTable_Tpjazigo extends Zend_Db_Table {
	protected $_name 	= 'cad_tpjazigo';
	protected $_primary = 'Tpjazigo_id';

	public function listarTpjazigo($start,$limit,$sort,$dir,$field,$value)
	{		
		$sql = $this->_db->select()
					->from('cad_tpjazigo')
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
	public function buscarTpjazigo($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_tpjazigo');
		
		if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
		}							
		return $this->_db->fetchAll($sql);		
	}
	public function todoTpjazigo()
	{
		$sql = $this->_db->select()
					->from('cad_tpjazigo')
					->order('tpjazigo_desc ASC');
		return $this->_db->fetchAll($sql);
	}
	public function contarTpjazigo($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_tpjazigo',array('COUNT(*)'));					
					
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
