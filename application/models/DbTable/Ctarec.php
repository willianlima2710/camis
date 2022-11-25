<?php
class Model_DbTable_Ctarec extends Zend_Db_Table {
	protected $_name 	= 'mov_ctarec';
	protected $_primary = 'ctarec_id';
	
	public function listarCtarec($start,$limit,$sort,$dir,$field,$value)
	{		
		$sql = $this->_db->select()
					->from(array('a'=>'mov_ctarec'))
					->joinLeft(array('b'=>'cad_operacao'),'a.operacao_id=b.operacao_id',
					           array('b.operacao_desc'))	
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
	public function buscarCtarec($field,$value)
	{
		$sql = $this->_db->select()
					->from(array('a'=>'mov_ctarec'))
					->joinLeft(array('b'=>'cad_operacao'),'a.operacao_id=b.operacao_id',
					           array('b.operacao_desc'));					           	
		if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
		}							
		return $this->_db->fetchAll($sql);		
	}
    public function todoCtarec()
	{
		$sql = $this->_db->select()
					->from('mov_ctarec')
					->order('data_ultima_alteracao DESC');
		return $this->_db->fetchAll($sql);
	}
	public function contarCtarec($field,$value)
	{
		$sql = $this->_db->select()
					->from('mov_ctarec',array('COUNT(*)'));					
					
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
