<?php
class Model_DbTable_Caixa extends Zend_Db_Table {
	protected $_name 	= 'mov_caixa';
	protected $_primary = 'caixa_id';
	
	public function listarCaixa($banco_id,$caixa_data_movto_ini,$caixa_data_movto_fim,$dataold)
	{		
		$sql = $this->_db->select()
					->from(array('a'=>'mov_caixa'),
					       array('a.caixa_id',
					       		 'a.banco_id',
					       		 'a.jazigo_codigo',
					             'a.empresa_id',
					       		 'a.locfor_id',
					       		 'a.conta_id',
					       		 'a.caixa_historico',
					       		 'a.caixa_obs',
					             'a.caixa_documento',
					             'a.caixa_data_movto',
					       		 'a.caixa_valor',
					       		 'a.caixa_intipo',
					       		 'a.caixa_mesano',
					       		 'a.locfor_desc',
					             'a.usuario_login',
					             'a.data_ultima_alteracao',
					       		 'valor_credito'=>new Zend_Db_Expr("if(a.caixa_intipo='0',a.caixa_valor,0)"),
					       		 'valor_debito'=>new Zend_Db_Expr("if(a.caixa_intipo='1',a.caixa_valor,0)")
					            )
					       )					
					->joinLeft(array('b'=>'cad_banco'),'a.banco_id=b.banco_id',
					           array('b.banco_desc'))
					->joinLeft(array('c'=>'cad_conta'),'a.conta_id=c.conta_id',
					           array('c.conta_desc'))
					->joinLeft(array('d'=>'mov_saldo'),"a.banco_id=d.banco_id and d.saldo_mesano='$dataold'",
					    	   array('d.saldo_valor'))					           
					->where("a.caixa_data_movto >= ?",$caixa_data_movto_ini)
                    ->where("a.caixa_data_movto <= ?",$caixa_data_movto_fim)												           
					->order('a.caixa_data_movto');

		if($banco_id!=0) {
			$sql->where("a.banco_id=$banco_id");				
		}			
		
		return $this->_db->fetchAll($sql);		
	}
	
	public function buscarCaixa($field,$value)
	{
		$sql = $this->_db->select()
						->from(array('a'=>'mov_caixa'))
						->joinLeft(array('b'=>'cad_banco'),'a.banco_id=b.banco_id',
								   array('b.banco_desc'))
						->joinLeft(array('c'=>'cad_conta'),'a.conta_id=c.conta_id',
								   array('c.conta_desc'))
						->where("$field=$value");
	
				return $this->_db->fetchAll($sql);
	}
	
	public function listarCaixa1($banco_id,$caixa_data_movto_ini,$caixa_data_movto_fim,$dataold)
	{		
		$sql = $this->_db->select()
					->from(array('a'=>'mov_caixa'),
						   array('a.caixa_data_movto',								 
								 "(select sum(c.caixa_valor) from mov_caixa c where c.caixa_id=a.caixa_id and c.conta_id=a.conta_id and c.banco_id=a.banco_id and c.caixa_intipo='0') as valor_credito",
						   		 "(select sum(d.caixa_valor) from mov_caixa d where d.caixa_id=a.caixa_id and d.conta_id=a.conta_id and d.banco_id=a.banco_id and d.caixa_intipo='1') as valor_debito",						   		 
							     )
					       )
					->joinLeft(array('b'=>'cad_banco'),'a.banco_id=b.banco_id',
 							   array('b.banco_desc'))
					->joinLeft(array('c'=>'cad_conta'),'a.conta_id=c.conta_id',
							   array('c.conta_desc'))
					->joinLeft(array('d'=>'mov_saldo'),"a.banco_id=d.banco_id and d.saldo_mesano='$dataold'",
							   array('d.saldo_valor'))
					->where("a.caixa_data_movto >= ?",$caixa_data_movto_ini)
                    ->where("a.caixa_data_movto <= ?",$caixa_data_movto_fim)												           
  					->group('a.conta_id','a.caixa_data_movto')
					->order('a.caixa_data_movto');
		
		if($banco_id!=0) {
			$sql->where("a.banco_id=$banco_id");
		}			
		return $this->_db->fetchAll($sql);		
	}

	public function listarCaixa2($start,$limit,$sort,$dir,$field,$value)
	{
		$sql = $this->_db->select()
					->from(array('a'=>'mov_caixa'),
					       array('a.caixa_id',
					       		 'a.banco_id',
					       		 'a.jazigo_codigo',
					             'a.empresa_id',
					       		 'a.locfor_id',
					       		 'a.conta_id',
					       		 'a.caixa_historico',
					       		 'a.caixa_obs',
					             'a.caixa_documento',
					             'a.caixa_data_movto',
					       		 'a.caixa_valor',
					       		 'a.caixa_intipo',
					       		 'a.caixa_mesano',
					       		 'a.locfor_desc',
					             'a.usuario_login',
					             'a.data_ultima_alteracao',
					       		 'valor_credito'=>new Zend_Db_Expr("if(a.caixa_intipo='0',a.caixa_valor,0)"),
					       		 'valor_debito'=>new Zend_Db_Expr("if(a.caixa_intipo='1',a.caixa_valor,0)")
					            )
					       )					
					->joinLeft(array('b'=>'cad_banco'),'a.banco_id=b.banco_id',
					           array('b.banco_desc'))
					->joinLeft(array('c'=>'cad_conta'),'a.conta_id=c.conta_id',
					           array('c.conta_desc'))
					->joinLeft(array('d'=>'mov_saldo'),"a.banco_id=d.banco_id and d.saldo_mesano='$dataold'",
					    	   array('d.saldo_valor'))					           
					->order($sort.' '.$dir)
					->limit($limit,$start);
					
		if(!empty($value)) {
			if($field!='locfor_desc' && $field!='caixa_historico') {
				$sql->where("$field= ?",$value);
			}else{
				$sql->where("a.$field LIKE '%".strtoupper($value)."%'");								
			} 	
   	    }		
		return $this->_db->fetchAll($sql);
	}
	
