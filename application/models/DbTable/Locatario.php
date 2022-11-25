<?php
class Model_DbTable_Locatario extends Zend_Db_Table {
	protected $_name 	= 'cad_locatario';
	protected $_primary = 'locatario_id';

    public function listarLocatario($start,$limit,$sort,$dir,$field,$value)
	{		
		$sql = $this->_db->select()
					->from('cad_locatario')
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
	public function buscarLocatario($field,$value)
	{
		$sql = $this->_db->select()
					->from(array('a'=>'cad_locatario'))
					->joinLeft(array('b'=>'cad_cbo'),'a.cbo_id=b.cbo_id',
					           array('b.cbo_desc'))
					->joinLeft(array('c'=>'cad_estcivil'),'a.estcivil_id=c.estcivil_id',
					           array('c.estcivil_desc'))
					->joinLeft(array('d'=>'cad_grauinstr'),'a.grauinstr_id=d.grauinstr_id',
					           array('d.grauinstr_desc'))
					->joinLeft(array('e'=>'cad_religiao'),'a.religiao_id=e.religiao_id',
					           array('e.religiao_desc'))
					->joinLeft(array('f'=>'cad_estado'),'a.estado_sigla=f.estado_sigla',
					           array('f.estado_desc'))
					->joinLeft(array('g'=>'cad_pais'),'a.pais_sigla=g.pais_sigla',
					           array('g.pais_desc'));					           
					           					       
		if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
		}							
		return $this->_db->fetchAll($sql);		
	}
	public function contarLocatario($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_locatario',array('COUNT(*)'));					
					
        if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
   	    }					
		return $this->_db->fetchOne($sql);			
	}
	public function autocompleteLocatario($value)
	{
		$sql = $this->_db->select()
					->from('cad_locatario')
				    ->where("locatario_desc LIKE '%".strtoupper($value)."%'");								
		return $this->_db->fetchAll($sql);	
	}
    public function listarAdicional($value)
	{		
		$sql = $this->_db->select()
					->from('cad_locatario_adc')
					->where("locatario_id=$value");							
		return $this->_db->fetchAll($sql);		
	}		
}
?>
