<?php

define('FPDF_FONTPATH', '../framework/fpdf/font/');
require_once('../framework/fpdf/fpdf.php'); 

class Model_Function_Rcbbaixa extends FPDF
{	
	function SetLeftMargin()
    {
    	$this->lMargin = 2;
    }
    function SetTopMargin()
    {
    	$this->tMargin = 1;
    }
    function SetRightMargin()
    {
    	$this->rMargin = 2;
    }
    public function Detail($dadosLocatario,$dadosRecpar)
    {
    	$funcoes = new Model_Function_Geral();
    	
    	date_default_timezone_set('Brazil/East');
    	
    	// cabecalho do recibo
    	$this->SetFont('Arial','B',20);
    	$this->SetFillColor(200);
    	$this->Cell(190,8,'RECIBO',1,1,'C',1);
    	$this->Ln(2);

    	// dados da empresa
    	$this->Rect(10,18,100,30,'D');    	
    	$this->SetFontSize(12);   	
    	$this->Cell(100,5,'CAMIS ASSESORIA E SERVIÇOS LTDA',0,1,'C');
    	$this->SetFontSize(8);
    	$this->Cell(100,2,'CNPJ: 08.474.605/0001-26',0,1,'C');
    	
    	$this->Ln(2);
    	$this->SetFontSize(10);   
        $this->Cell(100,5,'CEMITÉRIO SÃO JOÃO BATISTA',0,1,'L');
        $this->SetFontSize(7.4);          	 	
        $this->Cell(100,3,'AV. BRASIL,2440 - CENTRO - TELEFONE: (45)3028-0979/3028-0999',0,1,'L');
    	
        $this->Ln(1);
        $this->SetFontSize(10);
        $this->Cell(100,5,'CEMITÉRIO JARDIM SÃO PAULO',0,1,'L');
        $this->SetFontSize(7.4);
    	$this->Cell(100,3,'AV. FELIPE WANDSCHEER,3400 - JD.SAO PAULO - TELEFONE: (45)3028-0996',0,1,'L');    	
    	    	
    	// valores do recibo
    	$this->SetFontSize(10);    	
    	$this->Rect(110,18,90,30,'D');
    	$this->Line(110,25,200,25);
    	$this->Line(110,32,200,32);
    	$this->Line(110,40,200,40);
    	
    	$this->SetXY(110,22);
    	$this->Cell(0,0,'OUTROS:',0,1,'L');
    	$this->SetXY(150,22);
    	$this->Cell(0,0,$funcoes->moedabraGeral('0'),0,1,'R');
    	
    	$this->SetXY(110,29);    	
    	$this->Cell(0,0,'JUROS:',0,1,'L');
    	$this->SetXY(150,29);
    	$this->Cell(0,0,$funcoes->moedabraGeral('0'),0,1,'R');    	
    	
    	$this->SetXY(110,36);    	
    	$this->Cell(0,0,'DESCONTO:',0,1,'L');
    	$this->SetXY(150,36);    	
    	$this->Cell(0,0,$funcoes->moedabraGeral('0'),0,1,'R');
    	
    	$this->SetXY(110,44);    	   	
    	$this->Cell(0,0,'VALOR TOTAL:',0,1,'L');
    	$this->SetXY(150,44);
    	$this->Cell(0,0,$funcoes->moedabraGeral($dadosRecpar['recpar_pago']),0,1,'R');
    	    	
    	$this->SetFontSize(8);

    	// recebemos de
    	$this->SetXY(10,48);    	
    	$this->Rect(10,48,40,4,'D');
    	$this->Cell(0,4,"RECEBEMOS DE:",0,1,'L');
    	$this->SetXY(51,48);    	
    	$this->Rect(50,48,150,4,'D');    	
    	$this->Cell(0,4,$dadosLocatario['locatario_desc'],0,1,'L');    	 	
    	
    	// Endereço    	    	
    	$endereco = $dadosLocatario['locatario_endereco'].','.$dadosLocatario['locatario_numero'].' - '.$dadosLocatario['locatario_bairro'];
    	$this->SetXY(10,52);
    	$this->Rect(10,52,40,4,'D');
    	$this->Cell(0,4,"ENDEREÇO:",0,0,'L');
    	$this->SetXY(51,52);
    	$this->Rect(50,52,150,4,'D');
    	$this->Cell(0,4,$endereco,0,1,'L');    	    	
    	
    	// A importancia
    	$total = trim($funcoes->valorporextenso($dadosRecpar['recpar_pago']));
    	$this->SetXY(10,56);    	
    	$this->Rect(10,56,40,4,'D');
    	$this->Cell(0,4,"IMPORTÂNCIA DE:",0,1,'L');
    	$this->SetXY(51,56);
    	$this->Rect(50,56,150,4,'D');
    	$this->Cell(0,4,$total,0,1,'L');    	
    	
    	// Forma de pagamento
    	$this->SetXY(10,60);
    	$this->Rect(10,60,40,4,'D');
    	$this->Cell(0,4,'FORMA DE RECEBIMENTO:',0,1,'L');
    	$this->SetXY(51,60);
    	$this->Rect(50,60,150,4,'D');    	
    	
 		$formarec = $funcoes->databrGeral($dadosRecpar['recpar_data_vencto']).'/'.
    	            $funcoes->moedabraGeral($dadosRecpar['recpar_valor']).'/'.
    	            $dadosRecpar['formarec_desc'];
    	$this->Cell(0,4,$formarec,0,0,'L');
    	$this->Ln(0);   	
    	
    	// Jazigo
    	$this->SetXY(10,64);
    	$this->Rect(10,64,40,4,'D');
    	$this->Cell(0,4,'JAZIGO:',0,1,'L');
    	$this->SetXY(51,64);
    	$this->Rect(50,64,100,4,'D');    	
    	$this->Cell(0,4,$dadosRecpar['jazigo_codigo'],0,0,'L');
    	
    	// Ano
    	$this->SetXY(150,64);
    	$this->Rect(150,64,20,4,'D');
    	$this->Cell(0,4,'ANO:',0,1,'L');
    	$this->SetXY(170,64);
    	$this->Rect(170,64,30,4,'D');
    	$this->Cell(0,4,date('Y'),0,1,'L');    	
    	
    	// Produtos e serviços
    	$this->SetXY(10,69);
    	$this->Rect(10,68,100,40,'D');
    	$this->Cell(0,4,'PRODUTOS E SERVIÇOS:',0,1,'L');
    	
    	$this->SetXY(10,74);
   		$this->Cell(0,3,$dadosRecpar['operacao_desc'].' - '.$dadosRecpar['recpar_ano'],0,1,'L');    		    		
    	
    	// Assinatura    	
    	$this->SetXY(110,69);
    	$this->Cell(0,4,'PARA MAIOR CLAREZA FIRMAMOS O PRESENTE',0,0,'C');
    	$this->Rect(110,68,90,15,'D');
    	$this->Line(198,75,112,75);    	
    	$this->Line(198,79,112,79);    	    	
    	   	
    	// Numero do recibo
    	$this->SetXY(110,89);
    	$this->SetFontSize(20);
    	$this->Rect(110,83,15,15,'D');   	    	
    	$this->Cell(0,4,'N°',0,0,'L');    	
    	$this->SetXY(125,89);
    	$this->Rect(125,83,75,15,'D');
    	$this->Cell(0,4,str_pad($dadosRecpar['ctarec_documento'],6,'0',STR_PAD_LEFT),0,0,'C');

    	// cidade
    	$this->SetFontSize(8);    	
    	$this->SetXY(110,101);
    	$data = date('d/m/Y H:i:s');
    	$this->Rect(110,98,90,10,'D');    	
    	$this->Cell(0,4,"FOZ DO IGUAÇU-PR, $data",0,1,'C');
    	
    	$this->Line(10,114,200,114);
    	
    	/************************************************************************************************************************************
    	 * SEGUNDA COPIA DO RECIBO
        */
    	
    	// cabecalho do recibo
    	$this->SetXY(10,120);
    	$this->SetFont('Arial','B',20);
    	$this->SetFillColor(200);
    	$this->Cell(190,8,'RECIBO',1,1,'C',1);
    	$this->Ln(2);

    	// dados da empresa
    	$this->Rect(10,128,100,30,'D');    	
    	$this->SetFontSize(12);   	
    	$this->Cell(100,5,'CAMIS ASSESORIA E SERVIÇOS LTDA',0,1,'C');
    	$this->SetFontSize(8);
    	$this->Cell(100,2,'CNPJ: 08.474.605/0001-26',0,1,'C');
    	
    	$this->Ln(2);
    	$this->SetFontSize(10);   
        $this->Cell(100,5,'CEMITÉRIO SÃO JOÃO BATISTA',0,1,'L');
        $this->SetFontSize(7.4);          	 	
        $this->Cell(100,3,'AV. BRASIL,2440 - CENTRO - TELEFONE: (45)3028-0979/3028-0999',0,1,'L');
    	
        $this->Ln(1);
        $this->SetFontSize(10);
        $this->Cell(100,5,'CEMITÉRIO JARDIM SÃO PAULO',0,1,'L');
        $this->SetFontSize(7.4);
    	$this->Cell(100,3,'AV. FELIPE WANDSCHEER,3400 - JD.SAO PAULO - TELEFONE: (45)3028-0996',0,1,'L');    	
    	    	    	
    	// valores do recibo    	
    	$this->SetFontSize(10); 	
    	$this->Rect(110,128,90,30,'D');
    	$this->Line(110,135,200,135);
    	$this->Line(110,142,200,142);
    	$this->Line(110,149,200,149);
    	    	
    	$this->SetXY(110,132);
    	$this->Cell(0,0,'OUTROS:',0,1,'L');
    	$this->SetXY(150,132);
    	$this->Cell(0,0,$funcoes->moedabraGeral('0'),0,1,'R');
    	
    	$this->SetXY(110,139);    	
    	$this->Cell(0,0,'JUROS:',0,1,'L');
    	$this->SetXY(150,139);
    	$this->Cell(0,0,$funcoes->moedabraGeral('0'),0,1,'R');    	
    	
    	$this->SetXY(110,146);    	
    	$this->Cell(0,0,'DESCONTO:',0,1,'L');
    	$this->SetXY(150,146);    	
    	$this->Cell(0,0,$funcoes->moedabraGeral('0'),0,1,'R');
    	
    	$this->SetXY(110,154);    	   	
    	$this->Cell(0,0,'VALOR TOTAL:',0,1,'L');
    	$this->SetXY(150,154);
    	$this->Cell(0,0,$funcoes->moedabraGeral($dadosRecpar['recpar_pago']),0,1,'R');
    	    	
    	$this->SetFontSize(8);

    	// recebemos de
    	$this->SetXY(10,158);    	
    	$this->Rect(10,158,40,4,'D');
    	$this->Cell(0,4,"RECEBEMOS DE:",0,1,'L');
    	$this->SetXY(51,158);    	
    	$this->Rect(50,158,150,4,'D');    	
    	$this->Cell(0,4,$dadosLocatario['locatario_desc'],0,1,'L');    	 	
    	
    	// Endereço    	    	
    	$endereco = $dadosLocatario['locatario_endereco'].','.$dadosLocatario['locatario_numero'].' - '.$dadosLocatario['locatario_bairro'];
    	$this->SetXY(10,162);
    	$this->Rect(10,162,40,4,'D');
    	$this->Cell(0,4,"ENDEREÇO:",0,0,'L');
    	$this->SetXY(51,162);
    	$this->Rect(50,162,150,4,'D');
    	$this->Cell(0,4,$endereco,0,1,'L');    	    	
    	
    	// A importancia
    	$total = trim($funcoes->valorporextenso($dadosRecpar['recpar_pago']));
    	$this->SetXY(10,166);    	
    	$this->Rect(10,166,40,4,'D');
    	$this->Cell(0,4,"IMPORTÂNCIA DE:",0,1,'L');
    	$this->SetXY(51,166);
    	$this->Rect(50,166,150,4,'D');
    	$this->Cell(0,4,$total,0,1,'L');    	
    	
    	// Forma de pagamento
    	$this->SetXY(10,170);
    	$this->Rect(10,170,40,4,'D');
    	$this->Cell(0,4,'FORMA DE RECEBIMENTO:',0,1,'L');
    	$this->SetXY(51,170);
    	$this->Rect(50,170,150,4,'D');    	
    	
  		$formarec = $funcoes->databrGeral($dadosRecpar['recpar_data_vencto']).'/'.
   		            $funcoes->moedabraGeral($dadosRecpar['recpar_valor']).'/'.
   		            $dadosRecpar['formarec_desc'];
   		$this->Cell(0,4,$formarec,0,0,'L');                             		
    	$this->Ln(0);   	
    	
    	// Jazigo
    	$this->SetXY(10,174);
    	$this->Rect(10,174,40,4,'D');
    	$this->Cell(0,4,'JAZIGO:',0,1,'L');
    	$this->SetXY(51,174);
    	$this->Rect(50,174,100,4,'D');    	
    	$this->Cell(0,4,$dadosRecpar['jazigo_codigo'],0,0,'L');
    	
    	// Ano
    	$this->SetXY(150,174);
    	$this->Rect(150,174,20,4,'D');
    	$this->Cell(0,4,'ANO:',0,1,'L');
    	$this->SetXY(170,174);
    	$this->Rect(170,174,30,4,'D');
    	$this->Cell(0,4,date('Y'),0,1,'L');    	
    	
    	// Produtos e serviços
    	$this->SetXY(10,179);
    	$this->Rect(10,178,100,40,'D');
    	$this->Cell(0,4,'PRODUTOS E SERVIÇOS:',0,1,'L');
    	
    	$this->SetXY(10,184);
   		$this->Cell(0,3,$dadosRecpar['operacao_desc'].' - '.$dadosRecpar['recpar_ano'],0,1,'L');    	    		    		
    	
    	// Assinatura    	
    	$this->SetXY(110,179);
    	$this->Cell(0,4,'PARA MAIOR CLAREZA FIRMAMOS O PRESENTE',0,0,'C');
    	$this->Rect(110,178,90,15,'D');
    	$this->Line(198,185,112,185);    	
    	$this->Line(198,189,112,189);    	    	
    	   	
    	// Numero do recibo
    	$this->SetXY(110,198);
    	$this->SetFontSize(20);
    	$this->Rect(110,193,15,15,'D');   	    	
    	$this->Cell(0,4,'N°',0,0,'L');    	
    	$this->SetXY(125,198);
    	$this->Rect(125,193,75,15,'D');
    	$this->Cell(0,4,str_pad($dadosRecpar['ctarec_documento'],6,'0',STR_PAD_LEFT),0,0,'C');

    	// cidade
    	$this->SetFontSize(8);    	
    	$this->SetXY(110,211);
    	$data = date('d/m/Y H:i:s');    	
    	$this->Rect(110,208,90,10,'D');    	
    	$this->Cell(0,4,"FOZ DO IGUAÇU-PR, $data",0,1,'C');
    	
    	    	
    }  	
}

?>