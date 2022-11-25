<?php
class Model_DbTable_Empresa extends Zend_Db_Table {
	protected $_name 	= 'cad_empresa';
	protected $_primary = 'empresa_id';

	public function listarEmpresa($start,$limit,$sort,$dir,$field,$value)
	{		
		$sql = $this->_db->select()
					->from('cad_empresa')
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
	public function buscarEmpresa($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_empresa');
		
		if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
		}							
		return $this->_db->fetchAll($sql);		
	}
    public function todoEmpresa()
	{
		$sql = $this->_db->select()
					->from('cad_empresa')
					->order('empresa_desc ASC');
		return $this->_db->fetchAll($sql);
	}
	public function contarEmpresa($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_empresa',array('COUNT(*)'));					
					
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
