<?php

class IndexController extends Zend_Controller_Action
{
    public function indexAction()
    {
	}
	function preDispatch()
	{
		$auth = Zend_Auth::getInstance();
		if (!$auth->hasIdentity()) {
			$this->_redirect('/login/');
		}  
	}	
}	