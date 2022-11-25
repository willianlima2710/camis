<?php
class Model_DbTable_Banco extends Zend_Db_Table {
	protected $_name 	= 'cad_banco';
	protected $_primary = 'banco_id';
	
	public function listarBanco($start,$limit,$sort,$dir,$field,$value)
	{		
		$sql = $this->_db->select()
					->from('cad_banco')
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
	public function buscarBanco($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_banco');
		
		if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
		}							
		return $this->_db->fetchAll($sql);		
	}
    public function todoBanco()
	{
		$sql = $this->_db->select()
					->from('cad_banco')
					->order('banco_desc ASC');
		return $this->_db->fetchAll($sql);
	}
	public function contarBanco($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_banco',array('COUNT(*)'));					
					
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
