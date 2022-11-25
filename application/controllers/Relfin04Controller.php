<?php

class Relfin04Controller extends Zend_Controller_Action {
	
	public function sinteticoAction()
	{	
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true);
 		
 		$funcoes = new Model_Function_Geral();
 		$caixa = new Model_DbTable_Caixa();
 		$conta = new Model_DbTable_Conta(); 			
 		
 		try {
 			$banco_id = $this->_request->banco_id;
 			$conta_id = $this->_request->conta_id;
 			$caixa_data_movto_ini = $funcoes->dataeuaGeral($this->_request->caixa_data_movto_ini);
 			$caixa_data_movto_fim = $funcoes->dataeuaGeral($this->_request->caixa_data_movto_fim);
 		
 			//-- executa o filtro
 			$dadosCaixa = $caixa->listarSintetico($banco_id,$conta_id,
 												  $caixa_data_movto_ini,
 												  $caixa_data_movto_fim);
 					
 			// verifica se exite dados com o filtro estabelecido
 			if(count($dadosCaixa)==0){
 				echo "{success:false, msg: {text: 'Nenhum registro encontrado!'}}";
 				return;
 			}
 				
 			//-- guarda o numero da conta pai e busca o primeiro
 			$contaPai = $dadosCaixa[0]['conta_pai_codigo'];
 			$dadosConta = current($conta->buscarConta('conta_codigo',$contaPai));
 			$relatorio = array();
 		
 			for($i=0;$i<count($dadosCaixa);$i++) {
 					
 				if($dadosCaixa[$i]['conta_pai_codigo']==$contaPai) { 					
 					$dadosSaldoAnterior = current($caixa->saldoAnterior($banco_id,$dadosCaixa[$i]['conta_id'],$caixa_data_movto_ini)); 					 		
 		
 					//-- titulo da conta e tiulo do total
 					$contaPaiHead = !empty($dadosConta['conta_titulo_header']) ? $dadosConta['conta_titulo_header'] : $dadosConta['conta_desc']; 						
 					$contaPaiFoo = !empty($dadosConta['conta_titulo_footer']) ? $dadosConta['conta_titulo_footer'] : $dadosConta['conta_desc'];
 						
 					//-- calcula o saldo anterior das contas
 					//-- conta do ativo 01.000   debito - credito
 					//-- conta do passivo 02.000 credito + debito
 					if($dadosCaixa[$i]['conta_pai_codigo']=='01.000') {
 						$dadosCaixa[$i]['valor_total'] = $dadosCaixa[$i]['valor_total']+($dadosSaldoAnterior['valor_debito']-
 																	 					 $dadosSaldoAnterior['valor_credito']);
 						$saldoAnterior = $dadosSaldoAnterior['valor_debito']-$dadosSaldoAnterior['valor_credito'];
 					}else if($dadosCaixa[$i]['conta_pai_codigo']=='02.000') {
 						$dadosCaixa[$i]['valor_total'] = $dadosCaixa[$i]['valor_total']+($dadosSaldoAnterior['valor_credito']-
 								                                                         $dadosSaldoAnterior['valor_debito']);
 						$saldoAnterior = $dadosSaldoAnterior['valor_credito']-$dadosSaldoAnterior['valor_debito'];
 					}
 						
 					array_push($relatorio,array(
 					'valor_credito'=>$dadosCaixa[$i]['valor_credito'],
 					'valor_debito'=>$dadosCaixa[$i]['valor_debito'],
 					'valor_total'=>$dadosCaixa[$i]['valor_total'],
 					'saldo_anterior'=>$saldoAnterior,
 					'conta_filho_codigo'=>$dadosCaixa[$i]['conta_filho_codigo'],
 					'conta_filho_desc'=>$dadosCaixa[$i]['conta_filho_desc'],
 					'conta_pai_codigo'=>$dadosCaixa[$i]['conta_pai_codigo'],
 					'conta_pai_head'=>$contaPaiHead,
 					'conta_pai_foo'=>$contaPaiFoo,
 					'conta_indre'=>$dadosConta['conta_indre']
 					));
 				}else{
 					//-- atribui a nova conta e busca
 					$contaPai = $dadosCaixa[$i]['conta_pai_codigo'];
 					$dadosConta = current($conta->buscarConta('conta_codigo',$contaPai));
 					$dadosSaldoAnterior = current($caixa->saldoAnterior(1,$dadosCaixa[$i]['conta_id'],$caixa_data_movto_ini));
 						 
 					//-- titulo da conta e tiulo do total
 					$contaPaiHead = !empty($dadosConta['conta_titulo_header']) ? $dadosConta['conta_titulo_header'] : $dadosConta['conta_desc']; 						
 					$contaPaiFoo = !empty($dadosConta['conta_titulo_footer']) ? $dadosConta['conta_titulo_footer'] : $dadosConta['conta_desc'];
 		
 					//-- calcula o saldo anterior das contas
 					//-- conta do ativo 01.000   debito - credito
 					//-- conta do passivo 02.000 credito + debito
 					if($dadosCaixa[$i]['conta_pai_codigo']=='01.000') {
 						$dadosCaixa[$i]['valor_total'] = $dadosCaixa[$i]['valor_total']+($dadosSaldoAnterior['valor_debito']-
 								                                                         $dadosSaldoAnterior['valor_credito']);
 						$saldoAnterior = $dadosSaldoAnterior['valor_debito']-$dadosSaldoAnterior['valor_credito'];
 					}else if($dadosCaixa[$i]['conta_pai_codigo']=='02.000') {
 						$dadosCaixa[$i]['valor_total'] = $dadosCaixa[$i]['valor_total']+($dadosSaldoAnterior['valor_credito']-
 								                                                         $dadosSaldoAnterior['valor_debito']);
 						$saldoAnterior = $dadosSaldoAnterior['valor_credito']-$dadosSaldoAnterior['valor_debito'];
 					}
 						
 					array_push($relatorio,array(
 					'valor_credito'=>$dadosCaixa[$i]['valor_credito'],
 					'valor_debito'=>$dadosCaixa[$i]['valor_debito'],
 					'valor_total'=>$dadosCaixa[$i]['valor_total'],
 					'saldo_anterior'=>$saldoAnterior,
 					'conta_filho_codigo'=>$dadosCaixa[$i]['conta_filho_codigo'],
 					'conta_filho_desc'=>$dadosCaixa[$i]['conta_filho_desc'],
 					'conta_pai_codigo'=>$dadosCaixa[$i]['conta_pai_codigo'],
 					'conta_pai_head'=>$contaPaiHead,
 					'conta_pai_foo'=>$contaPaiFoo,
 					'conta_indre'=>$dadosConta['conta_indre'],
 					));
 				} 				
 			}
 				
 			$column = array(
			'conta_codigo'=>array('label'=>'Código','align'=>'C','width'=>10),
			'conta_desc'=>array('label'=>'Conta','align'=>'L','width'=>42),
			'valor_anterior'=>array('label'=>'Anterior','align'=>'R','width'=>15),
			'valor_debito'=>array('label'=>'Debito','align'=>'R','width'=>15),
			'valor_credito'=>array('label'=>'Credito','align'=>'R','width'=>15),
			'valor_total'=>array('label'=>'Valor','align'=>'R','width'=>15),
 			);
 		
 			$pdf = new Model_Function_PDF('P','mm','A4');
 			$pdf->SetFillColor(238,233,233);
 			$pdf->SetTitulo("DEMONSTRAÇÃO DE RESULTADOS - {$funcoes->databrGeral($caixa_data_movto_ini)} a {$funcoes->databrGeral($caixa_data_movto_fim)}");
 			$pdf->SetColumn($column);
 			$pdf->AddPage();
 			$pdf->AliasNbPages();
 				
 			//-- cria o cabeçalho da conta pai inicial
 			$pdf->Ln(1);
 			$pdf->SetFont('Arial','B',8);
 			$pdf->Cell(155,4,$relatorio[0]['conta_pai_head'].' - '.$relatorio[0]['conta_pai_codigo'],'',1);
 			$pdf->SetFont('Arial','',8);
 		
 			//-- atribui os valores
 			$contaPai = $relatorio[0]['conta_pai_codigo'];
 			$vltotal = 0;
 			$vltotdebito = 0;
 			$vltotcredito = 0;
 			$footer = '';
 				
 			for($i=0;$i<count($relatorio);$i++) {
 		
 				//-- atribui a descrição do cabeçalho
 				$footer = $relatorio[$i]['conta_pai_foo'];
 					
 				//-- a conta pai é igual ?
 				if($relatorio[$i]['conta_pai_codigo']!=$contaPai){
 					//-- subt total da conta pai
 					$pdf->SetFont('Arial','B',8);
 					$pdf->Cell(6,4,'','',0,true);
 					$pdf->Cell(20,4,$footer,'',0,'L',true);
 					$pdf->Cell(165,4,$funcoes->moedabraGeral($vltotal),'',1,'R',true);
 					$pdf->Ln(1);
 						
 					//-- inicializa nova conta
 					$contaPai = $relatorio[$i]['conta_pai_codigo'];
 					$pdf->Cell(155,4,$relatorio[$i]['conta_pai_head'].' - '.$relatorio[$i]['conta_pai_codigo'],'',1);
 					$pdf->SetFont('Arial','',8);
 		
 					$vltotal = 0;
 				}
 				$pdf->Cell(6,4,'','',0);
 				$pdf->Cell(20,4,$relatorio[$i]['conta_filho_codigo'],'',0);
 				$pdf->Cell(73.5,4,$relatorio[$i]['conta_filho_desc'],'',0);
 		
 				if($contaPai=='01.000' || $contaPai=='02.000') {
 					$pdf->Cell(15,4,$funcoes->moedabraGeral($relatorio[$i]['saldo_anterior']),'',0,'R');
 					$pdf->Cell(25,4,$funcoes->moedabraGeral($relatorio[$i]['valor_debito']),'',0,'R');
 					$pdf->Cell(26,4,$funcoes->moedabraGeral($relatorio[$i]['valor_credito']),'',0,'R');
 					$pdf->Cell(25,4,$funcoes->moedabraGeral($relatorio[$i]['valor_total']),'',1,'R');
 				}else{
 					$pdf->Cell(91,4,$funcoes->moedabraGeral($relatorio[$i]['valor_total']),'',1,'R');
 				}
 		
 				//-- totaliza por conta pai - subtotal
 				$vltotal += $relatorio[$i]['valor_total'];
 		
 				//-- acumulador geral e verifica se inside no dre
 				if($relatorio[$i]['conta_indre']==1){
 					$vltotdebito  += $relatorio[$i]['valor_debito'];
 					$vltotcredito += $relatorio[$i]['valor_credito'];
 				}
 			}
 				
 			//-- subt total da conta pai
 			$pdf->SetFont('Arial','B',8);
 			$pdf->Cell(6,4,'','',0,true);
 			$pdf->Cell(20,4,$footer,'',0,'L',true);
 			$pdf->Cell(165,4,$funcoes->moedabraGeral($vltotal),'',1,'R',true);
 			$pdf->Ln(1);
 		
 			//-- total geral
 			$pdf->SetFont('Arial','',8);
 			$pdf->Cell(20,4,'TOTAL DOS CREDITOS','',0);
 			$pdf->Cell(171,4,$funcoes->moedabraGeral($vltotcredito),'',1,'R');
 				
 			$pdf->Cell(20,4,'TOTAL DOS DEBITOS','',0);
 			$pdf->Cell(171,4,$funcoes->moedabraGeral($vltotdebito),'',1,'R');
 				
 			$pdf->SetFont('Arial','B',8);
 			$pdf->Cell(20,4,'RESULTADO DO PERIODO','',0);
 			$pdf->Cell(171,4,$funcoes->moedabraGeral(($vltotcredito-$vltotdebito)),'',1,'R');
 				
 			$arquivo = $funcoes->retArquivo('REL06');
 			$pdf->Output($arquivo,'F');
 		
	        echo "{success:true, link: '".$arquivo."'}"; 			
 		}catch(Exception $e){
 			Zend_Debug::dump($e);
 		} 		
	}	
}
?>

