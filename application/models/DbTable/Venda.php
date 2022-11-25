<?php
class Model_DbTable_Venda extends Zend_Db_Table {
	protected $_name 	= 'mov_venda';
	protected $_primary = 'venda_id';
	
	public function listarVenda($start,$limit,$sort,$dir,$field,$value)
	{		
		$sql = $this->_db->select()
					->from(array('a'=>'mov_venda'))
					->joinLeft(array('b'=>'cad_operacao'),'a.operacao_id=b.operacao_id',
					           array('b.operacao_desc'))		
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
	public function buscarVenda($field,$value)
	{
		$sql = $this->_db->select()
					->from(array('a'=>'mov_venda'))
					->joinLeft(array('b'=>'cad_operacao'),'a.operacao_id=b.operacao_id',
					           array('b.operacao_desc'));		
					
		
		if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
		}							
		return $this->_db->fetchAll($sql);		
	}
    public function todoVenda()
	{
		$sql = $this->_db->select()
					->from('mov_venda')
					->order('data_ultima_alteracao DESC');
		return $this->_db->fetchAll($sql);
	}
	public function contarVenda($field,$value)
	{
		$sql = $this->_db->select()
					->from('mov_venda',array('COUNT(*)'));					
					
        if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
   	    }					
		return $this->_db->fetchOne($sql);			
	}
    public function analiticoVenda($field)
	{		
		$this->_db->getConnection()->setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY,true);
        		                           
		$proc = "call proc_rel_venda_analitico('{$field['data_inicial']}','{$field['data_final']}','{$field['locatario_id']}','{$field['jazigo_codigo']}','{$field['inordem']}')";
		$stmt = $this->_db->prepare($proc);
		$stmt->execute();
		$stmt->setFetchMode(Zend_Db::FETCH_ASSOC);						     		
		return $stmt->fetchAll();
	}
	public function buscar2Venda($field)
	{
		$sql = $this->_db->select()
					->from('mov_venda')
					->where("venda_documento={$field['venda_documento']}")
					->where("jazigo_codigo='{$field['jazigo_codigo']}'");		
		return $this->_db->fetchAll($sql);
	}
	
}
?>
