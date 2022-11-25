<?php
class Model_DbTable_Destino extends Zend_Db_Table {
	protected $_name 	= 'cad_destino';
	protected $_primary = 'destino_id';

	public function listarDestino($start,$limit,$sort,$dir,$field,$value)
	{		
		$sql = $this->_db->select()
					->from('cad_destino')
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
	public function buscarDestino($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_destino');
		
		if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
		}							
		return $this->_db->fetchAll($sql);		
	}
    public function todoDestino()
	{
		$sql = $this->_db->select()
					->from('cad_destino')
					->order('destino_desc ASC');
		return $this->_db->fetchAll($sql);
	}
	public function contarDestino($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_destino',array('COUNT(*)'));					
					
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
