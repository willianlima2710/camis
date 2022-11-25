<?php
class Model_DbTable_Lote extends Zend_Db_Table {
	protected $_name 	= 'cad_lote';
	protected $_primary = 'lote_id';
	
	public function listarLote($start,$limit,$sort,$dir,$field,$value)
	{		
		$sql = $this->_db->select()
					->from('cad_lote')
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
	public function buscarLote($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_lote');
		
		if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
		}							
		return $this->_db->fetchAll($sql);		
	}
    public function todoLote()
	{
		$sql = $this->_db->select()
					->from('cad_lote')
					->order('lote_desc ASC');
		return $this->_db->fetchAll($sql);
	}
	public function contarLote($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_lote',array('COUNT(*)'));					
					
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
