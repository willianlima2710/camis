<?php
class Model_DbTable_Fornecedor extends Zend_Db_Table {
	protected $_name 	= 'cad_fornecedor';
	protected $_primary = 'fornecedor_id';
	
	public function listarFornecedor($start,$limit,$sort,$dir,$field,$value)
	{		
		$sql = $this->_db->select()
					->from('cad_fornecedor')
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
	public function buscarFornecedor($field,$value)
	{
		$sql = $this->_db->select()
					->from(array('a'=>'cad_fornecedor'))
					->joinLeft(array('b'=>'cad_estado'),'a.estado_sigla=b.estado_sigla',
					           array('b.estado_desc'))
					->joinLeft(array('c'=>'cad_pais'),'a.pais_sigla=c.pais_sigla',
					           array('c.pais_desc'));
					           
		if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
		}							
		return $this->_db->fetchAll($sql);		
	}
	public function todoFornecedor()
	{
		$sql = $this->_db->select()
					->from('cad_fornecedor')
					->order('fornecedor_desc ASC');
		return $this->_db->fetchAll($sql);
	}
	public function contarFornecedor($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_fornecedor',array('COUNT(*)'));					
					
        if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
   	    }					
		return $this->_db->fetchOne($sql);			
	}
	public function autocompleteFornecedor($value)
	{
		$sql = $this->_db->select()
					->from('cad_fornecedor')
				    ->where("fornecedor_desc LIKE '%".strtoupper($value)."%'");								
		return $this->_db->fetchAll($sql);	
	}	
}
?>
