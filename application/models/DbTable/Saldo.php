<?php
class Model_DbTable_Saldo extends Zend_Db_Table {
	protected $_name 	= 'mov_saldo';
	protected $_primary = 'saldo_id';

	public function listarSaldo($start,$limit,$sort,$dir,$field,$value)
	{		
		$sql = $this->_db->select()
					->from('mov_saldo')
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
	public function buscarSaldo($conta,$data,$empresa)
	{
		$sql = $this->_db->select()
					->from('mov_saldo')
					->where("conta_id=$conta")					
					->where("saldo_data='{$data}'")
					->where("empresa_id=$empresa");					
					
		return $this->_db->fetchAll($sql);		
	}
	public function contarSaldo($field,$value)
	{
		$sql = $this->_db->select()
					->from('mov_saldo',array('COUNT(*)'));					
					
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
