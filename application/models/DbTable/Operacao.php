<?php
class Model_DbTable_Operacao extends Zend_Db_Table {
	protected $_name 	= 'cad_operacao';
	protected $_primary = 'operacao_id';

	public function listarOperacao($start,$limit,$sort,$dir,$field,$value)
	{		
		$sql = $this->_db->select()
					->from(array('a'=>'cad_operacao'))
					->joinLeft(array('b'=>'cad_banco'),'a.banco_id=b.banco_id',
							   array('b.banco_desc'))
					->joinLeft(array('c'=>'cad_conta'),'a.conta_id=c.conta_id',
							   array('c.conta_desc'))										
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
	public function buscarOperacao($field,$value)
	{
		$sql = $this->_db->select()
					->from(array('a'=>'cad_operacao'))
					->joinLeft(array('b'=>'cad_banco'),'a.banco_id=b.banco_id',
							   array('b.banco_desc'))
					->joinLeft(array('c'=>'cad_conta'),'a.conta_id=c.conta_id',
							   array('c.conta_desc'));				
		if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
		}							
		return $this->_db->fetchAll($sql);		
	}
	public function todoOperacao()
	{
		$sql = $this->_db->select()
					->from('cad_operacao')
					->order('operacao_desc ASC');
		return $this->_db->fetchAll($sql);
	}	
	public function contarOperacao($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_operacao',array('COUNT(*)'));					
					
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
