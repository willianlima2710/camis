<?php

class LoginController extends Zend_Controller_Action
{
	public function indexAction()
	{		
		$this->view->headTitle('Login');	
	}

	public function logarAction()
	{
		$this->_helper->removeHelper('viewRenderer');
		$this->_helper->layout->disableLayout();
		
		if ($this->_request->isPost()) {			
			
			$filter = new Zend_Filter();
			$filter->addFilter( new Zend_Filter_StringTrim() );
			
			$nome  = $filter->filter($this->_request->getPost('nome'));
			$senha = $filter->filter($this->_request->getPost('senha'));	

			try {
				
				$auth = Zend_Auth::getInstance();		        		        
		        $auth->clearIdentity();
		        $authAdapter = new Zend_Auth_Adapter_DbTable();													
		        $authAdapter->setTableName('cad_usuario')
				          	->setIdentityColumn('usuario_login')
					        ->setCredentialColumn('usuario_senha')
					        ->setCredentialTreatment('md5(?)')					        
					        ->setIdentity($nome)
					        ->setCredential($senha);
						
		        $result              = $auth->authenticate($authAdapter);
		        $result->auth        = $auth;
		        $result->authAdapter = $authAdapter;      

				switch ($result->getCode()) {
				    case Zend_Auth_Result::FAILURE_IDENTITY_NOT_FOUND:
						$mensagem = "{success: false, msg: {text: 'Usu&aacute;rio desconhecido ou senha incorreta!', code: '2'}}";
				        break;
				    case Zend_Auth_Result::FAILURE_CREDENTIAL_INVALID:
						$mensagem = "{success: false, msg: {text: 'Usu&aacute;rio desconhecido ou senha incorreta!', code: '3'}}";
				        break;
				    case Zend_Auth_Result::SUCCESS:
						$data = $result->authAdapter->getResultRowObject(null,	'senha');
						if($data->usuario_nivel_acesso > 0){
							$empresa = new Model_DbTable_Empresa(); 		    
 		                    $dadosEmpresa = current($empresa->todoEmpresa());
																					
							$dados = get_object_vars($authAdapter->getResultRowObject(array('usuario_id', 'usuario_nome','usuario_login')));
                    	    $auth->getStorage()->write($data);
							$mensagem = "{success:true, link: '{$this->_request->getBaseUrl()}',nivel: '{$data->usuario_nivel_acesso}',empresa: '{$dadosEmpresa['empresa_desc']}'}";							
						} else {
							$result->auth->clearIdentity();
							$mensagem = "{success:false, msg: {text: 'Voc&ecirc; n&atilde;o tem permiss&atilde;o de acesso', code:'2'}}";
						}
						break;
				}
			    				
			} catch (Zend_Db_Adapter_Exception $e) {					
				$mensagem = "{success:false, msg: {text: 'Erro conexao, ". $e->getMessage() ."', code:'6'}}";
			} catch (Zend_Exception $e) {
				$mensagem = "{success:false, msg: {text: 'Erro Sistema, ".$e->getMessage()."', code:'6'}}";
			}
			$this->getResponse()->clearBody();
			$this->getResponse()->setHeader('Content-Type', 'text/x-json');
			$this->getResponse()->setBody($mensagem);
		}
	}
	
	function logoutAction()
	{
		$this->_helper->removeHelper('viewRenderer');
		$this->_helper->layout->disableLayout();
		//Zend_Registry::_unsetInstance();
		Zend_Auth::getInstance()->clearIdentity();		
		$this->_redirect('/login/');
	}
}