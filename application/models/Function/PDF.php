<?php

define('FPDF_FONTPATH', '../framework/fpdf/font/');
require_once('../framework/fpdf/fpdf.php'); 

class Model_Function_PDF extends FPDF
{
	protected $titulo;
	protected $column;
	protected $align;
	protected $width;
					
    function Header()
    {    	    	
    	// monta o header do relatorio
    	//$this->Image('./public/logo/logo.png', 3, 1,25,13);
    	$this->SetFont('Arial','B',10);
    	$this->Cell(0,5,$this->titulo,'BT',0,'C');
    	$this->Cell(0,5,date('d-m-Y H:i:s',strtotime('now')),0,0,'R');    	
    	$this->Ln(5);
    	
    	$this->SetFont('Arial','B',7);
    	// monta as colunas do header
    	foreach($this->column as $field => $properties) {
    		$this->Cell($this->column[$field]['width']*1.7,4,$this->column[$field]['label'],1,0,$this->column[$field]['align']);    			        		        	
	    }
	    $this->Ln();    	
    }    
    function Footer()
    {
    	$this->SetY(-10);
        $this->SetFont('Arial','',8);
        $this->Cell(0,5,'Pagina: '.$this->PageNo(),'T',0,'L');
        $this->Cell(0,5,'ERP EMPSOFT-CMS',0,0,'R');        
    }    
    public function SetTitulo($titulo)
    {
    	$this->titulo = $titulo;
    }
    public function SetColumn($column)
    {
    	$this->column = $column;    	
    }
    public function SetAlign($align)
    {
    	$this->align = $align;    	
    }
    public function SetWidth($width)
    {
    	$this->width = $width;    	
    }    
    public function SetSummary($dados)
    {
    	$this->SetFont('Arial','B',8);
    	$this->Cell(40,5,'TOTAL DE REGISTROS',1,0,'L');
    	$this->Cell(40,5,count($dados),1,1,'R');   	
    }    
}

?>
