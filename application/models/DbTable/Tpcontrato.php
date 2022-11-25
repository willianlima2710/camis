<?php
class Model_DbTable_Tpcontrato extends Zend_Db_Table {
	protected $_name 	= 'cad_tpcontrato';
	protected $_primary = 'tpcontrato_id';

	public function listarTpcontrato($start,$limit,$sort,$dir,$field,$value)
	{		
		$sql = $this->_db->select()
					->from('cad_tpcontrato')
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
	public function buscarTpcontrato($field,$value)
	{
		$sql = $this->_db->select()
					->from(array('a'=>'cad_tpcontrato'))
					->joinLeft(array('b'=>'cad_empresa'),'a.empresa_id=b.empresa_id',
					           array('b.empresa_desc'));	
		if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
		}							
		return $this->_db->fetchAll($sql);		
	}
	public function todoTpcontrato()
	{
		$sql = $this->_db->select()
					->from('cad_tpcontrato')
					->order('tpcontrato_desc ASC');
		return $this->_db->fetchAll($sql);
	}
	public function contarTpcontrato($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_tpcontrato',array('COUNT(*)'));					
					
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
