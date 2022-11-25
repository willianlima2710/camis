<?php
class ErrorController extends Zend_Controller_Action
{
    public function errorAction()
    {
        $errors = $this->_getParam('error_handler');

		$this->view->headTitle('Erro');	
		
        switch ($errors->type) {
            case Zend_Controller_Plugin_ErrorHandler::EXCEPTION_NO_CONTROLLER:
            case Zend_Controller_Plugin_ErrorHandler::EXCEPTION_NO_ACTION:
                $this->getResponse()->setRawHeader('HTTP/1.1 404 Not Found');
                $content =<<<EOH
<h1>Erro!</h1>
<p>Essa pagina não existe.</p>
EOH;
                break;
            default:
                $content =<<<EOH
<h1>Erro!</h1>
<p>An unexpected error occurred with your request. Please try again later.</p>
EOH;
                break;
        }
        $this->getResponse()->clearBody();
        $this->view->content = $content;
    }
}
    