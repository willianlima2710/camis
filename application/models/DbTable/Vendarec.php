<?php
class Model_DbTable_Vendarec extends Zend_Db_Table {
	protected $_name 	= 'mov_venda_rec';
	protected $_primary = 'venda_rec_id';
	
	public function listarVendarec($start,$limit,$sort,$dir,$field,$value)
	{		
		$sql = $this->_db->select()
					->from(array('a'=>'mov_venda_rec'))
                    ->joinLeft(array('b'=>'cad_formarec'),'a.formarec_id=b.formarec_id',
					           array('b.formarec_desc'))					
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
	public function buscarVendarec($field,$value)
	{
		$sql = $this->_db->select()
					->from(array('a'=>'mov_venda_rec'))
					->joinLeft(array('b'=>'cad_formarec'),'a.formarec_id=b.formarec_id',
					           array('b.formarec_desc'));
					           		
		if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
		}							
		return $this->_db->fetchAll($sql);		
	}
    public function todoVendarec()
	{
		$sql = $this->_db->select()
					->from('mov_venda_rec')
					->order('data_ultima_alteracao DESC');
		return $this->_db->fetchAll($sql);
	}
	public function contarVendarec($field,$value)
	{
		$sql = $this->_db->select()
					->from('mov_venda_rec',array('COUNT(*)'));					
					
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
