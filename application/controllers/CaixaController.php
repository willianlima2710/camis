<?php

class CaixaController extends Zend_Controller_Action {
	
	public function init()
	{
						
	}	
	
	public function indexAction()
	{			
		$this->_redirect('caixa/listar');
	}
			
	public function listarAction()
	{				
		try{			
			// Desativando renderização do layout 		
	 		$this->_helper->layout->disableLayout();
	 		
	 		// Desativando renderização da view
	 		$this->_helper->_viewRenderer->setNoRender(true);
	 		
	 		$funcoes = new Model_Function_Geral();
	 		$caixa = new Model_DbTable_Caixa();
	 		
	 		$banco_id = $this->_request->banco_id;
	 		$caixa_mesano = $this->_request->caixa_mesano;
	 		$caixa_data_movto_ini = $this->_request->caixa_data_movto_ini;
	 		$caixa_data_movto_fim = $this->_request->caixa_data_movto_fim;			 
			
			$data = substr($caixa_data_movto_ini,0,4).'-'.substr($caixa_data_movto_ini,5,2);		
			$dataold = strftime( '%Y-%m' , strtotime( '-1 month' , strtotime( $data ) ) );
			$dataold = substr($dataold,5,2).substr($dataold,0,4);		
			
			$dadosCaixa = $caixa->listarCaixa($banco_id,
					                          $caixa_data_movto_ini,
					                          $caixa_data_movto_fim,
					                          $dataold);			
			echo '{rows:',Zend_Json::encode($dadosCaixa),'}';
		}catch(Exception $e){
			echo '{success: false}';
			Zend_Debug::dump($e);
		} 				
	}
	public function listar1Action()
	{
		try{
			// Desativando renderização do layout
			$this->_helper->layout->disableLayout();
	
			// Desativando renderização da view
			$this->_helper->_viewRenderer->setNoRender(true);
	
			$funcoes = new Model_Function_Geral();
			$caixa = new Model_DbTable_Caixa();
	
			$banco_id = $this->_request->banco_id;
			$caixa_mesano = $this->_request->caixa_mesano;
			$caixa_data_movto_ini = $this->_request->caixa_data_movto_ini;
			$caixa_data_movto_fim = $this->_request->caixa_data_movto_fim;
				
			$data = substr($caixa_data_movto_ini,0,4).'-'.substr($caixa_data_movto_ini,5,2);
			$dataold = strftime( '%Y-%m' , strtotime( '-1 month' , strtotime( $data ) ) );
			$dataold = substr($dataold,5,2).substr($dataold,0,4);
				
			$dadosCaixa = $caixa->listarCaixa1($banco_id,
					                           $caixa_data_movto_ini,
					                           $caixa_data_movto_fim,
					                           $dataold);
			echo '{rows:',Zend_Json::encode($dadosCaixa),'}';
		}catch(Exception $e){
			echo '{success: false}';
			Zend_Debug::dump($e);
		}
	}	
	public function listar2Action()
	{
		try{			
			// Desativando renderização do layout
			$this->_helper->layout->disableLayout();
				
			// Desativando renderização da view
			$this->_helper->_viewRenderer->setNoRender(true);
				
			$start = $this->_request->start;
			$limit = $this->_request->limit;
			$sort = $this->_request->sort;
			$dir = $this->_request->dir;
			$value = $this->_request->value;
			$field = $this->_request->field;
		
			$start = intval($start);
			$limit = intval($limit);
		
			if ($start == 0){
				$start = 0;
			}
				
			if($limit == 0) {
				$limit = 30;
			}
				
			if(!isset($sort)){
				$sort = 'data_ultima_alteracao';
				$dir = 'DESC';
			}
				
			$caixa = new Model_DbTable_Caixa();
			$contar = 30;
			if(!empty($value)) {
				$contar = $caixa->contarCaixa($field,$value);
			}
			$dadosCaixa = $caixa->listarCaixa2($start,$limit,$sort,$dir,$field,$value);
		
			echo '{rows:',Zend_Json::encode($dadosCaixa),',totalCount: ',$contar,'}';
		}catch(Exception $e){
			echo '{success: false}';
			Zend_Debug::dump($e);
		}		
	}
		
