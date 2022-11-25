<?php
class Model_DbTable_Obito extends Zend_Db_Table {
	protected $_name 	= 'cad_obito';
	protected $_primary = 'obito_id';

	public function listarObito($start,$limit,$sort,$dir,$field,$value)
	{		
		$sql = $this->_db->select()
					->from(array('a'=>'cad_obito'))
					->joinLeft(array('b'=>'cad_morte'),'a.morte_id=b.morte_id',
					           array('b.morte_desc'))					
					->order($sort.' '.$dir)				
					->limit($limit,$start);															
		
		if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");	
			}elseif($field=='obito_id') {
				$sql->where("$field=$value");				
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
   	    }		
		return $this->_db->fetchAll($sql);		
	}
	public function buscarObito($field,$value)
	{
		$sql = $this->_db->select()
					->from(array('a'=>'cad_obito'))
					->joinLeft(array('b'=>'cad_cbo'),'a.cbo_id_falecido=b.cbo_id',
					           array('cbo_desc_falecido'=>'b.cbo_desc'))
					->joinLeft(array('c'=>'cad_corcurtis'),'a.corcurtis_id=c.corcurtis_id',
					           array('c.corcurtis_desc'))
					->joinLeft(array('d'=>'cad_local'),'a.local_id=d.local_id',
					           array('d.local_desc'))
					->joinLeft(array('e'=>'cad_estcivil'),'a.estcivil_id_declarante=e.estcivil_id',
					           array('estcivil_desc_declarante'=>'e.estcivil_desc'))
					->joinLeft(array('f'=>'cad_cbo'),'a.cbo_id_declarante=f.cbo_id',
					           array('cbo_desc_declarante'=>'f.cbo_desc'))
					->joinLeft(array('g'=>'cad_cartorio'),'a.cartorio_id=g.cartorio_id',
					           array('g.cartorio_desc'))
					->joinLeft(array('h'=>'cad_funeraria'),'a.funeraria_id=h.funeraria_id',
					           array('h.funeraria_desc'))
					->joinLeft(array('i'=>'cad_estado'),'a.estado_sigla_declarante=i.estado_sigla',
					           array('i.estado_desc'))
					->joinLeft(array('j'=>'cad_morte'),'a.morte_id=j.morte_id',
					           array('j.morte_desc'));         
					               
		if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");
			}elseif($field=='obito_id') {	
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
		}
		return $this->_db->fetchAll($sql);	
	}
	public function contarObito($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_obito',array('COUNT(*)'));					
					
        if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");
			}elseif($field=='obito_id') {	
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
   	    }					
		return $this->_db->fetchOne($sql);			
	}
	public function analiticoObito($field)
	{
		//-- verifica qual o campo data deve pegar
		switch ($field['rb-data']) {
			case 0: $data = 'obito_data_cadastro'; break;
			case 1: $data = 'obito_data_falecimento'; break;
			case 2: $data = 'obito_data_sepultamento'; break; 			
		}
		
		$this->_db->getConnection()->setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY,true);
		                           
		$proc = "call proc_rel_obito_analitico('{$data}','{$field['data_inicial']}','{$field['data_final']}','{$field['locatario_id']}','{$field['inordem']}')";
		$stmt = $this->_db->prepare($proc);
		$stmt->execute();
		$stmt->setFetchMode(Zend_Db::FETCH_ASSOC);						     		
		return $stmt->fetchAll();		
	}
    public function todoObito($value)
    {
        $sql = $this->_db->select()
            ->from('cad_obito')
            ->where('jazigo_codigo=?',$value);

        return $this->_db->fetchAll($sql);
    }
}
?>
