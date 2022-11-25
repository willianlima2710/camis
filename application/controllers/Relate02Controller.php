<?php

class Relate02Controller extends Zend_Controller_Action {
	
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
 		
 		$venda = new Model_DbTable_Venda();
 		$vendapdsv = new Model_DbTable_Vendapdsv(); 			
 		$funcoes = new Model_Function_Geral(); 			
 		        
 		try {
 		    
 		    $post = $this->_request->getPost();
			$post['data_inicial'] = $funcoes->dataeuaGeral($post['data_inicial']);
			$post['data_final'] = $funcoes->dataeuaGeral($post['data_final']);
			
			// verifica o periodo
			if($funcoes->dateDiff($post['data_inicial'], $post['data_final'], 'd')>365){				
				echo "{success:false, msg: {text: 'Periodo n&atilde;o permitido!'}}";
				return;		
			}	

			$dadosVenda = $venda->analiticoVenda($post);
			
			// verifica se exite dados com o filtro estabelecido
			if(count($dadosVenda)==0){
				echo "{success:false, msg: {text: 'Nenhum registro encontrado!'}}";
				return;				 
			}
			
			$column = array(
			'venda_id'=>array('label'=>'Numero','align'=>'C','width'=>10),
			'locatario_id'=>array('label'=>'Código','align'=>'C','width'=>10),
			'locatario_desc'=>array('label'=>'Locatario','align'=>'L','width'=>42),
			'jazigo_codigo'=>array('label'=>'Jazigo','align'=>'C','width'=>10),
			'venda_data'=>array('label'=>'Data','align'=>'C','width'=>10),
			'venda_documento'=>array('label'=>'Documento','align'=>'C','width'=>15),
			'venda_outros'=>array('label'=>'Outros','align'=>'R','width'=>10),			
			'venda_total'=>array('label'=>'Valor','align'=>'R','width'=>10),
			'venda_infaturar'=>array('label'=>'Faturado','align'=>'C','width'=>10),
			'operacao_desc'=>array('label'=>'Operacao','align'=>'C','width'=>37)
			);
			
	        $pdf = new Model_Function_PDF('L','mm','A4');
	        
	        $pdf->SetTitulo('RELATÓRIO DE VENDAS - ANALITICO');
	        $pdf->SetColumn($column);
	        $pdf->AddPage();
	        $pdf->SetFont('Arial','',8);
	        $pdf->AliasNbPages();
	        
	        $total = 0;
	        	           
	        for($i=0;$i<count($dadosVenda);$i++) {	        		        
	        	foreach($column as $field => $value) {
	        		switch ($field) {
	        			case 'locatario_desc': $dado = substr($dadosVenda[$i][$field],0,40); break;
	        			case 'venda_data': $dado = $funcoes->databrGeral($dadosVenda[$i][$field]); break;
	        			case 'venda_outros': $dado = $funcoes->moedabraGeral($dadosVenda[$i][$field]); break;
	        			case 'venda_total': $dado = $funcoes->moedabraGeral($dadosVenda[$i][$field]); break;
	        			case 'venda_infaturar': $dado = $dadosVenda[$i][$field] =='0' ? 'N' : 'S'; break;
	        			case 'operacao_desc': $dado = substr($dadosVenda[$i][$field],0,35); break;
	        			default: $dado = $dadosVenda[$i][$field]; break;
	        		}	        		
	        		$pdf->Cell($column[$field]['width']*1.7,4,$dado,'B',0,$column[$field]['align']);	        		
	            }
            	$dadosVendaPdsv = $vendapdsv->buscarVendapdsv('venda_id',$dadosVenda[$i]['venda_id']);
            	$pdf->Ln();
            	for($j=0;$j<count($dadosVendaPdsv);$j++) {
            		$pdf->Cell(280,4,$dadosVendaPdsv[$j]['prodserv_desc'].' - '.$funcoes->moedabraGeral($dadosVendaPdsv[$j]['venda_pdsv_total']),0,1,'R');
            	}
	             
  	        	// calcula o total de vendas
	        	$total += $dadosVenda[$i]["venda_total"];
	        		            
	            $pdf->Ln();
	        }
	        $pdf->Ln(4);

	        $pdf->SetSummary($dadosVenda);	        
	        $pdf->Cell(40,5,'TOTAL DE VENDAS',1,0,'L');
	        $pdf->Cell(40,5,$funcoes->moedabraGeral($total),1,1,'R');
	        
	        $arquivo = $funcoes->retArquivo('ATE02');
	        $pdf->Output($arquivo,'F');
	        	
       	    echo "{success:true, link: '".$arquivo."'}";
 		}catch(Exception $e){
			//Zend_Debug::dump($e);
		}
	}	
}
?>

