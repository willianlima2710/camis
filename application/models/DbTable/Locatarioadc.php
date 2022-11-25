<?php
class Model_DbTable_Locatarioadc extends Zend_Db_Table {
	protected $_name 	= 'cad_locatario_adc';
	protected $_primary = 'locatario_adc_id';
	
	public function listarLocatarioadc($value)
	{				
		$sql = $this->_db->select()
					->from('cad_locatario_adc')
					->where("locatario_id=$value");
												
		return $this->_db->fetchAll($sql);		
	}
	public function buscarLocatarioadc($locatario_id,$locatario_adc_id)
	{
		$sql = $this->_db->select()
					->from('cad_locatario_adc')					           					       
  				    ->where("locatario_id=$locatario_id")
  				    ->where("locatario_adc_id=$locatario_adc_id");
  				    								
		return $this->_db->fetchAll($sql);		
	}	
	public function contarLocatarioadc($value)
	{
		$sql = $this->_db->select()
					->from('cad_locatario_adc',array('COUNT(*)'))
					->where("locatario_id=$value");			
							
		return $this->_db->fetchOne($sql);			
	}
	public function autocompleteLocatarioadc($value)
	{
		$sql = $this->_db->select()
					->from('cad_locatario_adc')
				    ->where("locatario_desc_adc LIKE '%".strtoupper($value)."%'");								
		return $this->_db->fetchAll($sql);	
	}
	
}
?>