	public function buscarAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true); 		 	
 			
	 	$caixa = new Model_DbTable_Caixa();
 		$funcoes = new Model_Function_Geral(); 			
 			
 		try{ 			
 			$id = $this->_request->caixa_id; 		 		
 		    $dadosCaixa = $caixa->buscarCaixa('caixa_id',$id);
 		    $dadosCaixa = current($dadosCaixa); 		    
 		    $dadosCaixa['caixa_data_movto'] = $funcoes->databrGeral($dadosCaixa['caixa_data_movto']);
 		     		    
 		    echo '{success: true,data:',Zend_Json::encode($dadosCaixa),'}';	
		}catch(Exception $e){
			echo '{success: false}';
			// Zend_Debug::dump($e);
		} 		     			
 	}
	
	public function excluirAction()	
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true); 

		$caixa = new Model_DbTable_Caixa();
		$pkcaixa = $this->_request->caixa_id;
		
		try{
			if(is_array($pkcaixa)){
				foreach($pkcaixa as $valor){
					$dadosCaixa = $caixa->find($valor)->current();
					$dadosCaixa->delete();
				}
			}else{
				$dadosCaixa = $caixa->find($pkcaixa)->current();
				$dadosCaixa->delete();
			};
		    echo '{success: true}';
		}catch(Exception $e) {
			echo '{success: false}';
			// Zend_Debug::dump($e);
		}
	}
	   
	public function salvarAction()	
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true);
 		 
		$post = $this->_request->getPost();
		unset($post['action']);
		
		$caixa = new Model_DbTable_Caixa();
		$funcoes = new Model_Function_Geral();		
	
	    try {
	    	//-- converte para maiscula
	    	foreach($post as $campo=> $valor){	    		
	    		$post[$campo] = strtoupper(trim($valor));
	    	}   	
	    	
	    	$post['caixa_mesano'] = substr($post['caixa_data_movto'],3,2).substr($post['caixa_data_movto'],6,4);
	    	$post['caixa_data_movto'] = $funcoes->dataeuaGeral($post['caixa_data_movto']);
	    	$post['usuario_login'] = $funcoes->userAtivo();
	    	if($post['caixa_id']==0){
	    		$caixa->insert($post);   		
	    		$pkcaixa = $caixa->getAdapter()->lastInsertId();
	    	}else{
	    		$caixa->update($post,"caixa_id = {$post['caixa_id']}");
	    		$pkcaixa = $post['caixa_id'];
	    	}   	    
		    echo "{success: true,id: '{$pkcaixa}'}";
		} catch(Exception $e) {
			echo '{success: false}';
			//Zend_Debug::dump($e);
		}  				
	}

	public function todoAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true); 		 	
 			
 		try{	 		
 		    $caixa = new Model_DbTable_Caixa(); 		    
 		    $dadosCaixa = $caixa->todoCaixa();
 		    echo Zend_Json::encode($dadosCaixa); 		    
		}catch(Exception $e){
			echo '{success: false}';
			// Zend_Debug::dump($e);
		}
	}
	
	public function impanaliticoAction()
	{
		// Desativando renderização do layout
		$this->_helper->layout->disableLayout();
			
		// Desativando renderização da view
		$this->_helper->_viewRenderer->setNoRender(true);
		 
		try {
	 		$funcoes = new Model_Function_Geral();
	 		$caixa = new Model_DbTable_Caixa();
	 		
	 		$banco_id = $this->_request->banco_id;
	 		$caixa_data_movto_ini = $this->_request->caixa_data_movto_ini;
	 		$caixa_data_movto_fim = $this->_request->caixa_data_movto_fim;			 
			
			$data = substr($caixa_data_movto_ini,0,4).'-'.substr($caixa_data_movto_ini,5,2);		
			$dataold = strftime( '%Y-%m' , strtotime( '-1 month' , strtotime( $data ) ) );
			$dataold = substr($dataold,5,2).substr($dataold,0,4);		
			
			$dadosCaixa = $caixa->listarCaixa($banco_id,
					                          $caixa_data_movto_ini,
					                          $caixa_data_movto_fim,
					                          $dataold);
			
			$post = array(
			'data_inicial'=>$caixa_data_movto_ini,
			'banco_id'=>$banco_id,		
			);
			$dadosSaldo = $caixa->saldoCaixa($post);
			$dadosSaldo = current($dadosSaldo);
			//$dadosBanco = $banco->find($post['banco_id'])->current();							
							
			 
			// verifica se exite dados com o filtro estabelecido
			if(count($dadosCaixa)==0){
				echo "{success:false, msg: {text: 'Nenhum registro encontrado!'}}";
				return;
			}
				
			$column = array(
			'caixa_data_movto'=>array('label'=>'Data','align'=>'C','width'=>10),
			'banco_desc'=>array('label'=>'Banco','align'=>'C','width'=>14),
			'conta_desc'=>array('label'=>'Conta','align'=>'L','width'=>25),
			'locfor_desc'=>array('label'=>'Nome','align'=>'L','width'=>45),
			'caixa_documento'=>array('label'=>'Doc.','align'=>'C','width'=>10),								
			'valor_debito'=>array('label'=>'Debito','align'=>'R','width'=>9),
			'valor_credito'=>array('label'=>'Credito','align'=>'R','width'=>9),
			'caixa_historico'=>array('label'=>'Historico','align'=>'L','width'=>42)
			);
					
	        $pdf = new Model_Function_PDF('L','mm','A4');
	        
	        $pdf->SetTitulo("MOVIMENTO DE CAIXA - ANALITICO: {$funcoes->databrGeral($caixa_data_movto_ini)} a {$funcoes->databrGeral($caixa_data_movto_fim)}");
	        $pdf->SetColumn($column);
	        $pdf->AddPage();
	        $pdf->SetFont('Arial','',7);
	        $pdf->AliasNbPages();
	        $vldebito = 0;
	        $vlcredito = 0;
	        for($i=0;$i<count($dadosCaixa);$i++) {
	        	foreach($column as $field => $value) {
	        		switch ($field) {
	        			case 'caixa_data_movto': $dado = $funcoes->databrGeral($dadosCaixa[$i][$field]); break;
	        			case 'caixa_historico': $dado = substr($dadosCaixa[$i][$field],0,29); break;	        			
	        			case 'valor_debito': $dado = $funcoes->moedabraGeral($dadosCaixa[$i][$field]); 
	        			                     $vldebito += $dadosCaixa[$i][$field]; break;
	        			case 'valor_credito': $dado = $funcoes->moedabraGeral($dadosCaixa[$i][$field]);
	        								  $vlcredito += $dadosCaixa[$i][$field];break;
	        			case 'conta_desc': $dado = substr($dadosCaixa[$i][$field],0,21); break;
	        			case 'locfor_desc': $dado = substr($dadosCaixa[$i][$field],0,32); break;
	        			default: $dado = $dadosCaixa[$i][$field]; break;
	        		}
	        		$pdf->Cell($column[$field]['width']*1.7,4,$dado,'B',0,$column[$field]['align']);
	        	}	        	 
	        	$pdf->Ln();
	        }
	          		 
			$pdf->Ln();
			$pdf->SetSummary($dadosCaixa);
			
			$vlanterior = ($dadosSaldo['valor_credito']-$dadosSaldo['valor_debito']);
			$pdf->Cell(40,5,'SALDO ANTERIOR',1,0,'L');
			$pdf->Cell(40,5,$funcoes->moedabraGeral($vlanterior),1,1,'R');						
            $pdf->Cell(40,5,'TOTAL CREDITO',1,0,'L');                        
	        $pdf->Cell(40,5,$funcoes->moedabraGeral($vlcredito),1,1,'R');
	        $pdf->Cell(40,5,'TOTAL DEBITO',1,0,'L');
            $pdf->Cell(40,5,$funcoes->moedabraGeral($vldebito),1,1,'R');
            $pdf->Cell(40,5,'SALDO',1,0,'L');
            $pdf->Cell(40,5,$funcoes->moedabraGeral(($vlanterior+$vlcredito)-$vldebito),1,1,'R');            
							
			$arquivo = $funcoes->retArquivo('REL04');
			$pdf->Output($arquivo,'F');

			echo "<iframe src=$arquivo style=border:0 width=100% height=100%'></iframe>";			
		}catch(Exception $e){
			Zend_Debug::dump($e);
		}
	}

	public function impsinteticoAction()
	{
		// Desativando renderização do layout
		$this->_helper->layout->disableLayout();
			
		// Desativando renderização da view
		$this->_helper->_viewRenderer->setNoRender(true);
			
		try {			
			$funcoes = new Model_Function_Geral();
			$caixa = new Model_DbTable_Caixa();
	
			$banco_id = $this->_request->banco_id;
			$caixa_data_movto_ini = $this->_request->caixa_data_movto_ini;
			$caixa_data_movto_fim = $this->_request->caixa_data_movto_fim;
				
			$data = substr($caixa_data_movto_ini,0,4).'-'.substr($caixa_data_movto_ini,5,2);
			$dataold = strftime( '%Y-%m' , strtotime( '-1 month' , strtotime( $data ) ) );
			$dataold = substr($dataold,5,2).substr($dataold,0,4);
				
			$dadosCaixa = $caixa->listarCaixa1($banco_id,
					                           $caixa_data_movto_ini,
					                           $caixa_data_movto_fim,
					                           $dataold);
							
	
			// verifica se exite dados com o filtro estabelecido
			if(count($dadosCaixa)==0){
				echo "{success:false, msg: {text: 'Nenhum registro encontrado!'}}";
				return;
			}
	
			$column = array(
			'caixa_data_movto'=>array('label'=>'Data','align'=>'C','width'=>12),
			'conta_desc'=>array('label'=>'Conta','align'=>'L','width'=>80),
			'valor_debito'=>array('label'=>'Debito','align'=>'R','width'=>10),
			'valor_credito'=>array('label'=>'Credito','align'=>'R','width'=>10),
			);
				
			$pdf = new Model_Function_PDF('P','mm','A4');
			 
			$pdf->SetTitulo("MOVIMENTO DE CAIXA - SINTETICO: {$funcoes->databrGeral($caixa_data_movto_ini)} a {$funcoes->databrGeral($caixa_data_movto_fim)}");
			$pdf->SetColumn($column);
			$pdf->AddPage();
			$pdf->SetFont('Arial','',8);
			$pdf->AliasNbPages();
			
			$vldebito = 0;
			$vlcredito = 0;
			for($i=0;$i<count($dadosCaixa);$i++) {
				foreach($column as $field => $value) {
					switch ($field) {
						case 'caixa_data_movto': $dado = $funcoes->databrGeral($dadosCaixa[$i][$field]); break;
	        			case 'valor_debito': $dado = $funcoes->moedabraGeral($dadosCaixa[$i][$field]); 
	        			                     $vldebito += $dadosCaixa[$i][$field]; break;
	        			case 'valor_credito': $dado = $funcoes->moedabraGeral($dadosCaixa[$i][$field]);
	        								  $vlcredito += $dadosCaixa[$i][$field];break;
						case 'conta_desc': $dado = substr($dadosCaixa[$i][$field],0,34); break;
						default: $dado = $dadosCaixa[$i][$field]; break;
					}
					$pdf->Cell($column[$field]['width']*1.7,4,$dado,'B',0,$column[$field]['align']);
				}
				$pdf->Ln();
			}
						 
			$pdf->Cell(174,4,$funcoes->moedabraGeral($vldebito),'',0,'R');
			$pdf->Cell(16,4,$funcoes->moedabraGeral($vlcredito),'',1,'R');				
			$pdf->Ln(4);
			$pdf->SetSummary($dadosCaixa);
			$arquivo = $funcoes->retArquivo('REL05');
			$pdf->Output($arquivo,'F');
	
			echo "<iframe src=$arquivo style=border:0 width=100% height=100%'></iframe>";
		}catch(Exception $e){
			Zend_Debug::dump($e);
		}
	}	
}
?>

