<?php
class Model_DbTable_Exumacao extends Zend_Db_Table {
	protected $_name 	= 'mov_exumacao';
	protected $_primary = 'exumacao_id';

	public function listarExumacao($start,$limit,$sort,$dir,$field,$value)
	{		
		$sql = $this->_db->select()
					->from(array('a'=>'mov_exumacao'))
					->joinLeft(array('b'=>'cad_destino'),'a.destino_id=b.destino_id',
					           array('b.destino_desc'))					
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
	public function buscarExumacao($field,$value)
	{
		$sql = $this->_db->select()
					->from(array('a'=>'mov_exumacao'))
					->joinLeft(array('b'=>'cad_destino'),'a.destino_id=b.destino_id',
					           array('b.destino_desc'));
		if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
		}							
		return $this->_db->fetchAll($sql);		
	}
	public function contarExumacao($field,$value)
	{
		$sql = $this->_db->select()
					->from('mov_exumacao',array('COUNT(*)'));					
					
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
