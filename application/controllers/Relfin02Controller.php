<?php

include("./public/bin/excelwriter.inc.php");
define('FPDF_FONTPATH', '../framework/fpdf/font/');
require_once('../framework/fpdf/fpdf.php');

class Relfin02Controller extends Zend_Controller_Action {
	
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
 		
 		$usuario = new Model_DbTable_Usuario();
 		$pagpar = new Model_DbTable_Pagpar();
 		$funcoes = new Model_Function_Geral();
 			        
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

			$dadosPagpar = $pagpar->analiticoPagpar($post);
			
			// verifica se exite dados com o filtro estabelecido
			if(count($dadosPagpar)==0){
				echo "{success:false, msg: {text: 'Nenhum registro encontrado!'}}";
				return;				 
			}
			
			$column = array(
			'fornecedor_desc'=>array('label'=>'Fornecedor','align'=>'L','width'=>30),
			'ctapag_documento'=>array('label'=>'Doc','align'=>'C','width'=>8),
			'pagpar_data_vencto'=>array('label'=>'Vencto','align'=>'C','width'=>8),
			'pagpar_valor'=>array('label'=>'Valor','align'=>'R','width'=>8),
			'pagpar_data_pagto'=>array('label'=>'Pagto','align'=>'C','width'=>8),
			'pagpar_pago'=>array('label'=>'Pagou','align'=>'R','width'=>8),
			'ctapag_observacao'=>array('label'=>'Observações','align'=>'L','width'=>55),
			'operacao_desc'=>array('label'=>'Operação','align'=>'L','width'=>20),
			'usuario_login'=>array('label'=>'Usuário','align'=>'L','width'=>20)
			);			
						
	        $pdf = new Model_Function_PDF('L','mm','A4');
	        
	        $pdf->SetTitulo('RELATÓRIO DE TITULOS A PAGAR - ANALITICO');
	        $pdf->SetColumn($column);
	        $pdf->AddPage();
	        $pdf->SetFont('Arial','',6);
	        $pdf->AliasNbPages();
	           
	        $valor = 0;
            $pagou = 0;
            $saldo = 0;
            	        
	        for($i=0;$i<count($dadosPagpar);$i++) {	        		        
	        	foreach($column as $field => $value) {
	        		switch ($field) {
	        			case 'pagpar_data_vencto': $dado = $funcoes->databrGeral($dadosPagpar[$i][$field]); break;
	        			case 'pagpar_valor': $dado = $funcoes->moedabraGeral($dadosPagpar[$i][$field]); break;
	        			case 'pagpar_data_pagto': $dado = $funcoes->databrGeral($dadosPagpar[$i][$field]); break;
	        			case 'pagpar_pago': $dado = $funcoes->moedabraGeral($dadosPagpar[$i][$field]); break;
	        			default: $dado = $dadosPagpar[$i][$field]; break;
	        		}	        		
	        		$pdf->Cell($column[$field]['width']*1.7,4,$dado,'',0,$column[$field]['align']);	        		
	            }
	            // calcula o total de pagos e recibos
	        	$valor += $dadosPagpar[$i]["pagpar_valor"];
	        	$pagou += $dadosPagpar[$i]["pagpar_pago"];	        	         
	            $pdf->Ln();
	        }
	        $pdf->Ln(4);
	        
	        //-- acha o saldo
            $saldo = $valor - $pagou;    
	        
	        $pdf->SetSummary($dadosPagpar);	        
            $pdf->Cell(40,5,'TOTAL GERAL',1,0,'L');
	        $pdf->Cell(40,5,$funcoes->moedabraGeral($valor),1,1,'R');
	        
            $pdf->Cell(40,5,'TOTAL PAGO',1,0,'L');	        	                  
            $pdf->Cell(40,5,$funcoes->moedabraGeral($pagou),1,1,'R');
            
            $pdf->Cell(40,5,'SALDO',1,0,'L');	        	                  
            $pdf->Cell(40,5,$funcoes->moedabraGeral($saldo),1,1,'R');        	        
	        	                                      
	        $arquivo = $funcoes->retArquivo('REL02');
	        $pdf->Output($arquivo,'F');
	              
       	    echo "{success:true, link: '".$arquivo."'}";
 		}catch(Exception $e){
			//Zend_Debug::dump($e);
		}
	}
	public function analiticoexcelAction()
	{
		// Desativando renderização do layout
		$this->_helper->layout->disableLayout();
			
		// Desativando renderização da view
		$this->_helper->_viewRenderer->setNoRender(true);
		
		$pagpar = new Model_DbTable_Pagpar();
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
	
			$dadosPagpar = $pagpar->analiticoPagpar($post);
	
			// verifica se exite dados com o filtro estabelecido
			if(count($dadosPagpar)==0){
				echo "{success:false, msg: {text: 'Nenhum registro encontrado!'}}";
				return;
			}
	
			$dados = array(
			'ANO',
			'CODIGO',
			'FORNECEDOR',
			'DOCUMENTO',
			'VENCTO',
			'VALOR',
			'PAGTO',
			'PAGOU',
			'OPERACAO',
			'OBSERVACAO'		
			);
	
			$arquivo = "./public/tmp/PAGPAR.xls";
			$excel= new ExcelWriter($arquivo);
			$excel->writeLine($dados);
	
			$valor = 0;
			$pagou = 0;
			$saldo = 0;
	
			for($i=0;$i<count($dadosPagpar);$i++) {
				$dados = array(
				$dadosPagpar[$i]['pagpar_ano'],
				$dadosPagpar[$i]['fornecedor_id'],
				$dadosPagpar[$i]['fornecedor_desc'],
				$dadosPagpar[$i]['ctapag_documento'],
				$funcoes->databrGeral($dadosPagpar[$i]['pagpar_data_vencto']),
				$dadosPagpar[$i]['pagpar_valor'],
				$funcoes->databrGeral($dadosPagpar[$i]['pagpar_data_pagto']),
				$funcoes->moedabraGeral($dadosPagpar[$i]['pagpar_pago']),
				$dadosPagpar[$i]['operacao_desc'],
				$dadosPagpar[$i]['ctapag_observacao'],
				);
				$excel->writeLine($dados);
					
				// calcula o total de pagos e recibos
				$valor += $dadosPagpar[$i]['pagpar_valor'];
				$pagou += $dadosPagpar[$i]['pagpar_pago'];
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

