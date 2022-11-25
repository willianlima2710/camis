<?php

class ProdservController extends Zend_Controller_Action {
	
	public function init()
	{
						
	}	
	
	public function indexAction()
	{			
		$this->_redirect('prodserv/listar');
	}
			
	public function listarAction()
	{
		// Desativando renderiza��o do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderiza��o da view
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
 		
		$prodserv = new Model_DbTable_Prodserv();
		$contar = 30;
		if(!empty($value)){				
		    $contar = $prodserv->contarProdserv($field,$value);		
		}		
		$dadosProdserv = $prodserv->listarProdserv($start,$limit,$sort,$dir,$field,$value);
		echo '{rows:',Zend_Json::encode($dadosProdserv),',totalCount: ',$contar,'}';		
	}
		
	public function buscarAction()
	{
		// Desativando renderiza��o do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderiza��o da view
 		$this->_helper->_viewRenderer->setNoRender(true); 		 	
 			
 		try{ 			
 			$id = $this->_request->prodserv_id; 		 		
 		    $prodserv = new Model_DbTable_Prodserv();
 		    $dadosProdserv = $prodserv->buscarProdserv('prodserv_id',$id);
 		    echo '{success: true,data:',Zend_Json::encode(current($dadosProdserv)),'}';	
		}catch(Exception $e){
			echo '{success: false}';
			// Zend_Debug::dump($e);
		} 		     			
	}
	
	public function excluirAction()	
	{
		// Desativando renderiza��o do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderiza��o da view
 		$this->_helper->_viewRenderer->setNoRender(true); 

		$prodserv = new Model_DbTable_Prodserv();
		$pkprodserv = $this->_request->prodserv_id;
		
		try{
			if(is_array($pkprodserv)){
				foreach($pkprodserv as $valor){
					$dadosProdserv = $prodserv->find($valor)->current();
					$dadosProdserv->delete();
				}
			}else{
				$dadosProdserv = $prodserv->find($pkprodserv)->current();
				$dadosProdserv->delete();
			};
		    echo '{success: true}';
		}catch(Exception $e) {
			echo '{success: false}';
			// Zend_Debug::dump($e);
		}
	}
	   
	public function salvarAction()
	{		
		// Desativando renderiza��o do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderiza��o da view
 		$this->_helper->_viewRenderer->setNoRender(true);
 		 
		$post = $this->_request->getPost();
		unset($post['action']);
		
		$prodserv = new Model_DbTable_Prodserv();
		$funcoes = new Model_Function_Geral();		
	    try {
	    	//-- converte para maiscula
	    	foreach($post as $campo=> $valor){	    		
	    		$post[$campo] = strtoupper(trim($valor));
	    	}
	    	$post['usuario_login'] = $funcoes->userAtivo();   	
	    	if($post['prodserv_id']==0){
	    		$prodserv->insert($post);   		
	    	}else{
	    		$prodserv->update($post,"prodserv_id = {$post['prodserv_id']}");	    		
	    	}   	    
		    echo '{success: true}';
		} catch(Exception $e) {
			echo '{success: false}';
			//Zend_Debug::dump($e);
		}  				
	} 

    public function autocompleteAction()
	{
		// Desativando renderiza��o do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderiza��o da view
 		$this->_helper->_viewRenderer->setNoRender(true);
 		
 		$value = $this->_request->value;
 		
 		if(!empty($value)){
 			$prodserv = new Model_DbTable_Prodserv();
 			$dadosProdserv = $prodserv->autocompleteProdserv($value);
 			echo '{rows:',Zend_Json::encode($dadosProdserv),'}';
 		}else{
 			echo '{success: false}';
 		} 				
	}	
    public function todoAction()
    {
        // Desativando renderiza��o do layout
        $this->_helper->layout->disableLayout();

        // Desativando renderiza��o da view
        $this->_helper->_viewRenderer->setNoRender(true);        

        $invenda = $this->_request->invenda;
        try{
            $produto = new Model_DbTable_Prodserv();

            $invenda = isset($invenda) ? $invenda : '1';

            $dadosProdserv = $produto->todoProdserv($invenda);
            echo Zend_Json::encode($dadosProdserv);
        }catch(Exception $e){
            echo '{success: false}';
            // Zend_Debug::dump($e);
        }
	}
	public function posestoqAction()
	{
		// Desativando renderização do layout
		$this->_helper->layout->disableLayout();
			
		// Desativando renderização da view
		$this->_helper->_viewRenderer->setNoRender(true);

		$prodserv = new Model_DbTable_Prodserv();
		$funcoes = new Model_Function_Geral();

		try{		
			$dadosProdserv = $prodserv->posestoqProdserv();
						
			// verifica se exite dados com o filtro estabelecido
			if(count($dadosProdserv)==0){				
				echo "{success:false, msg: {text: 'Nenhum registro encontrado!'}}";
				return;
			}
							
			$column = array(
			'prodserv_id'=>array('label'=>'Codigo','align'=>'C','width'=>10),
			'prodserv_desc'=>array('label'=>'Descrição','align'=>'L','width'=>72),
			'prodserv_valor'=>array('label'=>'Valor','align'=>'R','width'=>10),
			'prodserv_saldo'=>array('label'=>'Saldo','align'=>'C','width'=>10),
			'prodserv_custo'=>array('label'=>'Custo Médio','align'=>'R','width'=>10)			
			);			
			
			$pdf = new Model_Function_PDF();
			$pdf->SetTitulo('RELATORIO DE POSICAO DE ESTOQUE');
			$pdf->SetColumn($column);
			$pdf->AddPage();
			$pdf->SetFont('Arial','',8);
			$pdf->AliasNbPages();
						
			for($i=0;$i<count($dadosProdserv);$i++) {
				foreach($column as $field => $value) {
					switch ($field) {
						case 'prodserv_desc': $dado = utf8_decode($dadosProdserv[$i]['prodserv_desc']); break;						
						case 'prodserv_valor': $dado = $funcoes->moedabraGeral($dadosProdserv[$i]['prodserv_valor']); break;
						case 'prodserv_custo': $dado = '0,00'; break;
						default: $dado = $dadosProdserv[$i][$field]; break;
					}
					$pdf->Cell($column[$field]['width']*1.7,4,$dado,'B',0,$column[$field]['align']);
				}
				$pdf->Ln();
			}
			$pdf->Ln(4);
			 
			$pdf->SetSummary($dadosProdserv);
			$arquivo = $funcoes->retArquivo('ETQ01');
			$pdf->Output($arquivo,'F');		
			
			echo "{success:true, link: '".$arquivo."'}";
		} catch(Exception $e) {
			echo "{success:false, msg: {text: 'Nenhum registro encontrado!'}}";
		}
	}
}
?>

