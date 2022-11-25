<?php
class Model_DbTable_Conta extends Zend_Db_Table {
	protected $_name 	= 'cad_conta';
	protected $_primary = 'conta_id';
	
	public function listarConta($start,$limit,$sort,$dir,$field,$value)
	{		
		$sql = $this->_db->select()
					->from('cad_conta')
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
	public function buscarConta($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_conta');
		
		if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
		}							
		return $this->_db->fetchAll($sql);		
	}
    public function todoConta()
	{
		$sql = $this->_db->select()
					->from('cad_conta')
					->order('conta_desc ASC');
		return $this->_db->fetchAll($sql);
	}
	public function contarConta($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_conta',array('COUNT(*)'));					
					
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
