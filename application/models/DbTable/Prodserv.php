<?php
class Model_DbTable_Prodserv extends Zend_Db_Table {
	protected $_name 	= 'cad_prodserv';
	protected $_primary = 'prodserv_id';

	public function listarProdserv($start,$limit,$sort,$dir,$field,$value)
	{		
		$sql = $this->_db->select()
					->from('cad_prodserv')
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
	public function buscarProdserv($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_prodserv');
		
		if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
		}							
		return $this->_db->fetchAll($sql);		
	}
	public function contarProdserv($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_prodserv',array('COUNT(*)'));					
					
        if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
   	    }					
		return $this->_db->fetchOne($sql);			
	}
	public function autocompleteProdserv($value)
	{
		$sql = $this->_db->select()
					->from('cad_prodserv')
				    ->where("prodserv_desc LIKE '%".strtoupper($value)."%'");								
		return $this->_db->fetchAll($sql);	
	}	
    public function todoProdserv($invenda)
    {
        $sql = $this->_db->select()
                    ->from('cad_prodserv')
   					->where("prodserv_invenda=".$invenda)
                    ->order('prodserv_desc ASC');
        return $this->_db->fetchAll($sql);
	}
	public function posestoqProdserv()
    {
        $sql = $this->_db->select()
                    ->from('cad_prodserv')
   					->where("prodserv_inclassificacao='1'")
                    ->order('prodserv_desc ASC');
        return $this->_db->fetchAll($sql);
    }
}
?>
