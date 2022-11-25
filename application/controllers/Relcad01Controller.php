<?php

class Relcad01Controller extends Zend_Controller_Action {
	
	protected $orientation ='L';
	protected $unit = 'mm';
	protected $format ='A4';
	protected $titulo = 'RELATÓRIO DE JAZIGOS';
	protected $header = array();
		
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
 			$jazigo = new Model_DbTable_Jazigo();
 		    $funcoes = new Model_Function_Geral();
 		    
 		    $post = $this->_request->getPost();
			$dadosJazigo = $jazigo->analiticoJazigo($post);
			
			// verifica se exite dados com o filtro estabelecido
			if(count($dadosJazigo)==0){
				echo "{success:false, msg: {text: 'Nenhum registro encontrado!'}}";
				return;				 
			}

			$column = array(
			'jazigo_codigo'=>array('label'=>'Numero','align'=>'C','width'=>10),
			'cemiterio_desc'=>array('label'=>'Cemiterio','align'=>'L','width'=>30),
			'lote_codigo'=>array('label'=>'Lote','align'=>'C','width'=>10),
			'quadra_codigo'=>array('label'=>'Quadra','align'=>'C','width'=>10),
			'jazigo_gaveta'=>array('label'=>'Gaveta','align'=>'C','width'=>10),
			'tpterreno_desc'=>array('label'=>'Tipo do terreno','align'=>'L','width'=>20),
			'tpjazigo_desc'=>array('label'=>'Tipo do jazigo','align'=>'L','width'=>20),			
			'jazigo_disponivel'=>array('label'=>'Disponivel','align'=>'C','width'=>15),
			);
			
	        $pdf = new Model_Function_PDF('L','mm','A4');
	        
	        $pdf->SetTitulo('RELATÓRIO DE JAZIGOS - ANALITICO');
	        $pdf->SetColumn($column);
	        $pdf->AddPage();
	        $pdf->SetFont('Arial','',8);
	        $pdf->AliasNbPages();
	        
	        for($i=0;$i<count($dadosJazigo);$i++) {	        		        
	        	foreach($column as $field => $value) {
	        		switch ($field) {
	        			case 'cemiterio_desc': $dado = substr($dadosJazigo[$i][$field],0,28); break;
	        			case 'tpterreno_desc': $dado = substr($dadosJazigo[$i][$field],0,18); break;
	        			case 'tpjazigo_desc': $dado = substr($dadosJazigo[$i][$field],0,18); break;
	        			default: $dado = $dadosJazigo[$i][$field]; break;
	        		}	        		
	        		$pdf->Cell($column[$field]['width']*1.7,4,$dado,'B',0,$column[$field]['align']);	        		
	            }
	            $pdf->Ln();
	        }
	        $pdf->Ln(4);
	        $pdf->SetSummary($dadosJazigo);
	        	        
	        $arquivo = $funcoes->retArquivo('CAD01');
	        $pdf->Output($arquivo,'F');
	        	
       	    echo "{success:true, link: '".$arquivo."'}";
 		}catch(Exception $e){
			Zend_Debug::dump($e);
		}
	}	
}
?>

