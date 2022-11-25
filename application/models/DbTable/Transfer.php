<?php
class Model_DbTable_Transfer extends Zend_Db_Table {
	protected $_name 	= 'mov_transfer';
	protected $_primary = 'transfer_id';

	public function listarTransfer($start,$limit,$sort,$dir,$field,$value)
	{		
		$sql = $this->_db->select()
					->from('mov_transfer')
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
	public function buscarTransfer($field,$value)
	{
		$sql = $this->_db->select()
					->from('mov_transfer');
		
		if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
		}							
		return $this->_db->fetchAll($sql);		
	}
    public function todoTransfer()
	{
		$sql = $this->_db->select()
					->from('mov_transfer')
					->order('transfer_desc ASC');
		return $this->_db->fetchAll($sql);
	}
	public function contarTransfer($field,$value)
	{
		$sql = $this->_db->select()
					->from('mov_transfer',array('COUNT(*)'));					
					
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
