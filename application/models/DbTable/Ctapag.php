<?php
class Model_DbTable_Ctapag extends Zend_Db_Table {
	protected $_name 	= 'mov_ctapag';
	protected $_primary = 'ctapag_id';

	public function listarCtapag($start,$limit,$sort,$dir,$field,$value)
	{		
		$sql = $this->_db->select()
					->from(array('a'=>'mov_ctapag'))
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
	public function buscarCtapag($field,$value)
	{
		$sql = $this->_db->select()
					->from(array('a'=>'mov_ctapag'))
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
    public function todoCtapag()
	{
		$sql = $this->_db->select()
					->from('mov_ctapag')
					->order('data_ultima_alteracao DESC');
		return $this->_db->fetchAll($sql);
	}
	public function contarCtapag($field,$value)
	{
		$sql = $this->_db->select()
					->from('mov_ctapag',array('COUNT(*)'));					
					
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
