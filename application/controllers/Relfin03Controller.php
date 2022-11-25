<?php

class Relfin03Controller extends Zend_Controller_Action {
	
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
 		        
 		try {
 			$caixa = new Model_DbTable_Caixa();
 		    $funcoes = new Model_Function_Geral();
 		    
 		    $post = $this->_request->getPost();
			$post['data_inicial'] = $funcoes->dataeuaGeral($post['data_inicial']);
			$post['data_final'] = $funcoes->dataeuaGeral($post['data_final']);

			// verifica o periodo
			if($funcoes->dateDiff($post['data_inicial'], $post['data_final'], 'd')>365){				
				echo "{success:false, msg: {text: 'Periodo n&atilde;o permitido!'}}";
				return;		
			}			
			
			$dadosCaixa = $caixa->analiticoCaixa($post);

			// verifica se exite dados com o filtro estabelecido
			if(count($dadosCaixa)==0){
				echo "{success:false, msg: {text: 'Nenhum registro encontrado!'}}";
				return;				 
			}	
			
			$column = array(
			'caixa_ano'=>array('label'=>'Ano','align'=>'C','width'=>5),
			'locfor_id'=>array('label'=>'Código','align'=>'C','width'=>10),
			'locfor_desc'=>array('label'=>'Locatario/Fornecedor','align'=>'L','width'=>40),
			'jazigo_codigo'=>array('label'=>'Jazigo','align'=>'C','width'=>10),
			'caixa_data_vencto'=>array('label'=>'Vencto','align'=>'C','width'=>10),
			'caixa_valor'=>array('label'=>'Valor','align'=>'R','width'=>10),
			'caixa_data_pagto'=>array('label'=>'Pagto','align'=>'C','width'=>10),
			'caixa_documento'=>array('label'=>'Documento','align'=>'C','width'=>15),
			'caixa_parcela'=>array('label'=>'Parcela','align'=>'C','width'=>10),
			'operacao_desc'=>array('label'=>'Operação','align'=>'L','width'=>40),
			'caixa_intipo'=>array('label'=>'R/P','align'=>'C','width'=>5)
			);
					
	        $pdf = new Model_Function_PDF('L','mm','A4');
	        
	        $pdf->SetTitulo('RELATÓRIO DE FLUXO DE CAIXA - ANALITICO');
	        $pdf->SetColumn($column);
	        $pdf->AddPage();
	        $pdf->SetFont('Arial','',8);
	        $pdf->AliasNbPages();
	           
	        $receber = 0;
            $pagar = 0;
            $saldo = 0;
            	        
	        for($i=0;$i<count($dadosCaixa);$i++) {	        		        
	        	foreach($column as $field => $value) {
	        		switch ($field) {
	        			case 'locfor_desc': $dado = substr($dadosCaixa[$i][$field],0,38); break;
	        			case 'operacao_desc': $dado = substr($dadosCaixa[$i][$field],0,38); break;
	        			case 'caixa_data_vencto': $dado = $funcoes->databrGeral($dadosCaixa[$i][$field]); break;
	        			case 'caixa_valor': $dado = $funcoes->moedabraGeral($dadosCaixa[$i][$field]); break;
	        			case 'caixa_data_pagto': $dado = $funcoes->databrGeral($dadosCaixa[$i][$field]); break;
	        			case 'caixa_intipo': $dado = $dadosCaixa[$i][$field] =='0' ? 'R' : 'P'; break;
	        			default: $dado = $dadosCaixa[$i][$field]; break;
	        		}	        		
	        		$pdf->Cell($column[$field]['width']*1.7,4,$dado,'B',0,$column[$field]['align']);	        		
	            }
	        	// calcula o total de pagos e recibos
	        	$receber += $dadosCaixa[$i]["caixa_intipo"] == '0' ? $dadosCaixa[$i]["caixa_valor"] : 0;
	        	$pagar   += $dadosCaixa[$i]["caixa_intipo"] == '1' ? $dadosCaixa[$i]["caixa_valor"]: 0;
	        	
	        	// calcula a forma de pagamento
	        	
	        	        	
	            $pdf->Ln();
	        }
	        $pdf->Ln(4);
	        
	        //-- acha o saldo
            $saldo = $receber - $pagar;    
	        
	        $pdf->SetSummary($dadosCaixa);	        
	        $pdf->Cell(40,5,'TOTAL RECEBIDO',1,0,'L');
	        $pdf->Cell(40,5,$funcoes->moedabraGeral($receber),1,1,'R');
	        
            $pdf->Cell(40,5,'TOTAL PAGO',1,0,'L');	        	                  
            $pdf->Cell(40,5,$funcoes->moedabraGeral($pagar),1,1,'R');
            
            $pdf->Cell(40,5,'SALDO',1,0,'L');	        	                  
            $pdf->Cell(40,5,$funcoes->moedabraGeral($saldo),1,1,'R');	        
	        	        	                                      
	        $arquivo = $funcoes->retArquivo('REL03');
	        $pdf->Output($arquivo,'F');

	        echo "{success:true, link: '".$arquivo."'}";
 		}catch(Exception $e){
			//Zend_Debug::dump($e);
		}
	}	
}
?>

