<?php
class Model_DbTable_Pagpar extends Zend_Db_Table {
	protected $_name 	= 'mov_pagpar';
	protected $_primary = 'pagpar_id';
	
	public function listarPagpar($start,$limit,$sort,$dir,$field,$value)
	{		
		$sql = $this->_db->select()
					->from(array('a'=>'mov_pagpar'))
					->joinLeft(array('b'=>'cad_operacao'),'a.operacao_id=b.operacao_id',
					           array('b.operacao_desc'))
					->joinLeft(array('c'=>'cad_formarec'),'a.formarec_id=c.formarec_id',
					           array('c.formarec_desc'))					           
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
	public function buscarPagpar($field,$value)
	{
		$sql = $this->_db->select()
					->from(array('a'=>'mov_pagpar'))
					->joinLeft(array('b'=>'cad_operacao'),'a.operacao_id=b.operacao_id',
					           array('b.operacao_desc'))
					->joinLeft(array('c'=>'cad_formarec'),'a.formarec_id=c.formarec_id',
					           array('c.formarec_desc'))
					->joinLeft(array('d'=>'cad_locpagto'),'a.locpagto_id=d.locpagto_id',
					           array('d.locpagto_desc'))
					->joinLeft(array('h'=>'cad_banco'),'h.banco_id=a.banco_id',
					      	   array('h.banco_desc'))
					->joinLeft(array('i'=>'cad_conta'),'i.conta_id=a.conta_id',
							   array('i.conta_desc'));
					           
		if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
		}							
		return $this->_db->fetchAll($sql);		
	}
    public function todoPagpar()
	{
		$sql = $this->_db->select()
					->from('mov_pagpar')
					->order('data_ultima_alteracao DESC');
		return $this->_db->fetchAll($sql);
	}
	public function contarPagpar($field,$value)
	{
		$sql = $this->_db->select()
					->from('mov_pagpar',array('COUNT(*)'));					
					
        if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
   	    }					
		return $this->_db->fetchOne($sql);			
	}
	public function analiticoPagpar($field)
	{
		//-- verifica qual o campo data deve pegar
		switch ($field['rb-data']) {
			case 0: $data = 'pagpar_data_emissao'; break;
			case 1: $data = 'pagpar_data_vencto'; break;
			case 2: $data = 'pagpar_data_pagto'; break; 			
		}
				
		$this->_db->getConnection()->setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY,true);
        		                           
		$proc = "call proc_rel_pagpar_analitico('{$data}',
		                                        '{$field['data_inicial']}',
		                                        '{$field['data_final']}',
		                                        '{$field['rb-status']}',
		                                        '{$field['fornecedor_id']}',
		                                        '{$field['usuario_login']}',
		                                        '{$field['inordem']}')";
		$stmt = $this->_db->prepare($proc);
		$stmt->execute();
		$stmt->setFetchMode(Zend_Db::FETCH_ASSOC);						     		
		return $stmt->fetchAll();
	}
	
}
?>
