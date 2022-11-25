<?php
class Model_DbTable_Cartorio extends Zend_Db_Table {
	protected $_name 	= 'cad_cartorio';
	protected $_primary = 'cartorio_id';

	public function listarCartorio($start,$limit,$sort,$dir,$field,$value)
	{		
		$sql = $this->_db->select()
					->from('cad_cartorio')
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
	public function buscarCartorio($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_cartorio');
		
		if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
		}							
		return $this->_db->fetchAll($sql);		
	}
	 public function todoCartorio()
	{
		$sql = $this->_db->select()
					->from('cad_cartorio')
					->order('cartorio_desc ASC');
		return $this->_db->fetchAll($sql);
	}
	public function contarCartorio($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_cartorio',array('COUNT(*)'));					
					
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
