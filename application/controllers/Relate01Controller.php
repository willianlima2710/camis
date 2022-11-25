<?php

class Relate01Controller extends Zend_Controller_Action {
		
	public function init()
	{
	}	
	
	public function indexAction()
	{			
	}			
	
	public function analiticoAction()
	{	
		// Desativando renderiza��o do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderiza��o da view
 		$this->_helper->_viewRenderer->setNoRender(true);
 		        
 		try {
 			$obito = new Model_DbTable_Obito();
 		    $funcoes = new Model_Function_Geral();
 		    
 		    $post = $this->_request->getPost();
			$post['data_inicial'] = $funcoes->dataeuaGeral($post['data_inicial']);
			$post['data_final'] = $funcoes->dataeuaGeral($post['data_final']);
			
			// verifica o periodo
			if($funcoes->dateDiff($post['data_inicial'], $post['data_final'], 'd')>365){				
				echo "{success:false, msg: {text: 'Periodo n&atilde;o permitido!'}}";
				return;		
			}			

			$dadosObito = $obito->analiticoObito($post);
			
			// verifica se exite dados com o filtro estabelecido
			if(count($dadosObito)==0){
				echo "{success:false, msg: {text: 'Nenhum registro encontrado!'}}";
				return;				 
			}
			
			$column = array(
			'obito_nrobito'=>array('label'=>'Obito','align'=>'C','width'=>22),
			'locatario_desc'=>array('label'=>'Locatario','align'=>'L','width'=>30),
			'jazigo_codigo'=>array('label'=>'Jazigo','align'=>'C','width'=>8),
			'obito_falecido'=>array('label'=>'Falecido','align'=>'L','width'=>30),
			'obito_data_falecimento'=>array('label'=>'Data','align'=>'C','width'=>10),
			'local_desc'=>array('label'=>'Local','align'=>'L','width'=>10),
			'obito_declarante'=>array('label'=>'Declarante','align'=>'L','width'=>20),
			'usuario_login'=>array('label'=>'Usuario','align'=>'L','width'=>23),
			'obito_data_cadastro'=>array('label'=>'Cadastro','align'=>'C','width'=>10)			
			);			
			
	        $pdf = new Model_Function_PDF('L','mm','A4');
	        
	        $pdf->SetTitulo('RELATORIO DE OBITOS - ANALITICO');
	        $pdf->SetColumn($column);	             
	        $pdf->AddPage();
	        $pdf->SetFont('Arial','',6);
	        $pdf->AliasNbPages();	           
            	        
	        for($i=0;$i<count($dadosObito);$i++) {	        		        
	        	foreach($column as $field => $value) {
	        		switch ($field) {
	        			case 'locatario_desc': $dado = substr($dadosObito[$i][$field],0,30); break;
	        			case 'obito_falecido': $dado = substr($dadosObito[$i][$field],0,28); break;
	        			case 'local_desc': $dado = substr($dadosObito[$i][$field],0,8); break;	        			
	        			case 'obito_declarante': $dado = substr($dadosObito[$i][$field],0,18); break;	        			
	        			case 'obito_data_falecimento': $dado = $funcoes->databrGeral($dadosObito[$i][$field]); break;
	        			case 'obito_data_cadastro': $dado = $funcoes->databrGeral($dadosObito[$i][$field]); break;
	        			default: $dado = $dadosObito[$i][$field]; break;
	        		}	        		
	        		$pdf->Cell($column[$field]['width']*1.7,4,$dado,'B',0,$column[$field]['align']);	        			        		
	            }
	            $pdf->Ln();
	        }
	        $pdf->Ln(4);
	        $pdf->SetSummary($dadosObito);        
            	        	                                      
	        $arquivo = $funcoes->retArquivo('ATE01');
	        $pdf->Output($arquivo,'F');
	        
       	    echo "{success:true, link: '".$arquivo."'}";
 		}catch(Exception $e){
			//Zend_Debug::dump($e);
		}
	}	
}
?>

