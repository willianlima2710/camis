<?php
class Model_DbTable_Usuario extends Zend_Db_Table {	
	protected $_name 	= 'cad_usuario';
	protected $_primary = 'usuario_id';

	 public function todoUsuario()
	{
		$sql = $this->_db->select()
					->from('cad_usuario')
					->order('usuario_nome ASC');
		return $this->_db->fetchAll($sql);
	}
}
?>
