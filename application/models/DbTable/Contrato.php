<?php
class Model_DbTable_Contrato extends Zend_Db_Table {
	protected $_name 	= 'cad_contrato';
	protected $_primary = 'contrato_id';
	
	public function listarContrato($start,$limit,$sort,$dir,$field,$value)
	{		
		$sql = $this->_db->select()
					->from(array('a'=>'cad_contrato'))
					->joinLeft(array('b'=>'cad_tpcontrato'),'a.tpcontrato_id=b.tpcontrato_id',
					           array('b.tpcontrato_desc'))					
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
	public function buscarContrato($field,$value)
	{
		$sql = $this->_db->select()
					->from(array('a'=>'cad_contrato'))
					->joinLeft(array('b'=>'cad_tpcontrato'),'a.tpcontrato_id=b.tpcontrato_id',
					           array('b.tpcontrato_desc'));					
		
		if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
		}							
		return $this->_db->fetchAll($sql);		
	}
	public function todoContrato()
	{
		$sql = $this->_db->select()
					->from('cad_contrato')
					->order('contrato_desc ASC');
		return $this->_db->fetchAll($sql);
	}
	public function contarContrato($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_contrato',array('COUNT(*)'));					
					
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
