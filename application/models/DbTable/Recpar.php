<?php
class Model_DbTable_Recpar extends Zend_Db_Table {
	protected $_name 	= 'mov_recpar';
	protected $_primary = 'recpar_id';
	
	public function listarRecpar($start,$limit,$sort,$dir,$field,$value)
	{		
		$sql = $this->_db->select()
					->from(array('a'=>'mov_recpar'))
					->joinLeft(array('b'=>'cad_operacao'),'a.operacao_id=b.operacao_id',
					           array('b.operacao_desc'))
					->joinLeft(array('c'=>'cad_formarec'),'a.formarec_id=c.formarec_id',
					           array('c.formarec_desc'))
		            ->joinLeft(array('d'=>'cad_banco'),'a.banco_id=d.banco_id',
					      	   array('d.banco_desc'))
	           		->joinLeft(array('e'=>'cad_conta'),'a.conta_id=e.conta_id',
							   array('e.conta_desc'))					           
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
	public function buscarRecpar($field,$value)
	{
		$sql = $this->_db->select()
					->from(array('a'=>'mov_recpar'))
					->joinLeft(array('b'=>'cad_operacao'),'a.operacao_id=b.operacao_id',
					           array('b.operacao_desc'))
					->joinLeft(array('c'=>'cad_formarec'),'a.formarec_id=c.formarec_id',
					           array('c.formarec_desc'))
					->joinLeft(array('d'=>'cad_locpagto'),'a.locpagto_id=d.locpagto_id',
					           array('d.locpagto_desc'))
					->joinLeft(array('e'=>'cad_banco'),'a.banco_id=e.banco_id',
					   		   array('e.banco_desc'))
					->joinLeft(array('f'=>'cad_conta'),'a.conta_id=f.conta_id',
							   array('f.conta_desc'));
							  										
		if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
		}							
		return $this->_db->fetchAll($sql);		
	}
	public function busca2Recpar($field)
	{
		$sql = $this->_db->select()
					->from('mov_recpar')
					->where('locatario_id = ?',$field['locatario_id'])
					->where('jazigo_codigo = ?',$field['jazigo_codigo'])
					->where('operacao_id = ?',$field['operacao_id'])
					->where('recpar_ano = ?',$field['recpar_ano']);

		return $this->_db->fetchAll($sql);		
	}	
    public function todoRecpar()
	{
		$sql = $this->_db->select()
					->from('mov_recpar')
					->order('data_ultima_alteracao DESC');
		return $this->_db->fetchAll($sql);
	}
	public function contarRecpar($field,$value)
	{
		$sql = $this->_db->select()
					->from('mov_recpar',array('COUNT(*)'));					
					
        if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
   	    }					
		return $this->_db->fetchOne($sql);			
	}
	public function analiticoRecpar($field)
	{
		//-- verifica qual o campo data deve pegar
		switch ($field['rb-data']) {
			case 0: $data = 'recpar_data_emissao'; break;
			case 1: $data = 'recpar_data_vencto'; break;
			case 2: $data = 'recpar_data_pagto'; break; 			
		}
		
		$this->_db->getConnection()->setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY,true);
		
		$proc = "call proc_rel_recpar_analitico('{$data}',
		                                        '{$field['data_inicial']}',
		                                        '{$field['data_final']}',
		                                        '{$field['rb-status']}',
		                                        '{$field['locatario_id']}',
		                                        '{$field['usuario_login']}',
		                                        '{$field['formarec_id']}',
		                                        '{$field['inordem']}')";
		$stmt = $this->_db->prepare($proc);
		$stmt->execute();
		$stmt->setFetchMode(Zend_Db::FETCH_ASSOC);						     		
		return $stmt->fetchAll();
	}
}
?>
