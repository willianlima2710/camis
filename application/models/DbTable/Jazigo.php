<?php
class Model_DbTable_Jazigo extends Zend_Db_Table {
	protected $_name 	= 'cad_jazigo';
	protected $_primary = 'jazigo_id';

	public function listarJazigo($start,$limit,$sort,$dir,$field,$value)
	{		
		$sql = $this->_db->select()
					->from(array('a'=>'cad_jazigo'))
					->joinLeft(array('b'=>'cad_cemiterio'),'a.cemiterio_id=b.cemiterio_id',
					           array('b.cemiterio_desc'))					           					
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
	public function buscarJazigo($field,$value)
	{
		$sql = $this->_db->select()
					->from(array('a'=>'cad_jazigo'))
					->joinLeft(array('b'=>'cad_cemiterio'),'a.cemiterio_id=b.cemiterio_id',
					           array('b.cemiterio_desc'))
					->joinLeft(array('c'=>'cad_lote'),'a.lote_codigo=c.lote_codigo',
					           array('c.lote_desc'))
					->joinLeft(array('d'=>'cad_quadra'),'a.quadra_codigo=d.quadra_codigo',
					           array('d.quadra_desc'))
					->joinLeft(array('f'=>'cad_alameda'),'a.alameda_codigo=f.alameda_codigo',
					           array('f.alameda_desc'))
					->joinLeft(array('g'=>'cad_tpterreno'),'a.tpterreno_id=g.tpterreno_id',
					           array('g.tpterreno_desc'))
					->joinLeft(array('h'=>'cad_tpjazigo'),'a.tpjazigo_id=h.tpjazigo_id',
					           array('h.tpjazigo_desc'));           
		
		if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
		}							
		return $this->_db->fetchAll($sql);		
	}
	public function contarJazigo($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_jazigo',array('COUNT(*)'));					
					
        if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
   	    }					
		return $this->_db->fetchOne($sql);			
	}
    public function autocompleteJazigo($value,$disponivel)
	{
		$sql = $this->_db->select()
					->from('cad_jazigo')
				    ->where("jazigo_codigo LIKE '%".strtoupper($value)."%'");
				    
		if($disponivel){
			$sql->where("jazigo_disponivel=1");
		}
						    								
		return $this->_db->fetchAll($sql);	
	}
	public function analiticoJazigo($field)
	{		
		$this->_db->getConnection()->setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY,true);
	                           
		$proc = "call proc_rel_jazigo_analitico('{$field['cemiterio_id']}',
		                                        '{$field['lote_codigo']}',
		                                        '{$field['quadra_codigo']}',
		                                        '{$field['alameda_codigo']}',
		                                        '{$field['tpterreno_id']}',
		                                        '{$field['tpjazigo_id']}',
		                                        '{$field['inordem']}')";
		$stmt = $this->_db->prepare($proc);
		$stmt->execute();
		$stmt->setFetchMode(Zend_Db::FETCH_ASSOC);						     		
		return $stmt->fetchAll();
	}
	
}
?>
