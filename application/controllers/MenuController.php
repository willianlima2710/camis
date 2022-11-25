<?php

class MenuController extends Zend_Controller_Action {
	
	public function init()
	{
						
	}	
	
	public function indexAction()
	{			
		$this->_redirect('menu/listar');
	}
			
	public function listarAction()
	{
		// Desativando renderização do layout 		
 		$this->_helper->layout->disableLayout();
 		
 		// Desativando renderização da view
 		$this->_helper->_viewRenderer->setNoRender(true);

 		$menu = new Model_DbTable_Menu();
		$dadosMenu = $menu->listarMenu();
						
		for($i=0;$i<count($dadosMenu);$i++) {								
			$chave = $dadosMenu[$i]['menu_id'];
			for($x=0;$x<count($dadosMenu);$x++) {				
				if($dadosMenu[$x]['menu_filho']==$chave) {
					$filhos[] = array(id=>$dadosMenu[$x]['menu_id'],text=>($dadosMenu[$x]['menu_desc']),
					                  leaf=>true,cls=>$dadosMenu[$x]['menu_js'],eXtype=>$dadosMenu[$x]['menu_ejs']);
				}
			}
		
 	        if ($dadosMenu[$i]['menu_filho']==0) { 	        	
 	        	if(count($filhos)!=0) {
 	        		$pai[] = array(id=>$dadosMenu[$i]['menu_id'],text=>($dadosMenu[$i]['menu_desc']),leaf=>false,children=>$filhos);
	     	    } else {	     	    	
    	    		$pai[] = array(id=>$dadosMenu[$i]['menu_id'],text=>($dadosMenu[$i]['menu_desc']),leaf=>true);
 	         	}
 	        }	    
 	        unset($filhos);
		}				
		echo json_encode($pai);
	}	
}
?>

