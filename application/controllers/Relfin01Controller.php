<?php

include("./public/bin/excelwriter.inc.php");
define('FPDF_FONTPATH', '../framework/fpdf/font/');
require_once('../framework/fpdf/fpdf.php');

class Relfin01Controller extends Zend_Controller_Action {
	
	public function init()
	{
	}	
	
	public function indexAction()
	{			
	}			
	
	public function analiticoAction()
	{	
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true);
 		
 		$recpar = new Model_DbTable_Recpar();
 		$venda = new Model_DbTable_Venda();
 		$vendapdsv = new Model_DbTable_Vendapdsv();
 		$funcoes = new Model_Function_Geral();
 		$usuario = new Model_DbTable_Usuario();		
 		
 		try {
 		    
 		    $post = $this->_request->getPost();
 		    $dadosUsuario = $usuario->find($post['usuario_id'])->current();
 		    
			$post['data_inicial'] = $funcoes->dataeuaGeral($post['data_inicial']);
			$post['data_final'] = $funcoes->dataeuaGeral($post['data_final']);			
			$post['usuario_login'] = $dadosUsuario['usuario_login']; 
			
			// verifica o periodo
			if($funcoes->dateDiff($post['data_inicial'], $post['data_final'], 'd')>365){				
				echo "{success:false, msg: {text: 'Periodo n&atilde;o permitido!'}}";
				return;		
			}
			
			$dadosRecpar = $recpar->analiticoRecpar($post);
			
			// verifica se exite dados com o filtro estabelecido
			if(count($dadosRecpar)==0){
				echo "{success:false, msg: {text: 'Nenhum registro encontrado!'}}";
				return;				 
			}
			
			$column = array(
			'recpar_ano'=>array('label'=>'Ano','align'=>'C','width'=>7),
			'locatario_id'=>array('label'=>'Código','align'=>'C','width'=>8),
			'locatario_desc'=>array('label'=>'Locatario','align'=>'L','width'=>40),
			'jazigo_codigo'=>array('label'=>'Jazigo','align'=>'C','width'=>9),
			'recpar_data_vencto'=>array('label'=>'Vencto','align'=>'C','width'=>9),
			'recpar_pago'=>array('label'=>'Valor','align'=>'R','width'=>9),
			'recpar_data_pagto'=>array('label'=>'Pagto','align'=>'C','width'=>10),
			'formarec_desc'=>array('label'=>'Foma','align'=>'L','width'=>10),
			'ctarec_documento'=>array('label'=>'Doc','align'=>'C','width'=>9),
			'prodserv_desc'=>array('label'=>'Produto/Serviço','align'=>'L','width'=>32),
			'usuario_login'=>array('label'=>'Usuário','align'=>'L','width'=>20)
			);		

			$pdf = new Model_Function_PDF('L','mm','A4');
	        
	        $pdf->SetTitulo('RELATÓRIO DE TITULOS A RECEBER - ANALITICO');
	        $pdf->SetColumn($column);	             
	        $pdf->AddPage();
	        $pdf->SetFont('Arial','',6);
	        $pdf->AliasNbPages();
	           
	        $valor = 0;
            $pagou = 0;
            $saldo = 0;
            $vldinheiro = 0;
            $vlcheque = 0;
            $vlboleto = 0;
            $vlcartao = 0;
            $vldeposito = 0;
            $vldebito = 0;             
	        for($i=0;$i<count($dadosRecpar);$i++) {	        		        
	        	foreach($column as $field => $value) {
	        		
	        		// busca os itens da venda]	        		
	        		/*
	        		if($field=='prodserv_desc') {	        			
	        			$dadosVenda = array(
	        			'venda_documento'=>$dadosRecpar[$i]["ctarec_documento"],
	        			'jazigo_codigo'=>$dadosRecpar[$i]["jazigo_codigo"]
	        			);
	        			$dadosVenda = current($venda->buscar2Venda($dadosVenda));	        				        			
	        			        			
	        			if($dadosVenda!=false) {	        			       			
		        			$dadosVendaPdsv = array(
		        			'venda_id'=>$dadosVenda['venda_id'],
		        			'venda_pdsv_total'=>$dadosRecpar[$i]["recpar_valor"]
		        			);		        			
	        				$dadosVendaPdsv = $vendapdsv->buscar2Vendapdsv($dadosVendaPdsv);
	        			}else{
	        				$dadosVendaPdsv = array();
	        			}	
	        		} 
	        		*/       		
	        		
	        		switch ($field) {
	        			case 'recpar_data_vencto': $dado = $funcoes->databrGeral($dadosRecpar[$i][$field]); break;
	        			case 'recpar_pago': $dado = $funcoes->moedabraGeral($dadosRecpar[$i][$field]); break;
	        			case 'recpar_data_pagto': $dado = $funcoes->databrGeral($dadosRecpar[$i][$field]); break;
	        			case 'recpar_pago': $dado = $funcoes->moedabraGeral($dadosRecpar[$i][$field]); break;
	        			case 'prodserv_desc': $dado = $dadosRecpar[$i]['operacao_desc']; break;
	        			default: $dado = $dadosRecpar[$i][$field]; break;
	        		}      		
	        		$pdf->Cell($column[$field]['width']*1.7,4,$dado,'TB',0,$column[$field]['align']);	        		
	            }
	            				
	            switch ($dadosRecpar[$i]["formarec_id"]) {
	            	case '1': $vldinheiro += $dadosRecpar[$i]["recpar_pago"]; break;
	            	case '2': $vlcheque += $dadosRecpar[$i]["recpar_pago"]; break;
	            	case '3': $vlboleto += $dadosRecpar[$i]["recpar_pago"]; break;
	            	case '4': $vlcartao += $dadosRecpar[$i]["recpar_pago"]; break;
	            	case '5': $vldeposito += $dadosRecpar[$i]["recpar_pago"]; break;
	            	case '6': $vlcongregacao += $dadosRecpar[$i]["recpar_pago"]; break;
	            	case '7': $vlsaff += $dadosRecpar[$i]["recpar_pago"]; break;
	            	case '8': $vldebito += $dadosRecpar[$i]["recpar_pago"]; break;
	            }
	            
	            // calcula o total de pagos e recibos
	        	$valor += $dadosRecpar[$i]["recpar_pago"];
	            $pdf->Ln();
	        }
	        $pdf->Ln(4);
	        
	        $pdf->SetSummary($dadosRecpar);       
            $pdf->Cell(40,5,'TOTAL GERAL',1,0,'L');	        	                  
            $pdf->Cell(40,5,$funcoes->moedabraGeral($valor),1,1,'R');
            $pdf->Cell(40,5,'DINHEIRO',1,0,'L');
            $pdf->Cell(40,5,$funcoes->moedabraGeral($vldinheiro),1,1,'R');
            $pdf->Cell(40,5,'CHEQUE',1,0,'L');
            $pdf->Cell(40,5,$funcoes->moedabraGeral($vlcheque),1,1,'R');
            $pdf->Cell(40,5,'BOLETO',1,0,'L');
            $pdf->Cell(40,5,$funcoes->moedabraGeral($vlboleto),1,1,'R');
            $pdf->Cell(40,5,'CARTÃO DE CREDITO',1,0,'L');
            $pdf->Cell(40,5,$funcoes->moedabraGeral($vlcartao),1,1,'R');
            $pdf->Cell(40,5,'CARTÃO DE DEBITO',1,0,'L');
            $pdf->Cell(40,5,$funcoes->moedabraGeral($vldebito),1,1,'R');
            $pdf->Cell(40,5,'DEPOSITO',1,0,'L');
            $pdf->Cell(40,5,$funcoes->moedabraGeral($vldeposito),1,1,'R');     
            $pdf->Cell(40,5,'CONG.CRISTA',1,0,'L');
            $pdf->Cell(40,5,$funcoes->moedabraGeral($vlcongregacao),1,1,'R');
            $pdf->Cell(40,5,'SAFF',1,0,'L');
            $pdf->Cell(40,5,$funcoes->moedabraGeral($vlsaff),1,1,'R');
            
	        	                                      
	        $arquivo = $funcoes->retArquivo('REL01');
	        $pdf->Output($arquivo,'F');      

	        echo "{success:true, link: '".$arquivo."'}";
 		}catch(Exception $e){
 			echo "{success:false, msg: {text: 'Nenhum registro encontrado!'}}";
			//Zend_Debug::dump($e);
		}
	}
	public function analiticoexcelAction()
	{
		// Desativando renderização do layout
		$this->_helper->layout->disableLayout();
			
		// Desativando renderização da view
		$this->_helper->_viewRenderer->setNoRender(true);
		
		$recpar = new Model_DbTable_Recpar();
		$venda = new Model_DbTable_Venda();
		$vendapdsv = new Model_DbTable_Vendapdsv();
		$funcoes = new Model_Function_Geral();
		$usuario = new Model_DbTable_Usuario();		
			
		try {
 		    $post = $this->_request->getPost();
 		    $dadosUsuario = $usuario->find($post['usuario_id'])->current();
 		    
			$post['data_inicial'] = $funcoes->dataeuaGeral($post['data_inicial']);
			$post['data_final'] = $funcoes->dataeuaGeral($post['data_final']);			
			$post['usuario_login'] = $dadosUsuario['usuario_login']; 
				
			// verifica o periodo
			if($funcoes->dateDiff($post['data_inicial'], $post['data_final'], 'd')>365){
				echo "{success:false, msg: {text: 'Periodo n&atilde;o permitido!'}}";
				return;
			}
	
			$dadosRecpar = $recpar->analiticoRecpar($post);
	
			// verifica se exite dados com o filtro estabelecido
			if(count($dadosRecpar)==0){
				echo "{success:false, msg: {text: 'Nenhum registro encontrado!'}}";
				return;
			}
	
			$dados = array(
			'ANO',
			'CODIGO',
			'LOCATARIO',
			'JAZIGO',
			'VENCTO',
			'VALOR',
			'PAGTO',
			'PAGOU',
			'OPERACAO'
			);
				
			$arquivo = "./public/tmp/RECPAR.xls";
			$excel= new ExcelWriter($arquivo);
			$excel->writeLine($dados);
	
			$valor = 0;
			$pagou = 0;
			$saldo = 0;
				
			for($i=0;$i<count($dadosRecpar);$i++) {
				$dados = array(
				$dadosRecpar[$i]['recpar_ano'],
				$dadosRecpar[$i]['locatario_id'],
				$dadosRecpar[$i]['locatario_desc'],
				$dadosRecpar[$i]['jazigo_codigo'],
				$funcoes->databrGeral($dadosRecpar[$i]['recpar_data_vencto']),
				$dadosRecpar[$i]['recpar_valor'],
				$dadosRecpar[$i]['recpar_data_pagto'],
				$funcoes->moedabraGeral($dadosRecpar[$i]['recpar_pago']),
				$dadosRecpar[$i]['operacao_desc']
				);
				$excel->writeLine($dados);
				 
				// calcula o total de pagos e recibos
				$valor += $dadosRecpar[$i]['recpar_valor'];
				$pagou += $dadosRecpar[$i]['recpar_pago'];
			}
				
			//-- acha o saldo
			$saldo = $valor - $pagou;
	
			$excel->writeLine(array());
			$dados = array(
					'TOTAL GERAL: '.$funcoes->moedabraGeral($valor),
					'TOTAL PAGO: '.$funcoes->moedabraGeral($pagou),
					'SALDO: '.$funcoes->moedabraGeral($saldo)
			);
			$excel->writeLine($dados);
			$excel->close();
				
			echo "{success:true, link: '".$arquivo."'}";
		}catch(Exception $e){
			Zend_Debug::dump($e);
		}
	}	
}
?>

