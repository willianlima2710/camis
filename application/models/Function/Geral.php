<?php

class Model_Function_Geral  {
	
	public function databrGeral($data)
	{					
		if (!empty($data)&& ($data<>"0000-00-00")) {				
			$data = date("d/m/Y", strtotime($data));
		} else {
			$data = null;
		}				
	   	return $data;	              	    
	}	
	public function dataeuaGeral($data) 
	{
		if(!empty($data)){
			$data = implode("-",array_reverse(explode("/",$data)));			
		}else{
			$data = null;
		}
		return $data;		
	}
	public function moedabraGeral($valor=0,$decimal=2)
	{
		return number_format($valor,$decimal,",","."); 			
	}
	public function moedabraEua($valor=0,$decimal=2)
	{
            $valor = str_replace(".", "", "$valor");
            $valor = str_replace(",", ".", "$valor");
            return $valor;             
	}		
	public function valorporextenso($valor=0) 
	{
		$singular = array("centavo", "real", "mil", "milhão", "bilhão", "trilhão", "quatrilhão");
		$plural = array("centavos", "reais", "mil", "milhões", "bilhões", "trilhões",
						"quatrilhões");
		$c = array("", "cem", "duzentos", "trezentos", "quatrocentos",
				   "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos");
        $d = array("", "dez", "vinte", "trinta", "quarenta", "cinquenta",
				   "sessenta", "setenta", "oitenta", "noventa");
        $d10 = array("dez", "onze", "doze", "treze", "quatorze", "quinze",
                        "dezesseis", "dezesete", "dezoito", "dezenove");
        $u = array("", "um", "dois", "três", "quatro", "cinco", "seis",
                      "sete", "oito", "nove");
        $z=0;

        $valor = number_format($valor, 2, ".", ".");
		$inteiro = explode(".", $valor);
		for($i=0;$i<count($inteiro);$i++)
			for($ii=strlen($inteiro[$i]);$ii<3;$ii++)
				$inteiro[$i] = "0".$inteiro[$i];
			//	$fim identifica onde que deve se dar junção de centenas por "e" ou por "," ;)
		$fim = count($inteiro) - ($inteiro[count($inteiro)-1] > 0 ? 1 : 2);
		for ($i=0;$i<count($inteiro);$i++) {
			$valor = $inteiro[$i];
			$rc = (($valor > 100) && ($valor < 200)) ? "cento" : $c[$valor[0]];
			$rd = ($valor[1] < 2) ? "" : $d[$valor[1]];
			$ru = ($valor > 0) ? (($valor[1] == 1) ? $d10[$valor[2]] : $u[$valor[2]]) : "";

			$r = $rc.(($rc && ($rd || $ru)) ? " e " : "").$rd.(($rd &&
			   		   $ru) ? " e " : "").$ru;
			$t = count($inteiro)-1-$i;
			$r .= $r ? " ".($valor > 1 ? $plural[$t] : $singular[$t]) : "";
			if ($valor == "000")$z++; elseif ($z > 0) $z--;
			if (($t==1) && ($z>0) && ($inteiro[0] > 0)) $r .= (($z>1) ? " de " : "").$plural[$t]; 
			if ($r) $rt = $rt . ((($i > 0) && ($i <= $fim) &&
						  ($inteiro[0] > 0) && ($z < 1)) ? ( ($i < $fim) ? ", " : " e ") : " ") . $r;
		}
		return($rt ? strtoupper($rt) : "zero");
	}
    // funcao que converte caracteres vindo do extjs para
	// grava no banco de dados
	public function subAjax($post)
	{
		$newpost = array();	    	
    	for($i=0;$i<=(count($post)-1);$i++){
    		$vog = array('"',"{","}");
    		$rplpost = str_replace($vog,"",$post[$i]);
    		$rplpost = str_replace(":",",",$rplpost);
    		array_push($newpost,explode(",",$rplpost)); 		
    	}
    	return $newpost; 		
	}
	/* ************************************************************
     * atualiza o saldo do dia buscando conta,data e empresa
     * anilisando se é receber(0) ou pagar(1)
    */
	public function atzSaldo($banco,$mesano,$valor,$tipo,$usuario)
	{
		$saldo = new Model_DbTable_Saldo();		 
		$dadosSaldo = $saldo->buscarSaldo($banco,$mesano);
				
		// verifica se já foi criado o saldo do dia
		if(count($dadosSaldo)==0){
			$dadosSaldo = array(
			'banco_id'=>$banco,			
			'saldo_mesano'=>$mesano,
			'usuario_login'=>$usuario		
			);
			$saldo->insert($dadosSaldo);
			$pksaldo = $saldo->getAdapter()->lastInsertId();
		} else {
			$dadosSaldo = current($dadosSaldo);
			$pksaldo = $dadosSaldo['saldo_id'];			
		}
		
		// verifica se é debito ou credito
		// 0 - credito
		// 1 - debito
		if($tipo=='0'){
			$valor = $dadosSaldo['saldo_valor'] + $valor;
			$dadosSaldo = array(
			'saldo_valor'=>$valor,
			'usuario_login'=>$usuario
			);
		}else{
			$valor = $dadosSaldo['saldo_valor'] - $valor;
			$dadosSaldo = array(
			'saldo_valor'=>$valor,
			'usuario_login'=>$usuario					
			);
		}
		$saldo->update($dadosSaldo,"saldo_id={$pksaldo}");
		return $atual;
	}	
		/* ************************************************************
     * estorna o saldo do dia buscando conta,data e empresa
     * anilisando se é receber(0) ou pagar(1)
    */
	public function estSaldo($conta,$data,$empresa,$value,$tipo)
	{
		$saldo = new Model_DbTable_Saldo();		 
		$dadosSaldo = $saldo->buscarSaldo($conta,$data,$empresa);				
		
		$dadosSaldo = current($dadosSaldo);
		$pksaldo = $dadosSaldo['saldo_id'];
					
		// verifica se é debito ou credito
		// 0 - credito
		// 1 - debito
		if($tipo=='0'){
			$entrada = $dadosSaldo['saldo_entrada'] - $value;
			$atual = $dadosSaldo['saldo_atual'] - $value;  			
			$dadosSaldo = array(
			'saldo_entrada'=>$entrada,
			'saldo_atual'=>$atual
			);
		}else{
			$saida = $dadosSaldo['saldo_saida'] + $value;
			$atual = $dadosSaldo['saldo_atual'] + $value;  			
			$dadosSaldo = array(
			'saldo_saida'=>$saida,
			'saldo_atual'=>$atual
			);			
		}
		$saldo->update($dadosSaldo,"saldo_id={$pksaldo}");
		return $atual;
	}
	/* ************************************************************
	 * exclui os dados do caixa,retorna o saldo e vendas
	 * mediante dados do contas a receber
    */
	public function excluircaixaCtarec($dadosCtarec)
	{		
		$caixa = new Model_DbTable_Caixa();
		$venda = new Model_DbTable_Venda();
		
		/* ************************************************************
    	 * exclui do caixa 
    	*/								
	    $condicao = array(
	    'locfor_id = ?'=>$dadosCtarec['locatario_id'],
	    'jazigo_codigo = ?'=>$dadosCtarec['jazigo_codigo'],
	    'empresa_id = ?'=>$dadosCtarec['empresa_id'],
	    'caixa_documento = ?'=>$dadosCtarec['ctarec_documento'],	    	        
	    'conta_id = ?'=>$dadosCtarec['conta_id'],
	    'operacao_id = ?'=>$dadosCtarec['operacao_id'],	    
	    'caixa_intipo = ?'=>'0'
	    );
	    $caixa->delete($condicao);
	    
		/* ************************************************************
    	 * exclui a venda
    	*/								
	    $condicao = array(
	    'locatario_id = ?'=>$dadosCtarec['locatario_id'],
	    'jazigo_codigo = ?'=>$dadosCtarec['jazigo_codigo'],
	    'venda_documento = ?'=>$dadosCtarec['ctarec_documento'],	    	        
	    'operacao_id = ?'=>$dadosCtarec['operacao_id']
	    );
	    $venda->delete($condicao);	    	    

	    /* ************************************************************
    	 * atualiza o saldo diario
    	*/
	    /*
    	$this->estSaldo($dadosCtarec['conta_id'],
    	                $dadosCtarec['ctarec_data_emissao'],
    	                $dadosCtarec['empresa_id'],
    	                $dadosCtarec['ctarec_saldo'],
    	                '0');
    	*/                
    	                
	}
	/* ************************************************************
	 * exclui os dados do caixa,retorna o saldo
	 * mediante dados do contas a pagar
    */
	public function excluircaixaCtapag($dadosCtapag)
	{		
		$caixa = new Model_DbTable_Caixa();
		
		/* ************************************************************
    	 * exclui do caixa 
    	*/								
	    $condicao = array(
	    'locfor_id = ?'=>$dadosCtapag['fornecedor_id'],
	    'empresa_id = ?'=>$dadosCtapag['empresa_id'],
	    'caixa_documento = ?'=>$dadosCtapag['ctapag_documento'],	    	        
	    'conta_id = ?'=>$dadosCtapag['conta_id'],
	    'operacao_id = ?'=>$dadosCtapag['operacao_id'],
	    'caixa_intipo = ?'=>'1'
	    );
	    $caixa->delete($condicao);
	    
	    /* ************************************************************
    	 * atualiza o saldo diario
    	*/
	    /*
    	$this->estSaldo($dadosCtarec['conta_id'],
    	                $dadosCtarec['ctarec_data_emissao'],
    	                $dadosCtarec['empresa_id'],
    	                $dadosCtarec['ctarec_saldo'],
    	                '0');
    	*/                
    	                
	}	
	/* ************************************************************
     * busca e retorna o usuario ativo no sistema
    */	
	public function userAtivo()
	{		
        $user = Zend_Auth::getInstance()->getStorage()->read();
        if (empty($user)) {
        	$usr = strtolower($_COOKIE['nome']);
        }else{
        	$usr = $user->usuario_login;
        }          
        return $usr;
	}
	/* ************************************************************
     * função que retorna nome de arquivo valido no sistema
     * usado para relatorio PDF
    */
	public function retArquivo($modulo,$extencao='.PDF')
	{
		$path = './public/tmp/';
		$usr = strtoupper(substr($_COOKIE['nome'],0,strpos($_COOKIE['nome'],'@')));
		
		$arquivo = $path.'REL'.strtoupper($usr).$extencao;
		return $arquivo;		
	}
	/* ************************************************************
     * função que calcula a diferença entre datas
     * seja dia,mes ou ano
    */
	public function dateDiff ($inicio, $fim, $tipo)
	{
		if (!$fim || $fim < $inicio) {
			return "A data final deve ser maior que a inicial.";
		} elseif ($inicio < "1970-01-01") {
			return "A data final deve ser maior que 01/01/1970.";
		} else {
			if (strlen($inicio) > 10) {
				$time_inicio = mktime(substr($inicio,-8,2),substr($inicio,-5,2),substr($inicio,-2), substr($inicio,5,2), substr($inicio,8,2), substr($inicio,0,4));
			} else {
				$time_inicio = mktime(0,0,0, substr($inicio,5,2), substr($inicio,-2), substr($inicio,0,4));
		    }
		    if (strlen($fim) > 10) {
		    	$time_fim = mktime(substr($fim,-8,2),substr($fim,-5,2),substr($fim,-2), substr($fim,5,2), substr($fim,8,2), substr($fim,0,4));
		    } else {
		    	$time_fim = mktime(0,0,0, substr($fim,5,2), substr($fim,-2), substr($fim,0,4));
		    }
            $diferenca = ($time_fim - $time_inicio);
            switch($tipo){
            	case "i": return round($diferenca/60);	  break;
            	case "H": return round($diferenca/3600);  break;
            	case "d": return round($diferenca/86400); break;
            }
        }
    }
}

?>
