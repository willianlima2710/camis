<?php
class Model_DbTable_Cliente extends Zend_Db_Table {
	protected $_name 	= 'cad_cliente';
	protected $_primary = 'cliente_id';

	public function buscarCliente($field,$value)
	{
		$sql = $this->_db->select()
					->from('cad_cliente');
		
		if(!empty($value)) {
			if(is_int($value)) {
				$sql->where("$field=$value");								
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
		}							
		return $this->_db->fetchAll($sql);		
	}
}
?>
