<?php
class Model_DbTable_Quadra extends Zend_Db_Table {
	protected $_name 	= 'cad_quadra';
	protected $_primary = 'quadra_id';

	public function listarQuadra($start,$limit,$sort,$dir,$field,$value)
	{		
		$sql = $this->_db->select()
					->from('cad_quadra')
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
	public function buscarQuadra($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_quadra');
		
		if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
		}							
		return $this->_db->fetchAll($sql);		
	}
	public function todoQuadra()
	{
		$sql = $this->_db->select()
					->from('cad_quadra')
					->order('quadra_desc ASC');
		return $this->_db->fetchAll($sql);
	}
	public function contarQuadra($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_quadra',array('COUNT(*)'));					
					
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
