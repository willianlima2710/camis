<?php
class Model_DbTable_Entrest extends Zend_Db_Table {
	protected $_name 	= 'mov_entrest';
	protected $_primary = 'entrest_id';

	public function listarEntrest($start,$limit,$sort,$dir,$field,$value)
	{		
		$sql = $this->_db->select()
					->from(array('a'=>'mov_entrest'))
                    ->joinLeft(array('b'=>'cad_empresa'),'a.empresa_id=b.empresa_id',
					           array('b.empresa_desc'))
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
	public function buscarEntrest($field,$value)
	{
		$sql = $this->_db->select()
					->from(array('a'=>'mov_entrest'))
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
	public function contarEntrest($field,$value)
	{
		$sql = $this->_db->select()
					->from('mov_entrest',array('COUNT(*)'));					
					
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