	public function contarCaixa($field,$value)
	{
		$sql = $this->_db->select()
					->from('mov_caixa',array('COUNT(*)'));
			
		if(!empty($value)) {			
			if($field!='locfor_desc' && $field!='caixa_historico') {
				$sql->where("$field=$value");
			}else{
				$sql->where("$field LIKE '%".strtoupper($value)."%'");								
			} 	
   	    }		
		return $this->_db->fetchOne($sql);
	}
	
	public function analiticoCaixa($field)
	{
		$this->_db->getConnection()->setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY,true);
	
		$proc = "call proc_rel_caixa_analitico('{$field['data_inicial']}',
		                                       '{$field['data_final']}',
		                                       '{$field['banco_id']}',		                                       
		                                       '{$field['conta_id']}',
		                                       '{$field['conta_pai']}')";
		
		$stmt = $this->_db->prepare($proc);
		$stmt->execute();
		$stmt->setFetchMode(Zend_Db::FETCH_ASSOC);
		return $stmt->fetchAll();
	}
	
	public function saldoCaixa($dados)
	{		
		$sql = $this->_db->select()
						 ->from(array('a'=>'mov_caixa'),
								array("round(sum(IF(a.caixa_intipo='0',a.caixa_valor,0)),2) as valor_credito",
									  "round(sum(IF(a.caixa_intipo='1',a.caixa_valor,0)),2) as valor_debito",
									 )
		                        )
								->where("a.caixa_data_movto < ?",$dados['data_inicial']);																
		
		if($dados['banco_id']!=0) {
			$sql->where("a.banco_id={$dados['banco_id']}");
		}
		
		if($dados['conta_id']!=0) {
			$sql->where("a.conta_id={$dados['conta_id']}");
		}
		
		return $this->_db->fetchAll($sql);		
	}

	public function listarSintetico($banco_id,$conta_id,$caixa_data_movto_ini,$caixa_data_movto_fim)
	{				
		$sql = $this->_db->select()
					 	 ->from(array('a'=>'mov_caixa'),
								array('a.caixa_data_movto',
									  'a.caixa_intipo',
									  'a.caixa_valor',		
									  "sum(IF(a.caixa_intipo='0',a.caixa_valor,0)) as valor_credito",
									  "sum(IF(a.caixa_intipo='1',a.caixa_valor,0)) as valor_debito",
						   		 	  "IF(c.conta_intipo='0',(sum(IF(a.caixa_intipo='0',a.caixa_valor,0))-sum(IF(a.caixa_intipo='1',a.caixa_valor,0))),
						   		                             (sum(IF(a.caixa_intipo='1',a.caixa_valor,0))-sum(IF(a.caixa_intipo='0',a.caixa_valor,0)))) as valor_total",
									  'conta_filho_codigo'=>'a.conta_id',
									  'conta_filho_desc'=>'c.conta_desc',
									  'conta_pai_codigo'=>'c.conta_pai'	
					 	              )					 	 			  									  
						        )
						->joinLeft(array('b'=>'cad_banco'),'a.banco_id=b.banco_id',
						 		   array('b.banco_desc'))
						->joinLeft(array('c'=>'cad_conta'),'a.conta_id=c.conta_id')
						->where("a.caixa_data_movto >= ?",$caixa_data_movto_ini)
						->where("a.caixa_data_movto <= ?",$caixa_data_movto_fim)
						->group('a.conta_id')
						->order(array('c.conta_codigo',
								  	  'c.conta_ordem'));
	
		if($banco_id!=0) {
			$sql->where("a.banco_id=$banco_id");
		}
				
		if($conta_id!=0) {
			$sql->where("a.conta_id=$conta_id");
		}		
		return $this->_db->fetchAll($sql);
	}
	public function saldoAnterior($banco_id,$conta_id,$caixa_data_movto_ini)
	{
		$sql = $this->_db->select()
						 ->from('mov_caixa',
								array('conta_id',
										"sum(IF(caixa_intipo='0',caixa_valor,0)) as valor_credito",
										"sum(IF(caixa_intipo='1',caixa_valor,0)) as valor_debito",
								     )
							  )
						 ->where("caixa_data_movto <= ?",$caixa_data_movto_ini)
						 ->where("banco_id = ?",$banco_id)
						 ->where("conta_id = ?",$conta_id)
						 ->group('conta_id');
			
		return $this->_db->fetchAll($sql);		
	}
		
	
}
?>
