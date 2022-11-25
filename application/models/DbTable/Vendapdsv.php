<?php
class Model_DbTable_Vendapdsv extends Zend_Db_Table {
	protected $_name 	= 'mov_venda_pdsv';
	protected $_primary = 'venda_pdsv_id';

	public function listarVendapdsv($start,$limit,$sort,$dir,$field,$value)
	{		
		$sql = $this->_db->select()
					->from(array('a'=>'mov_venda_pdsv'))
					->joinLeft(array('b'=>'cad_locatario'),'a.locatario_id=b.locatario_id',
					           array('b.locatario_desc'))
					->joinLeft(array('c'=>'cad_prodserv'),'a.prodserv_id=c.prodserv_id',
					           array('c.prodserv_desc'))					           
					->order($sort.' '.$dir)				
					->limit($limit,$start);															
		
		if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("a.$field=$value");								
			}else{
				$sql->where("a.$field LIKE '%".strtoupper($value)."%'");								
			} 	
   	    }		
		return $this->_db->fetchAll($sql);		
	}
	public function buscarVendapdsv($field,$value)
	{
		$sql = $this->_db->select()
					->from(array('a'=>'mov_venda_pdsv'))
					->joinLeft(array('c'=>'cad_prodserv'),'a.prodserv_id=c.prodserv_id',
					           array('c.prodserv_desc'));
		if(!empty($value)) {
			if($field=='venda_id') {
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
		}							
		return $this->_db->fetchAll($sql);		
	}
    public function todoVendapdsv()
	{
		$sql = $this->_db->select()
					->from('mov_venda_pdsv')
					->order('data_ultima_alteracao DESC');
		return $this->_db->fetchAll($sql);
	}
	public function contarVendapdsv($field,$value)
	{
		$sql = $this->_db->select()
					->from('mov_venda_pdsv',array('COUNT(*)'));					
					
        if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
   	    }					
		return $this->_db->fetchOne($sql);			
	}
	public function buscar2Vendapdsv($field)
	{
		$sql = $this->_db->select()
						->from(array('a'=>'mov_venda_pdsv'))
						->joinLeft(array('c'=>'cad_prodserv'),'a.prodserv_id=c.prodserv_id',
								   array('c.prodserv_desc'))						
						->where("a.venda_id={$field['venda_id']}")
						->where("a.venda_pdsv_total={$field['venda_pdsv_total']}");
						
		return $this->_db->fetchAll($sql);
	}
	
}
?>
