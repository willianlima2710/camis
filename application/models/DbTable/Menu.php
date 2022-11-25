<?php
class Model_DbTable_Menu extends Zend_Db_Table {
	protected $_name 	= 'cad_menu';
	protected $_primary = 'menu_id';

	public function listarMenu()
	{		
		$sql = $this->_db->select()
					->from('cad_menu')
					->order('menu_ordem asc');			
		return $this->_db->fetchAll($sql);		
	}	
}
?>
